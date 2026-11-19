import type {
  EditKHCNAIESIBody,
  UploadedFile,
} from "@/lib/khcn-aiesi/types";

export type SubmissionStatus =
  | "Submitted"
  | "Viewed by Reviewer"
  | "Approved"
  | "Cancelled by Submitter"
  | "Rejected"
  | "Unknown";

export interface PaperSubmission {
  ordinal: number;
  id: string;
  title: string;
  summary: string;
  summaryHtml: string;
  summaryText: string;
  authors: string;
  keywords: string;
  linhVuc: string;
  files: UploadedFile[];
  statusCode: number | null;
  status: SubmissionStatus;
  submittedAt: string | null;
  processorId: number | null;
  processedAt: string | null;
  processorNote: string;
  source: number;
  accountType: number;
}

export function submissionStatus(status: number | null): SubmissionStatus {
  if (status === null) return "Submitted";
  if (status === 1) return "Viewed by Reviewer";
  if (status === 2) return "Approved";
  if (status === -1) return "Cancelled by Submitter";
  if (status === -2) return "Rejected";
  return "Unknown";
}

export function toSubmissionUpdate(
  submission: PaperSubmission,
  changes: Partial<
    Pick<
      PaperSubmission,
      "title" | "summary" | "authors" | "keywords" | "linhVuc" | "statusCode"
    >
  > = {},
): EditKHCNAIESIBody {
  return {
    KHCN_AIESI_BaiDang_ID: submission.id,
    KHCN_AIESI_BaiDang_TenBai: changes.title ?? submission.title,
    KHCN_AIESI_BaiDang_TomTat: changes.summary ?? submission.summary,
    KHCN_AIESI_BaiDang_TacGia: changes.authors ?? submission.authors,
    KHCN_AIESI_BaiDang_TuKhoa: changes.keywords ?? submission.keywords,
    KHCN_AIESI_BaiDang_LinhVuc: changes.linhVuc ?? submission.linhVuc,
    KHCN_AIESI_BaiDang_LinkFile: submission.files,
    KHCN_AIESI_BaiDang_TrangThai:
      changes.statusCode === undefined
        ? submission.statusCode
        : changes.statusCode,
    KHCN_AIESI_BaiDang_NguoiXuLy_ID: submission.processorId,
    KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian: submission.processedAt,
    KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung: submission.processorNote,
    KHCN_AIESI_BaiDang_NguonTiepNhan: submission.source,
    KHCN_AIESI_BaiDang_LoaiTaiKhoan: submission.accountType,
  };
}
