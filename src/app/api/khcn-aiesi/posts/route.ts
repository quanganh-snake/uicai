import {
  fetchKHCNAIESI,
  invalidResponse,
  parseBackend,
  toErrorResponse,
} from "@/lib/khcn-aiesi/backend";
import {
  addPostSchema,
  mutationResponseSchema,
  pagedQuerySchema,
  pagedResponseSchema,
} from "@/lib/khcn-aiesi/schemas";
import {
  browserPost,
  passthroughQuery,
  upstreamFiles,
} from "@/lib/khcn-aiesi/route-utils";

export async function GET(request: Request) {
  const raw = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = pagedQuerySchema.safeParse({
    ...raw,
    pageNumber: raw.pageNumber ?? raw.SoTrang,
    pageSize: raw.pageSize ?? raw.SoBanGhiTrenTrang,
  });
  if (!parsed.success) {
    return invalidResponse("The search options are not valid.", parsed.error.flatten());
  }

  const input = { ...parsed.data };
  delete input.SoTrang;
  delete input.SoBanGhiTrenTrang;
  const query = passthroughQuery(input);

  try {
    const data = parseBackend(
      pagedResponseSchema,
      await fetchKHCNAIESI(`KHCN_AIESI_BaiDang_Load_Paged?${query}`),
    );
    return Response.json({
      ok: true,
      data: { ...data, body: data.body.map(browserPost) },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const parsed = addPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return invalidResponse(
      "The submission details are not valid.",
      parsed.error.flatten(),
    );
  }

  try {
    const payload = {
      ...parsed.data,
      KHCN_AIESI_BaiDang_LinkFile: upstreamFiles(
        parsed.data.KHCN_AIESI_BaiDang_LinkFile,
      ),
    };
    const data = parseBackend(
      mutationResponseSchema,
      await fetchKHCNAIESI("KHCN_AIESI_BaiDang_Add_Para", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
    return Response.json({ ok: true, data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
