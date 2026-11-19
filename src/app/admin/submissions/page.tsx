import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FileSpreadsheet } from "lucide-react";

import {
  AdminSubmissionGroups,
  type AdminSubmissionPagination,
} from "@/components/admin/AdminSubmissionGroups";
import { Button } from "@/components/ui/button";
import {
  groupAdminSubmissions,
  type AdminSubmissionRecord,
} from "@/data/admin-submissions";
import { submissionStatus } from "@/data/submissions";
import { isAdminUser } from "@/lib/auth/admin";
import {
  AUTH_COOKIE_NAME,
  parseAuthSession,
} from "@/lib/auth/session";
import { loadExportRows } from "@/lib/khcn-aiesi/export";

export const metadata: Metadata = {
  title: "Submission Review | AIESI 2027 Admin",
  description: "Review submitted papers grouped by submitter account.",
};

const PAGE_SIZE = 10;
const ADMIN_SUBMISSIONS_PATH = "/admin/submissions";

interface AdminSubmissionsPageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

export default async function AdminSubmissionsPage({
  searchParams,
}: AdminSubmissionsPageProps) {
  const cookieStore = await cookies();
  const session = parseAuthSession(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  if (!session) {
    redirect("/auth/login");
  }

  if (!isAdminUser(session.user)) {
    return (
      <div className="min-h-[calc(100vh-9rem)] bg-slate-50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-md text-center">
          <p className="text-sm font-medium tabular-nums text-muted-foreground">
            403
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-950">
            Access denied
          </h1>
          <p className="mt-2 text-pretty text-sm leading-6 text-muted-foreground">
            This page is available only to conference administrators. You are
            signed in as {session.user.email || session.user.username}.
          </p>
          <Button asChild className="mt-6 h-11 px-5 md:h-10">
            <Link href="/aiesi-2027">Return to conference home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { rows } = await loadExportRows();

  const records: AdminSubmissionRecord[] = rows.map((post) => {
    const rawSubmitterId = post.HT_USER_Create ? Number(post.HT_USER_Create) : 0;
    const submitterId = Number.isInteger(rawSubmitterId) && rawSubmitterId > 0 ? rawSubmitterId : 0;

    return {
      submitter: {
        id: submitterId,
        username: post.NguoiGui_TenDangNhap ?? "",
        fullName: post.NguoiGui_HoTen ?? "",
        email: post.NguoiGui_Email ?? "",
      },
      paper: {
        id: post.KHCN_AIESI_BaiDang_ID,
        title: post.KHCN_AIESI_BaiDang_TenBai ?? "Untitled submission",
        track: post.KHCN_AIESI_BaiDang_LinhVuc ?? "",
        submittedAt: post.KHCN_AIESI_BaiDang_DateCreate ?? "",
        status: submissionStatus(post.KHCN_AIESI_BaiDang_TrangThai),
      },
    };
  });

  const allGroups = groupAdminSubmissions(records);
  const totalAccounts = allGroups.length;
  const totalPapers = records.length;
  const pendingPapers = records.filter(
    (record) => record.paper.status === "Submitted",
  ).length;

  const rawPage = (await searchParams)?.page;
  const requestedPage = Number(Array.isArray(rawPage) ? rawPage[0] : rawPage);
  const totalPages = Math.max(1, Math.ceil(totalAccounts / PAGE_SIZE));
  const pageNumber =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1;

  const startIndex = (pageNumber - 1) * PAGE_SIZE;
  const paginatedGroups = allGroups.slice(startIndex, startIndex + PAGE_SIZE);

  const pagination: AdminSubmissionPagination = {
    pageNumber,
    pageSize: PAGE_SIZE,
    totalAccounts,
    totalPages,
  };

  const previousHref =
    pageNumber > 1
      ? pageNumber - 1 === 1
        ? ADMIN_SUBMISSIONS_PATH
        : `${ADMIN_SUBMISSIONS_PATH}?page=${pageNumber - 1}`
      : null;

  const nextHref =
    pageNumber < totalPages
      ? `${ADMIN_SUBMISSIONS_PATH}?page=${pageNumber + 1}`
      : null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Admin</p>
            <h1
              id="admin-submissions-heading"
              className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl"
            >
              Submission Review
            </h1>
            <p className="mt-2 max-w-[65ch] text-pretty text-sm leading-6 text-slate-600 sm:text-base">
              Review submitted papers grouped by the account that uploaded them.
            </p>
          </div>
          <div className="shrink-0">
            <Button
              asChild
              variant="outline"
              className="h-10 w-full sm:w-auto"
            >
              <a
                href="/api/khcn-aiesi/posts/export"
                download
              >
                <FileSpreadsheet className="size-4" aria-hidden />
                <span>Export Excel</span>
              </a>
            </Button>
          </div>
        </header>

        <AdminSubmissionGroups
          groups={paginatedGroups}
          totalAccounts={totalAccounts}
          totalPapers={totalPapers}
          pendingPapers={pendingPapers}
          pagination={pagination}
          previousHref={previousHref}
          nextHref={nextHref}
        />
      </div>
    </div>
  );
}
