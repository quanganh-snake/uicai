import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ExpiredSessionRedirect } from "@/components/auth";
import { SubmissionHistoryTable } from "@/components/submission/SubmissionHistoryTable";
import { Button } from "@/components/ui/button";
import { toPaperSubmission } from "@/lib/submission-history";
import { isAdminUser } from "@/lib/auth/admin";
import {
  AUTH_COOKIE_NAME,
  parseAuthSession,
} from "@/lib/auth/session";
import {
  BackendHttpError,
  fetchKHCNAIESI,
  parseBackend,
} from "@/lib/khcn-aiesi/backend";
import {
  pagedResponseSchema,
  type PagedResponse,
} from "@/lib/khcn-aiesi/schemas";
import { getFriendlyErrorMessage } from "@/lib/khcn-aiesi/error-messages";
import { passthroughQuery } from "@/lib/khcn-aiesi/route-utils";

export const metadata: Metadata = {
  title: "Submission History | AIESI 2027",
  description: "Review submitted papers and their current review status.",
};

const PAGE_SIZE = 10;
const HISTORY_PATH = "/aiesi-2027/submissions";

interface SubmissionsPageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

type HistoryOutcome =
  | { status: "ok"; data: PagedResponse }
  | { status: "expired" }
  | { status: "error"; message: string; code: number };

async function loadHistory(query: URLSearchParams): Promise<HistoryOutcome> {
  try {
    return {
      status: "ok",
      data: parseBackend(
        pagedResponseSchema,
        await fetchKHCNAIESI(`KHCN_AIESI_BaiDang_Load_Paged?${query}`),
      ),
    };
  } catch (error) {
    if (error instanceof BackendHttpError) {
      if (error.status === 401) return { status: "expired" };

      console.error("[submissions] upstream error", {
        status: error.status,
        message: error.message,
        detail: error.detail,
        query: query.toString(),
      });

      return {
        status: "error",
        message: getFriendlyErrorMessage(
          error.message,
          "We couldn't load your submissions. Please try again.",
        ),
        code: error.status,
      };
    }

    console.error("[submissions] unexpected error", error);
    return {
      status: "error",
      message: "We couldn't load your submissions. Please try again.",
      code: 500,
    };
  }
}

export default async function SubmissionsPage({
  searchParams,
}: SubmissionsPageProps) {
  const cookieStore = await cookies();
  const session = parseAuthSession(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  if (!session) {
    redirect("/auth/login");
  }

  const rawPage = (await searchParams).page;
  const requestedPage = Number(Array.isArray(rawPage) ? rawPage[0] : rawPage);
  const pageNumber =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const isAdmin = isAdminUser(session.user);
  const query = passthroughQuery({ pageNumber, pageSize: PAGE_SIZE });
  const history = await loadHistory(query);

  if (history.status === "expired") {
    return <ExpiredSessionRedirect />;
  }

  if (history.status === "error") {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
            Submission History
          </h1>
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              Submission history is unavailable
            </h2>
            <p className="mt-2 text-pretty text-sm leading-6 text-slate-600">
              {history.message}
            </p>
            <p className="mt-1 text-xs tabular-nums text-muted-foreground">
              Error code: {history.code}
            </p>
            <Button asChild className="mt-6 h-11 px-5 md:h-10">
              <a href={HISTORY_PATH}>Try again</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const submissions = history.data.body.map((post, index) =>
    toPaperSubmission(
      post,
      (history.data.pagination.pageNumber - 1) *
        history.data.pagination.pageSize +
        index +
        1,
    ),
  );
  const { pagination } = history.data;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8">
          <h1
            id="submission-history-heading"
            className="text-2xl font-semibold text-slate-950 sm:text-3xl"
          >
            Submission History
          </h1>
          <p className="mt-2 max-w-[55ch] text-pretty text-sm leading-6 text-slate-600 sm:text-base">
            Review your submitted papers and follow their current review status.
          </p>
        </header>

        <SubmissionHistoryTable
          submissions={submissions}
          isAdmin={isAdmin}
          pagination={pagination}
          previousHref={
            pagination.pageNumber > 1
              ? pagination.pageNumber - 1 === 1
                ? HISTORY_PATH
                : `${HISTORY_PATH}?page=${pagination.pageNumber - 1}`
              : null
          }
          nextHref={
            pagination.pageNumber < pagination.totalPages
              ? `${HISTORY_PATH}?page=${pagination.pageNumber + 1}`
              : null
          }
        />
      </div>
    </div>
  );
}
