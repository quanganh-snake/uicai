import {
  fetchKHCNAIESI,
  parseBackend,
  toErrorResponse,
} from "@/lib/khcn-aiesi/backend";
import { linhVucListResponseSchema } from "@/lib/khcn-aiesi/schemas";

export async function GET() {
  try {
    const data = parseBackend(
      linhVucListResponseSchema,
      await fetchKHCNAIESI("KHCN_AIESI_LinhVuc_Load"),
    );

    const fields = data.body
      .filter((field) => field.KHCN_AIESI_LinhVuc_HoatDong)
      .sort(
        (a, b) =>
          (a.KHCN_AIESI_LinhVuc_STT ?? 0) - (b.KHCN_AIESI_LinhVuc_STT ?? 0),
      )
      .map((field) => ({
        id: field.KHCN_AIESI_LinhVuc_ID,
        ten: field.KHCN_AIESI_LinhVuc_Ten ?? "",
      }));

    return Response.json({ ok: true, data: fields });
  } catch (error) {
    return toErrorResponse(error);
  }
}
