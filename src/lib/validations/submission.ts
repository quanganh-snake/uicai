import { z } from "zod";

export const MAX_SUBMISSION_FILES = 5;
export const PAPER_FILE_ACCEPT = ".doc,.docx,.pdf";

/** Actual limits of the upstream apiv3: exceeding them returns 400 with the message masked by IIS. */
export const MAX_PAPER_TITLE_LENGTH = 2000; // KHCN_AIESI_BaiDang_TenBai nvarchar(2000)
export const MAX_PAPER_KEYWORDS_LENGTH = 2000; // KHCN_AIESI_BaiDang_TuKhoa nvarchar(2000)
export const MAX_PAPER_LINHVUC_LENGTH = 2000; // KHCN_AIESI_BaiDang_LinhVuc nvarchar(2000)
export const MAX_PAPER_FILE_BYTES = 50 * 1024 * 1024; // multer limits.fileSize
export const MAX_SUBMISSION_TOTAL_BYTES = 28 * 1024 * 1024; // IIS default maxAllowedContentLength

const PAPER_FILE_EXTENSIONS: Record<string, true> = {
  doc: true,
  docx: true,
  pdf: true,
};

function hasRichText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim().length > 0;
}

export const paperSubmissionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter the paper title")
    .max(MAX_PAPER_TITLE_LENGTH, "Title must be 2000 characters or fewer"),
  abstract: z
    .string()
    .refine(hasRichText, "Enter the paper abstract"),
  authors: z.string().trim().min(1, "Enter at least one author"),
  keywords: z
    .string()
    .trim()
    .min(1, "Enter at least one keyword")
    .max(MAX_PAPER_KEYWORDS_LENGTH, "Keywords must be 2000 characters or fewer"),
  linhVuc: z
    .string()
    .trim()
    .min(1, "Select a track/subcommittee")
    .max(MAX_PAPER_LINHVUC_LENGTH),
});

export type PaperSubmissionFormData = z.infer<typeof paperSubmissionSchema>;

export function isAcceptedPaperFile(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension !== undefined && PAPER_FILE_EXTENSIONS[extension] === true;
}
