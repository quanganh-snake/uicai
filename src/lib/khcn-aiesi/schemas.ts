import { z } from "zod";

/** Data contract sent TO the backend: keep it strict. */
export const uploadedFileSchema = z.object({
  TenFileGoc: z.string(),
  TenFileSlug: z.string(),
  URL: z.string().min(1),
});

function fileNameFromUrl(url: string) {
  const last = url.split(/[\\/]/).pop() ?? "";
  try {
    return decodeURIComponent(last) || "file";
  } catch {
    return last || "file";
  }
}

/** File record RETURNED: the backend may omit the original name or slug. */
const uploadedFileResponseSchema = z
  .object({
    TenFileGoc: z.string().nullish(),
    TenFileSlug: z.string().nullish(),
    URL: z.string().min(1),
  })
  .transform((file) => {
    const slug = file.TenFileSlug?.trim() || fileNameFromUrl(file.URL);
    return {
      TenFileGoc: file.TenFileGoc?.trim() || slug,
      TenFileSlug: slug,
      URL: file.URL,
    };
  });

/** LinkFile comes back as an array, a JSON string, null or broken JSON. */
const linkFileSchema = z
  .preprocess((value) => {
    if (typeof value === "string") {
      try {
        const parsed: unknown = JSON.parse(value.trim() || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return Array.isArray(value) ? value : [];
  }, z.array(z.unknown()))
  .transform((items) =>
    items.flatMap((item) => {
      const parsed = uploadedFileResponseSchema.safeParse(item);
      return parsed.success ? [parsed.data] : [];
    }),
  );

export const nullableText = z
  .union([z.string(), z.number(), z.boolean()])
  .nullish()
  .transform((value) =>
    value === null || value === undefined ? null : String(value),
  );

const nullableInteger = z
  .union([z.number(), z.string()])
  .nullish()
  .transform((value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "string" && !value.trim()) return null;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.trunc(numeric) : null;
  });

export const postSchema = z
  .object({
    KHCN_AIESI_BaiDang_Chon: z
      .boolean()
      .nullish()
      .transform((value) => value ?? false),
    KHCN_AIESI_BaiDang_ID: z.union([z.string(), z.number()]).transform(String),
    KHCN_AIESI_BaiDang_TenBai: nullableText,
    KHCN_AIESI_BaiDang_TomTat: nullableText,
    KHCN_AIESI_BaiDang_TacGia: nullableText,
    KHCN_AIESI_BaiDang_TuKhoa: nullableText,
    KHCN_AIESI_BaiDang_LinkFile: linkFileSchema,
    KHCN_AIESI_BaiDang_TrangThai: nullableInteger,
    KHCN_AIESI_BaiDang_NguoiXuLy_ID: nullableInteger,
    KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian: nullableText,
    KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung: nullableText,
    KHCN_AIESI_BaiDang_NguonTiepNhan: nullableInteger,
    KHCN_AIESI_BaiDang_LoaiTaiKhoan: nullableInteger,
    KHCN_AIESI_BaiDang_LinhVuc: nullableText,
    KHCN_AIESI_BaiDang_EmailNguoiGui: nullableText,
    HT_USER_Create: nullableInteger,
    HT_USER_Editor: nullableInteger,
    KHCN_AIESI_BaiDang_DateCreate: nullableText,
    KHCN_AIESI_BaiDang_DateEditor: nullableText,
    KHCN_AIESI_BaiDang_HienThi: z
      .boolean()
      .nullish()
      .transform((value) => value ?? undefined),
    KHCN_AIESI_BaiDang_SuDung: nullableText,
  })
  .loose();

const successBase = {
  code: z.literal(200),
  arrayLength: z.number().int(),
  message: z.string(),
  rowsAffected: z.number().int(),
};

export const postListResponseSchema = z.object({
  ...successBase,
  body: z.array(postSchema),
});

export const mutationResponseSchema = z.object({
  ...successBase,
  body: z.array(z.unknown()),
});

const pageInteger = (minimum: number) =>
  z.coerce.number().int().min(minimum).optional().catch(undefined);

export const pagedResponseSchema = z
  .object({
    code: z.coerce.number().int().nullish(),
    message: z.string().nullish(),
    body: z.array(postSchema).nullish(),
    pagination: z
      .object({
        pageNumber: pageInteger(1),
        pageSize: pageInteger(1),
        totalRecords: pageInteger(0),
        totalPages: pageInteger(0),
      })
      .loose()
      .nullish(),
  })
  .loose()
  .transform((payload) => {
    const body = payload.body ?? [];
    const pageNumber = payload.pagination?.pageNumber ?? 1;
    return {
      code: payload.code ?? 200,
      message: payload.message ?? "",
      body,
      pagination: {
        pageNumber,
        pageSize: payload.pagination?.pageSize ?? (body.length || 10),
        totalRecords: payload.pagination?.totalRecords ?? body.length,
        totalPages:
          payload.pagination?.totalPages ?? (body.length ? pageNumber : 0),
      },
    };
  });

export type PagedResponse = z.infer<typeof pagedResponseSchema>;

/** KHCN_AIESI_BaiDang_Load_Export adds these submitter columns on top of every
 *  Load_Paged column; admin-only, used by the Excel export route. */
export const exportPostSchema = postSchema.extend({
  NguoiGui_HoTen: nullableText,
  NguoiGui_Email: nullableText,
  NguoiGui_SoDienThoai: nullableText,
  NguoiGui_DonVi: nullableText,
  NguoiGui_ChucVu: nullableText,
  NguoiGui_TenDangNhap: nullableText,
});

export type ExportPost = z.infer<typeof exportPostSchema>;

export const exportListResponseSchema = z
  .object({
    code: z.coerce.number().int().nullish(),
    message: z.string().nullish(),
    body: z.array(exportPostSchema).nullish(),
  })
  .loose()
  .transform((payload) => ({
    code: payload.code ?? 200,
    message: payload.message ?? "",
    body: payload.body ?? [],
  }));

export const uploadResponseSchema = z.object({
  code: z.literal(200),
  message: z.string(),
  body: z.array(uploadedFileResponseSchema),
});

export const deleteFilesResponseSchema = z.object({
  code: z.literal(200),
  message: z.string(),
  deletedFiles: z.array(z.string()),
  errors: z
    .array(z.object({ fileUrl: z.string(), error: z.string() }))
    .optional(),
});

const mutationFields = {
  KHCN_AIESI_BaiDang_TenBai: z.string().trim().min(1).max(2000),
  KHCN_AIESI_BaiDang_TomTat: z.string(),
  KHCN_AIESI_BaiDang_TacGia: z.string(),
  KHCN_AIESI_BaiDang_TuKhoa: z.string().max(2000),
  KHCN_AIESI_BaiDang_LinkFile: z.array(uploadedFileSchema).default([]),
  KHCN_AIESI_BaiDang_TrangThai: z.number().int().nullable().default(null),
  KHCN_AIESI_BaiDang_NguoiXuLy_ID: z.number().int().nullable().optional(),
  KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian: z.string().nullable().optional(),
  KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung: z.string().default(""),
  KHCN_AIESI_BaiDang_NguonTiepNhan: z.number().int().default(0),
  KHCN_AIESI_BaiDang_LoaiTaiKhoan: z.number().int().default(0),
  KHCN_AIESI_BaiDang_EmailNguoiGui: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_LinhVuc: z.string().trim().max(2000).optional(),
};

export const addPostSchema = z.object(mutationFields).strict();
export const editPostSchema = z
  .object({
    ...mutationFields,
    KHCN_AIESI_BaiDang_ID: z.uuid(),
  })
  .strict();
export const postIdSchema = z
  .object({ KHCN_AIESI_BaiDang_ID: z.uuid() })
  .strict();
export const deleteFilesSchema = z
  .object({ fileUrls: z.array(z.string().min(1)).min(1).max(10) })
  .strict();

const booleanish = z
  .union([z.boolean(), z.number(), z.string()])
  .nullish()
  .transform((value) => value === true || value === 1 || value === "1");

export const linhVucSchema = z
  .object({
    KHCN_AIESI_LinhVuc_ID: z.union([z.string(), z.number()]).transform(String),
    KHCN_AIESI_LinhVuc_STT: nullableInteger,
    KHCN_AIESI_LinhVuc_Ma: nullableText,
    KHCN_AIESI_LinhVuc_Ten: nullableText,
    KHCN_AIESI_LinhVuc_MoTa: nullableText,
    KHCN_AIESI_LinhVuc_GhiChu: nullableText,
    KHCN_AIESI_LinhVuc_HoatDong: booleanish,
    KHCN_AIESI_LinhVuc_HienThi: booleanish,
  })
  .loose();

export const linhVucListResponseSchema = z.object({
  ...successBase,
  body: z.array(linhVucSchema),
});

export const pagedQuerySchema = z.object({
  pageNumber: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  SoTrang: z.string().optional(),
  SoBanGhiTrenTrang: z.string().optional(),
  searchText: z.string().trim().optional(),
  trangThai: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_ID: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_TenBai: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_TomTat: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_TacGia: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_TuKhoa: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_LinkFile: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_TrangThai: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_NguoiXuLy_ID: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_NguonTiepNhan: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_LoaiTaiKhoan: z.string().trim().optional(),
  KHCN_AIESI_BaiDang_LinhVuc: z.string().trim().optional(),
  HT_USER_Create: z.string().trim().optional(),
});
