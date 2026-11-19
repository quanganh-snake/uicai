import {
  fetchKHCNAIESI,
  invalidResponse,
  parseBackend,
  toErrorResponse,
} from "@/lib/khcn-aiesi/backend";
import { browserPost } from "@/lib/khcn-aiesi/route-utils";
import {
  postIdSchema,
  postListResponseSchema,
} from "@/lib/khcn-aiesi/schemas";

export async function GET(request: Request) {
  const parsed = postIdSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success) {
    return invalidResponse("This submission could not be identified.");
  }

  const query = new URLSearchParams(parsed.data);
  try {
    const data = parseBackend(
      postListResponseSchema,
      await fetchKHCNAIESI(
        `KHCN_AIESI_BaiDang_Load_R_Para_File?${query}`,
      ),
    );
    return Response.json({
      ok: true,
      data: { ...data, body: data.body.map(browserPost) },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
