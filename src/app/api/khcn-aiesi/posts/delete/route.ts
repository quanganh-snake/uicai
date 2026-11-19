import {
  fetchKHCNAIESI,
  invalidResponse,
  parseBackend,
  toErrorResponse,
} from "@/lib/khcn-aiesi/backend";
import {
  mutationResponseSchema,
  postIdSchema,
} from "@/lib/khcn-aiesi/schemas";

export async function DELETE(request: Request) {
  const parsed = postIdSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return invalidResponse("This submission could not be identified.");
  }

  try {
    const data = parseBackend(
      mutationResponseSchema,
      await fetchKHCNAIESI("KHCN_AIESI_BaiDang_Del_Para", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      }),
    );
    return Response.json({ ok: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
