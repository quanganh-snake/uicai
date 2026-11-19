import {
  backendFile,
  fetchKHCNAIESI,
  invalidResponse,
  parseBackend,
  toErrorResponse,
} from "@/lib/khcn-aiesi/backend";
import {
  deleteFilesResponseSchema,
  deleteFilesSchema,
} from "@/lib/khcn-aiesi/schemas";

async function remove(request: Request, method: "DELETE" | "POST") {
  const parsed = deleteFilesSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return invalidResponse("The list of files to delete is not valid.");
  }

  const fileUrls = parsed.data.fileUrls.map(
    (URL) => backendFile({ TenFileGoc: "", TenFileSlug: "", URL }).URL,
  );

  try {
    const data = parseBackend(
      deleteFilesResponseSchema,
      await fetchKHCNAIESI(
        "KHCN_AIESI_DeleteFile",
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrls }),
        },
        { exposeJsonMessage: true },
      ),
    );
    return Response.json({ ok: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function DELETE(request: Request) {
  return remove(request, "DELETE");
}

export function POST(request: Request) {
  return remove(request, "POST");
}
