import {
  absoluteFile,
  fetchKHCNAIESI,
  invalidResponse,
  parseBackend,
  toErrorResponse,
} from "@/lib/khcn-aiesi/backend";
import { uploadResponseSchema } from "@/lib/khcn-aiesi/schemas";

const ALLOWED_EXTENSIONS: Record<string, true> = {
  pdf: true,
  doc: true,
  docx: true,
  xls: true,
  xlsx: true,
  ppt: true,
  pptx: true,
  png: true,
  jpg: true,
  jpeg: true,
  gif: true,
  zip: true,
  rar: true,
};
const MAX_FILES = 10;
const MAX_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request) {
  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return invalidResponse("We couldn't read the uploaded data. Please try again.");
  }

  const files = incoming
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length === 0) {
    return invalidResponse("Please choose at least one file.");
  }
  if (files.length > MAX_FILES) {
    return invalidResponse(`You can upload up to ${MAX_FILES} files at a time.`);
  }

  const invalidFile = files.find((file) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    return file.size > MAX_BYTES || !ALLOWED_EXTENSIONS[extension];
  });
  if (invalidFile) {
    return invalidResponse(
      `The file “${invalidFile.name}” has an unsupported format or is larger than 50 MiB.`,
    );
  }

  const outgoing = new FormData();
  files.forEach((file) => outgoing.append("files", file, file.name));

  try {
    const data = parseBackend(
      uploadResponseSchema,
      await fetchKHCNAIESI(
        "KHCN_AIESI_Upload",
        { method: "POST", body: outgoing },
        { exposeJsonMessage: true },
      ),
    );
    return Response.json({
      ok: true,
      data: { ...data, body: data.body.map(absoluteFile) },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
