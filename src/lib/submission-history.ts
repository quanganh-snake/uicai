import "server-only";

import sanitizeHtml from "sanitize-html";

import {
  submissionStatus,
  type PaperSubmission,
} from "@/data/submissions";
import type {
  KHCNAIESIBaiDang,
  UploadedFile,
} from "@/lib/khcn-aiesi/types";

const FILE_ORIGIN = new URL("https://apiv3.uneti.edu.vn");

const ABSTRACT_SANITIZER_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "blockquote",
    "ol",
    "ul",
    "li",
    "h1",
    "h2",
    "h3",
    "a",
    "sub",
    "sup",
    "pre",
    "code",
  ],
  allowedAttributes: {
    a: ["href"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

function publicFile(file: UploadedFile): UploadedFile {
  const pathname = new URL(file.URL, FILE_ORIGIN).pathname;
  return {
    ...file,
    URL: new URL(pathname, FILE_ORIGIN).toString(),
  };
}

export function toPaperSubmission(
  post: KHCNAIESIBaiDang,
  ordinal: number,
): PaperSubmission {
  const summary = post.KHCN_AIESI_BaiDang_TomTat ?? "";
  const summaryHtml = sanitizeHtml(summary, ABSTRACT_SANITIZER_OPTIONS);
  const summaryText = sanitizeHtml(summaryHtml, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();

  return {
    ordinal,
    id: post.KHCN_AIESI_BaiDang_ID,
    title: post.KHCN_AIESI_BaiDang_TenBai?.trim() || "Untitled",
    summary,
    summaryHtml,
    summaryText,
    authors: post.KHCN_AIESI_BaiDang_TacGia?.trim() || "",
    keywords: post.KHCN_AIESI_BaiDang_TuKhoa?.trim() || "",
    linhVuc: post.KHCN_AIESI_BaiDang_LinhVuc?.trim() || "",
    files: post.KHCN_AIESI_BaiDang_LinkFile.map(publicFile),
    statusCode: post.KHCN_AIESI_BaiDang_TrangThai,
    status: submissionStatus(post.KHCN_AIESI_BaiDang_TrangThai),
    submittedAt: post.KHCN_AIESI_BaiDang_DateCreate ?? null,
    processorId: post.KHCN_AIESI_BaiDang_NguoiXuLy_ID,
    processedAt: post.KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian,
    processorNote: post.KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung ?? "",
    source: post.KHCN_AIESI_BaiDang_NguonTiepNhan ?? 0,
    accountType: post.KHCN_AIESI_BaiDang_LoaiTaiKhoan ?? 0,
  };
}
