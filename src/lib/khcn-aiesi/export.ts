import "server-only";

import { z } from "zod";

import {
  BackendHttpError,
  fetchKHCNAIESI,
  parseBackend,
} from "@/lib/khcn-aiesi/backend";
import { passthroughQuery } from "@/lib/khcn-aiesi/route-utils";
import {
  pagedResponseSchema,
  postSchema,
  type ExportPost,
} from "@/lib/khcn-aiesi/schemas";

const MAX_FALLBACK_PAGES = 100;
const FALLBACK_PAGE_SIZE = 200;

const textColumn = z
  .union([z.string(), z.number()])
  .nullish()
  .transform((value) => {
    if (value === null || value === undefined) return undefined;
    const trimmed = String(value).trim();
    return trimmed.length > 0 ? trimmed : undefined;
  });

const exportPostSchema = postSchema.extend({
  NguoiGui_HoTen: textColumn,
  NguoiGui_Email: textColumn,
  NguoiGui_SoDienThoai: textColumn,
  NguoiGui_DonVi: textColumn,
  NguoiGui_ChucVu: textColumn,
  NguoiGui_TenDangNhap: textColumn,
});

const exportListResponseSchema = z
  .object({
    code: z.coerce.number().int().nullish(),
    message: z.string().nullish(),
    body: z.array(exportPostSchema).nullish(),
  })
  .loose()
  .transform((payload) => ({
    code: payload.code ?? 200,
    message: payload.message ?? "",
    body: (payload.body ?? []) as ExportPost[],
  }));

export async function loadExportRows(): Promise<{
  rows: ExportPost[];
  source: "export" | "fallback";
}> {
  try {
    const raw = await fetchKHCNAIESI("KHCN_AIESI_BaiDang_Load_Export");
    const data = parseBackend(
      exportListResponseSchema,
      raw,
    );
    return { rows: data.body, source: "export" };
  } catch (error) {
    if (error instanceof BackendHttpError && error.status === 401) throw error;
    console.warn(
      "[khcn-aiesi] export_endpoint_unavailable",
      JSON.stringify({ reason: String(error) }),
    );
  }

  const rows: ExportPost[] = [];
  for (let pageNumber = 1; pageNumber <= MAX_FALLBACK_PAGES; pageNumber++) {
    const query = passthroughQuery({ pageNumber, pageSize: FALLBACK_PAGE_SIZE });
    const page = parseBackend(
      pagedResponseSchema,
      await fetchKHCNAIESI(`KHCN_AIESI_BaiDang_Load_Paged?${query}`),
    );
    rows.push(...(page.body as ExportPost[]));
    if (page.body.length === 0 || pageNumber >= page.pagination.totalPages) break;
  }
  return { rows, source: "fallback" };
}
