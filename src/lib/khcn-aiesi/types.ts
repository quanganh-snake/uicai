export interface UploadedFile {
  TenFileGoc: string;
  TenFileSlug: string;
  URL: string;
}

export interface KHCNAIESIBaiDang {
  KHCN_AIESI_BaiDang_Chon: boolean;
  KHCN_AIESI_BaiDang_ID: string;
  KHCN_AIESI_BaiDang_TenBai: string | null;
  KHCN_AIESI_BaiDang_TomTat: string | null;
  KHCN_AIESI_BaiDang_TacGia: string | null;
  KHCN_AIESI_BaiDang_TuKhoa: string | null;
  KHCN_AIESI_BaiDang_LinkFile: UploadedFile[];
  KHCN_AIESI_BaiDang_TrangThai: number | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_ID: number | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian: string | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung: string | null;
  KHCN_AIESI_BaiDang_NguonTiepNhan: number | null;
  KHCN_AIESI_BaiDang_LoaiTaiKhoan: number | null;
  KHCN_AIESI_BaiDang_LinhVuc: string | null;
  KHCN_AIESI_BaiDang_EmailNguoiGui?: string | null;
  HT_USER_Create?: number | null;
  HT_USER_Editor?: number | null;
  KHCN_AIESI_BaiDang_DateCreate?: string | null;
  KHCN_AIESI_BaiDang_DateEditor?: string | null;
  KHCN_AIESI_BaiDang_HienThi?: boolean;
  KHCN_AIESI_BaiDang_SuDung?: string | null;
}

export interface ApiSuccess<T> {
  code: 200;
  arrayLength: number;
  message: string;
  rowsAffected: number;
  body: T;
}

export interface PagedSuccess<T> {
  code: 200;
  message: string;
  body: T[];
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface AddKHCNAIESIBody {
  KHCN_AIESI_BaiDang_TenBai: string;
  KHCN_AIESI_BaiDang_TomTat: string;
  KHCN_AIESI_BaiDang_TacGia: string;
  KHCN_AIESI_BaiDang_TuKhoa: string;
  KHCN_AIESI_BaiDang_LinkFile?: UploadedFile[];
  KHCN_AIESI_BaiDang_TrangThai?: number | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_ID?: number | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian?: string | null;
  KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung?: string;
  KHCN_AIESI_BaiDang_NguonTiepNhan?: number;
  KHCN_AIESI_BaiDang_LoaiTaiKhoan?: number;
  /** Recipient of the email notification when a submission is received. */
  KHCN_AIESI_BaiDang_EmailNguoiGui?: string;
  /** Track/Subcommittee name (KHCN_AIESI_LinhVuc_Ten), not an id or JSON. */
  KHCN_AIESI_BaiDang_LinhVuc?: string;
}

export interface EditKHCNAIESIBody extends AddKHCNAIESIBody {
  KHCN_AIESI_BaiDang_ID: string;
  KHCN_AIESI_BaiDang_TrangThai: number | null;
  KHCN_AIESI_BaiDang_NguonTiepNhan: number;
  KHCN_AIESI_BaiDang_LoaiTaiKhoan: number;
  KHCN_AIESI_BaiDang_LinhVuc: string;
}

export interface KHCNAIESILinhVuc {
  KHCN_AIESI_LinhVuc_ID: string;
  KHCN_AIESI_LinhVuc_STT: number | null;
  KHCN_AIESI_LinhVuc_Ten: string;
}

export interface DeleteFilesSuccess {
  code: 200;
  message: string;
  deletedFiles: string[];
  errors?: Array<{ fileUrl: string; error: string }>;
}

export type BffResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: { status: number; message: string; details?: unknown };
    };
