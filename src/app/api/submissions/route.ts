import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  AUTH_COOKIE_NAME,
  parseAuthSession,
  shouldUseSecureCookie,
} from "@/lib/auth/session";
import {
  BackendHttpError,
  fetchKHCNAIESI,
  parseBackend,
} from "@/lib/khcn-aiesi/backend";
import {
  mutationResponseSchema,
  uploadResponseSchema,
} from "@/lib/khcn-aiesi/schemas";
import type { UploadedFile } from "@/lib/khcn-aiesi/types";
import {
  isAcceptedPaperFile,
  MAX_PAPER_FILE_BYTES,
  MAX_SUBMISSION_FILES,
  MAX_SUBMISSION_TOTAL_BYTES,
  paperSubmissionSchema,
} from "@/lib/validations/submission";

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

const EXPIRED_SESSION_MESSAGE =
  "Your session has ended. Please sign in again to continue.";


function expiredSessionError(request: NextRequest) {
  const response = jsonError(EXPIRED_SESSION_MESSAGE, 401);
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
    path: "/",
    maxAge: 0,
    priority: "high",
  });
  return response;
}


/**
 * Each stage (file upload / saving the paper) has its own message: apiv3 runs behind IIS so
 * its real message is usually replaced by an HTML error page, and one generic
 * sentence would not tell the submitter which step failed.
 */
function stageError(
  request: NextRequest,
  error: unknown,
  fallbackMessage: (status: number) => string,
) {
  if (error instanceof BackendHttpError) {
    if (error.status === 401 || error.status === 403) {
      return expiredSessionError(request);
    }

    return jsonError(
      error.genericHttpMessage ? fallbackMessage(error.status) : error.message,
      error.status,
    );
  }

  return jsonError("The submission service is currently unavailable.", 502);
}

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

async function removeUploadedFiles(fileUrls: string[]) {
  try {
    await fetchKHCNAIESI(
      "KHCN_AIESI_DeleteFile",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrls }),
      },
      { exposeJsonMessage: true },
    );
  } catch {
    // The backend cleanup job removes abandoned uploads if immediate cleanup fails.
  }
}

export async function POST(request: NextRequest) {
  const session = parseAuthSession(
    request.cookies.get(AUTH_COOKIE_NAME)?.value,
  );

  if (!session?.token) {
    return expiredSessionError(request);
  }

  const accountType = session.user.Role;
  // Notification address for the submission-received email; an account whose
  // profile carries no usable address submits without the notification.
  const senderEmail = z.email().safeParse(session.user.email.trim());

  let incomingFormData: FormData;
  try {
    incomingFormData = await request.formData();
  } catch {
    return jsonError("The submission data could not be read.", 400);
  }

  const fields = {
    title: getText(incomingFormData, "title"),
    abstract: getText(incomingFormData, "abstract"),
    authors: getText(incomingFormData, "authors"),
    keywords: getText(incomingFormData, "keywords"),
    linhVuc: getText(incomingFormData, "linhVuc"),
  };
  const parsedFields = paperSubmissionSchema.safeParse(fields);

  if (!parsedFields.success) {
    return jsonError(
      parsedFields.error.issues[0]?.message || "Check the submission fields.",
      400,
    );
  }

  const files = incomingFormData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    return jsonError("Attach at least one manuscript file.", 400);
  }

  if (files.length > MAX_SUBMISSION_FILES) {
    return jsonError(
      `You can attach up to ${MAX_SUBMISSION_FILES} files.`,
      400,
    );
  }

  const unsupportedFile = files.find(
    (file) => !isAcceptedPaperFile(file.name),
  );
  if (unsupportedFile) {
    return jsonError(
      `${unsupportedFile.name} is not a .doc, .docx, or .pdf file.`,
      400,
    );
  }

  // The upstream limits below make apiv3 return 400 with the message replaced by IIS
  // with an HTML page, so they must be blocked here so the submitter knows the real reason.
  if (files.some((file) => !file.name.trim())) {
    return jsonError("An attached file has no name.", 400);
  }

  const oversizedFile = files.find((file) => file.size > MAX_PAPER_FILE_BYTES);
  if (oversizedFile) {
    return jsonError(`${oversizedFile.name} is larger than the 50 MB limit.`, 400);
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > MAX_SUBMISSION_TOTAL_BYTES) {
    return jsonError("The attached files exceed the 28 MB total limit.", 400);
  }

  const outboundFiles = new FormData();
  files.forEach((file) => outboundFiles.append("files", file, file.name));

  let uploadedFiles: UploadedFile[];
  try {
    uploadedFiles = parseBackend(
      uploadResponseSchema,
      await fetchKHCNAIESI(
        "KHCN_AIESI_Upload",
        { method: "POST", body: outboundFiles },
        { exposeJsonMessage: true, timeoutMs: 120_000 },
      ),
    ).body;
  } catch (error) {
    return stageError(
      request,
      error,
      (status) =>
        `We couldn't upload your files (HTTP ${status}). Please try again or use smaller files.`,
    );
  }

  try {
    const submissionResult = parseBackend(
      mutationResponseSchema,
      await fetchKHCNAIESI(
        "KHCN_AIESI_BaiDang_Add_Para",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            KHCN_AIESI_BaiDang_TenBai: parsedFields.data.title,
            KHCN_AIESI_BaiDang_TomTat: parsedFields.data.abstract,
            KHCN_AIESI_BaiDang_TacGia: parsedFields.data.authors,
            KHCN_AIESI_BaiDang_TuKhoa: parsedFields.data.keywords,
            KHCN_AIESI_BaiDang_LinhVuc: parsedFields.data.linhVuc,
            KHCN_AIESI_BaiDang_LinkFile: uploadedFiles,
            KHCN_AIESI_BaiDang_TrangThai: null,
            KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung: "",
            KHCN_AIESI_BaiDang_NguonTiepNhan: 1,
            KHCN_AIESI_BaiDang_LoaiTaiKhoan: accountType,
            KHCN_AIESI_BaiDang_EmailNguoiGui: senderEmail.success
              ? senderEmail.data
              : "",
          }),
        },
        { exposeJsonMessage: true },
      ),
    );

    return NextResponse.json({
      success: true,
      message:
        submissionResult.message ||
        "Your paper has been submitted successfully.",
    });
  } catch (error) {
    await removeUploadedFiles(uploadedFiles.map((file) => file.URL));
    return stageError(
      request,
      error,
      (status) =>
        `We couldn't save your paper (HTTP ${status}). Please try again.`,
    );
  }
}
