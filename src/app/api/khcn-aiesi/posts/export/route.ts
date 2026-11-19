import "server-only";

import { cookies } from "next/headers";
import ExcelJS from "exceljs";
import sanitizeHtml from "sanitize-html";

import { submissionStatus } from "@/data/submissions";
import { isAdminUser } from "@/lib/auth/admin";
import { AUTH_COOKIE_NAME, parseAuthSession } from "@/lib/auth/session";
import {
  BackendHttpError,
  absoluteFile,
  toErrorResponse,
} from "@/lib/khcn-aiesi/backend";
import { loadExportRows } from "@/lib/khcn-aiesi/export";
import {
  type ExportPost,
} from "@/lib/khcn-aiesi/schemas";

const ACCOUNT_TYPE_LABELS: Record<number, string> = {
  0: "Student",
  1: "Staff",
  2: "External",
};

type SearchColumn =
  | "all"
  | "id"
  | "title"
  | "summary"
  | "authors"
  | "keywords"
  | "linhVuc"
  | "status";

const SEARCH_COLUMNS: SearchColumn[] = [
  "all",
  "id",
  "title",
  "summary",
  "authors",
  "keywords",
  "linhVuc",
  "status",
];

function plainText(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

function searchableFields(post: ExportPost): Record<SearchColumn, string> {
  return {
    all: "",
    id: post.KHCN_AIESI_BaiDang_ID,
    title: post.KHCN_AIESI_BaiDang_TenBai ?? "",
    summary: plainText(post.KHCN_AIESI_BaiDang_TomTat),
    authors: post.KHCN_AIESI_BaiDang_TacGia ?? "",
    keywords: post.KHCN_AIESI_BaiDang_TuKhoa ?? "",
    linhVuc: post.KHCN_AIESI_BaiDang_LinhVuc ?? "",
    status: submissionStatus(post.KHCN_AIESI_BaiDang_TrangThai),
  };
}

function matchesSearch(post: ExportPost, column: SearchColumn, query: string): boolean {
  const fields = searchableFields(post);
  const haystack = column === "all" ? Object.values(fields).join(" ") : fields[column];
  return haystack.toLocaleLowerCase().includes(query);
}

/** The upstream timestamp is Vietnam wall-clock time but is sometimes stamped
 *  with a "Z"/no offset, so re-parsing it as a timezone-aware instant would
 *  shift it. Pull the numeric components out and rebuild a UTC Date carrying
 *  those same digits, since exceljs converts dates to Excel's (timezone-less)
 *  serial using Date#getTime() directly. */
function wallClockDate(raw: string | null | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/.exec(raw ?? "");
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  return new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    ),
  );
}

