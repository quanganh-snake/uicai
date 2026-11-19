import { cookies } from "next/headers";

import { isAdminUser } from "@/lib/auth/admin";
import {
  AUTH_COOKIE_NAME,
  parseAuthSession,
} from "@/lib/auth/session";
import {
  BackendHttpError,
  fetchKHCNAIESI,
  invalidResponse,
  parseBackend,
  toErrorResponse,
} from "@/lib/khcn-aiesi/backend";
import { upstreamFiles } from "@/lib/khcn-aiesi/route-utils";
import {
  editPostSchema,
  mutationResponseSchema,
  postListResponseSchema,
} from "@/lib/khcn-aiesi/schemas";

export async function PUT(request: Request) {
  const parsed = editPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return invalidResponse(
      "The update details are not valid.",
      parsed.error.flatten(),
    );
  }

  const store = await cookies();
  const session = parseAuthSession(store.get(AUTH_COOKIE_NAME)?.value);
  if (!session?.token) {
    return toErrorResponse(
      new BackendHttpError(401, "Your session is not valid. Please sign in again."),
    );
  }

  try {
    const detailQuery = new URLSearchParams({
      KHCN_AIESI_BaiDang_ID: parsed.data.KHCN_AIESI_BaiDang_ID,
    });
    const detail = parseBackend(
      postListResponseSchema,
      await fetchKHCNAIESI(
        `KHCN_AIESI_BaiDang_Load_R_Para_File?${detailQuery}`,
      ),
    );
    const current = detail.body[0];
    if (!current) {
      throw new BackendHttpError(404, "We couldn't find that submission.");
    }

    const isAdmin = isAdminUser(session.user);
    if (!isAdmin) {
      if (current.HT_USER_Create !== session.user.id) {
        throw new BackendHttpError(403, "You don't have permission to edit this submission.");
      }
      if (current.KHCN_AIESI_BaiDang_TrangThai !== null) {
        throw new BackendHttpError(
          409,
          "Only submissions in the “Submitted” status can be edited or cancelled.",
        );
      }
      if (
        parsed.data.KHCN_AIESI_BaiDang_TrangThai !== null &&
        parsed.data.KHCN_AIESI_BaiDang_TrangThai !== -1
      ) {
        throw new BackendHttpError(
          403,
          "You can only edit the content of your submission or cancel it.",
        );
      }
    }
    const payload = {
      ...parsed.data,
      KHCN_AIESI_BaiDang_LinkFile: upstreamFiles(
        parsed.data.KHCN_AIESI_BaiDang_LinkFile,
      ),
      // SP_KHCN_AIESI_BaiDang_Edit_Para overwrites every column, so a request
      // that omits the track must still resend the submission's current one.
      KHCN_AIESI_BaiDang_LinhVuc:
        parsed.data.KHCN_AIESI_BaiDang_LinhVuc ??
        current.KHCN_AIESI_BaiDang_LinhVuc ??
        "",
    };
    const data = parseBackend(
      mutationResponseSchema,
      await fetchKHCNAIESI("KHCN_AIESI_BaiDang_Edit_Para", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
    return Response.json({ ok: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