function vnTimestamp(): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}${get("month")}${get("day")}-${get("hour")}${get("minute")}`;
}

function buildWorkbook(rows: ExportPost[], includeSubmitter: boolean) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Submissions", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  const dateFormat = { numFmt: "dd/mm/yyyy hh:mm" };
  sheet.columns = [
    { header: "No.", key: "no", width: 6 },
    { header: "Submission ID", key: "id", width: 24 },
    { header: "Paper title", key: "title", width: 32 },
    { header: "Track/Subcommittee", key: "linhVuc", width: 28 },
    { header: "Authors", key: "authors", width: 24 },
    { header: "Abstract", key: "summary", width: 40 },
    { header: "Keywords", key: "keywords", width: 20 },
    { header: "Status", key: "status", width: 18 },
    { header: "Submitted at", key: "submittedAt", width: 18, style: dateFormat },
    { header: "Reviewed by (ID)", key: "reviewerId", width: 14 },
    { header: "Reviewed at", key: "reviewedAt", width: 18, style: dateFormat },
    { header: "Review note", key: "reviewNote", width: 28 },
    { header: "Files", key: "files", width: 28 },
    { header: "File links", key: "fileLinks", width: 36 },
    { header: "Account type", key: "accountType", width: 14 },
    { header: "Submitter ID", key: "submitterId", width: 14 },
    { header: "Full name", key: "fullName", width: 22 },
    { header: "Email", key: "email", width: 24 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Organization/Unit", key: "org", width: 26 },
    { header: "Position", key: "position", width: 18 },
    { header: "Username", key: "username", width: 18 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: sheet.columns.length },
  };

  const wrapColumns = new Set([
    "title",
    "linhVuc",
    "authors",
    "summary",
    "keywords",
    "reviewNote",
    "files",
    "fileLinks",
    "org",
  ]);

  rows.forEach((post, index) => {
    const files = post.KHCN_AIESI_BaiDang_LinkFile.map(absoluteFile);
    const accountType = post.KHCN_AIESI_BaiDang_LoaiTaiKhoan ?? 0;

    const row = sheet.addRow({
      no: index + 1,
      id: post.KHCN_AIESI_BaiDang_ID,
      title: post.KHCN_AIESI_BaiDang_TenBai ?? "",
      linhVuc: post.KHCN_AIESI_BaiDang_LinhVuc ?? "",
      authors: post.KHCN_AIESI_BaiDang_TacGia ?? "",
      summary: plainText(post.KHCN_AIESI_BaiDang_TomTat),
      keywords: post.KHCN_AIESI_BaiDang_TuKhoa ?? "",
      status: submissionStatus(post.KHCN_AIESI_BaiDang_TrangThai),
      submittedAt: wallClockDate(post.KHCN_AIESI_BaiDang_DateCreate),
      reviewerId: post.KHCN_AIESI_BaiDang_NguoiXuLy_ID ?? "",
      reviewedAt: wallClockDate(post.KHCN_AIESI_BaiDang_NguoiXuLy_ThoiGian),
      reviewNote: post.KHCN_AIESI_BaiDang_NguoiXuLy_NoiDung ?? "",
      files: files.map((file) => file.TenFileGoc).join("\n"),
      fileLinks: files.map((file) => file.URL).join("\n"),
      accountType: ACCOUNT_TYPE_LABELS[accountType] ?? "Unknown",
      submitterId: post.HT_USER_Create ?? "",
      fullName: includeSubmitter ? post.NguoiGui_HoTen ?? "" : "",
      email: includeSubmitter ? post.NguoiGui_Email ?? "" : "",
      phone: includeSubmitter ? post.NguoiGui_SoDienThoai ?? "" : "",
      org: includeSubmitter ? post.NguoiGui_DonVi ?? "" : "",
      position: includeSubmitter ? post.NguoiGui_ChucVu ?? "" : "",
      username: includeSubmitter ? post.NguoiGui_TenDangNhap ?? "" : "",
    });

    row.eachCell((cell, colNumber) => {
      const key = sheet.columns[colNumber - 1]?.key;
      if (key && wrapColumns.has(key)) {
        cell.alignment = { wrapText: true, vertical: "top" };
      } else {
        cell.alignment = { ...cell.alignment, vertical: "top" };
      }
    });
  });

  return workbook;
}

export async function GET(request: Request) {
  const store = await cookies();
  const session = parseAuthSession(store.get(AUTH_COOKIE_NAME)?.value);
  if (!session?.token) {
    return toErrorResponse(
      new BackendHttpError(401, "Your session is not valid. Please sign in again."),
    );
  }
  if (!isAdminUser(session.user)) {
    return toErrorResponse(
      new BackendHttpError(403, "You don't have permission to export submissions."),
    );
  }

  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim().toLocaleLowerCase();
  const columnParam = url.searchParams.get("column") ?? "all";
  const column: SearchColumn = SEARCH_COLUMNS.includes(columnParam as SearchColumn)
    ? (columnParam as SearchColumn)
    : "all";

  try {
    const { rows, source } = await loadExportRows();
    const filtered = query ? rows.filter((row) => matchesSearch(row, column, query)) : rows;
    const workbook = buildWorkbook(filtered, source === "export");
    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `aiesi-2027-submissions-${vnTimestamp()}.xlsx`;

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Export-Source": source,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
