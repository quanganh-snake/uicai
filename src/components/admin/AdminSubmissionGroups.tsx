import Link from "next/link";
import { ChevronDown, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AdminSubmissionGroup } from "@/data/admin-submissions";
import type { SubmissionStatus } from "@/data/submissions";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  Submitted: "bg-blue-50 text-blue-800 ring-blue-200",
  "Viewed by Reviewer": "bg-amber-50 text-amber-800 ring-amber-200",
  Approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  "Cancelled by Submitter": "bg-slate-100 text-slate-700 ring-slate-200",
  Rejected: "bg-rose-50 text-rose-800 ring-rose-200",
  Unknown: "bg-slate-100 text-slate-700 ring-slate-200",
};

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function ReviewStatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        STATUS_STYLES[status] ?? STATUS_STYLES.Unknown,
      )}
    >
      {status}
    </span>
  );
}

export interface AdminSubmissionPagination {
  pageNumber: number;
  pageSize: number;
  totalAccounts: number;
  totalPages: number;
}

export interface AdminSubmissionGroupsProps {
  groups: AdminSubmissionGroup[];
  totalAccounts?: number;
  totalPapers?: number;
  pendingPapers?: number;
  pagination?: AdminSubmissionPagination;
  previousHref?: string | null;
  nextHref?: string | null;
}

export function AdminSubmissionGroups({
  groups,
  totalAccounts,
  totalPapers,
  pendingPapers,
  pagination,
  previousHref,
  nextHref,
}: AdminSubmissionGroupsProps) {
  const totalAccountsCount = totalAccounts ?? groups.length;
  const totalPapersCount =
    totalPapers ??
    groups.reduce((total, group) => total + group.papers.length, 0);
  const pendingPapersCount =
    pendingPapers ??
    groups.reduce(
      (total, group) =>
        total +
        group.papers.filter((paper) => paper.status === "Submitted").length,
      0,
    );

  const startIndex = pagination
    ? (pagination.pageNumber - 1) * pagination.pageSize
    : 0;

  if (groups.length === 0) {
    return (
      <section
        className="rounded-2xl border border-slate-200 bg-white p-12 text-center"
        aria-labelledby="admin-submissions-heading"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Inbox className="size-6" aria-hidden />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No submissions found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalAccountsCount > 0
            ? "No submitter accounts on this page."
            : "There are currently no paper submissions in the system."}
        </p>
        {previousHref ? (
          <div className="mt-6">
            <Button asChild variant="outline" size="sm">
              <Link href={previousHref}>Go to previous page</Link>
            </Button>
          </div>
        ) : null}
      </section>
    );
  }

  const showingStart = totalAccountsCount === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(startIndex + groups.length, totalAccountsCount);

  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
      aria-labelledby="admin-submissions-heading"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-sm text-muted-foreground">
          Showing {showingStart}–{showingEnd} of {totalAccountsCount} submitter{" "}
          {totalAccountsCount === 1 ? "account" : "accounts"} ·{" "}
          {totalPapersCount} {totalPapersCount === 1 ? "paper" : "papers"} ·{" "}
          {pendingPapersCount} awaiting review
        </p>
        {pagination && pagination.totalPages > 1 ? (
          <span className="text-xs text-muted-foreground sm:text-sm">
            Page {pagination.pageNumber} of {pagination.totalPages}
          </span>
        ) : null}
      </div>

      <div className="divide-y divide-slate-200">
        {groups.map((group) => {
          const displayName =
            group.submitter.fullName ||
            (group.submitter.id > 0
              ? `User #${group.submitter.id}`
              : "Unknown Submitter");
          const initials =
            displayName
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toLocaleUpperCase())
              .join("") || "U";

          const subInfo =
            [
              group.submitter.username ? `@${group.submitter.username}` : null,
              group.submitter.email || null,
            ]
              .filter(Boolean)
              .join(" · ") ||
            (group.submitter.id > 0
              ? `ID: ${group.submitter.id}`
              : "Account details unavailable");

          return (
            <details key={group.submitter.id} open className="group/account">
              <summary className="flex min-h-20 cursor-pointer list-none items-center gap-3 px-4 py-3 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden sm:px-5">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-800 ring-1 ring-blue-200"
                  aria-hidden
                >
                  {initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-950">
                    {displayName}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {subInfo}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-medium text-muted-foreground sm:text-sm">
                  {group.papers.length}{" "}
                  {group.papers.length === 1 ? "paper" : "papers"}
                </span>
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open/account:rotate-180"
                  aria-hidden
                />
              </summary>

              <div className="border-t border-slate-200 bg-slate-50/40">
                <div className="hidden md:block">
                  <table className="w-full table-fixed border-collapse text-left">
                    <caption className="sr-only">
                      Papers submitted by {displayName}
                    </caption>
                    <thead>
                      <tr className="border-b border-slate-200 bg-white text-xs font-medium text-muted-foreground">
                        <th scope="col" className="w-36 px-5 py-3 lg:w-44">
                          Paper ID
                        </th>
                        <th scope="col" className="px-5 py-3">
                          Paper
                        </th>
                        <th scope="col" className="w-36 px-5 py-3 lg:w-44">
                          Submitted
                        </th>
                        <th scope="col" className="w-44 px-5 py-3 lg:w-52">
                          Review status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {group.papers.map((paper) => {
                        const dateValid =
                          paper.submittedAt &&
                          !Number.isNaN(new Date(paper.submittedAt).getTime());
                        return (
                          <tr
                            key={paper.id}
                            className="transition-colors hover:bg-slate-50"
                          >
                            <td className="px-5 py-4 align-top font-mono text-xs font-medium text-slate-700">
                              {paper.id}
                            </td>
                            <td className="min-w-0 px-5 py-4 align-top">
                              <p
                                className="text-sm font-medium leading-snug text-slate-950 [text-wrap:pretty]"
                                title={paper.title}
                              >
                                {paper.title}
                              </p>
                              {paper.track ? (
                                <p
                                  className="mt-1 text-xs text-muted-foreground [text-wrap:pretty]"
                                  title={paper.track}
                                >
                                  {paper.track}
                                </p>
                              ) : null}
                            </td>
                            <td className="px-5 py-4 align-top text-sm tabular-nums text-slate-700">
                              {dateValid ? (
                                <time dateTime={paper.submittedAt}>
                                  {DATE_FORMATTER.format(
                                    new Date(paper.submittedAt),
                                  )}
                                </time>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-5 py-4 align-top">
                              <ReviewStatusBadge status={paper.status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <ul className="divide-y divide-slate-200 bg-white md:hidden">
                  {group.papers.map((paper) => {
                    const dateValid =
                      paper.submittedAt &&
                      !Number.isNaN(new Date(paper.submittedAt).getTime());
                    return (
                      <li key={paper.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-mono text-xs font-medium text-slate-600">
                              {paper.id}
                            </p>
                            <p className="mt-1 line-clamp-2 text-pretty text-sm font-medium text-slate-950">
                              {paper.title}
                            </p>
                          </div>
                          <ReviewStatusBadge status={paper.status} />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-slate-600">
                          <span>{paper.track || "—"}</span>
                          {dateValid ? (
                            <time
                              dateTime={paper.submittedAt}
                              className="tabular-nums"
                            >
                              {DATE_FORMATTER.format(
                                new Date(paper.submittedAt),
                              )}
                            </time>
                          ) : (
                            <span>—</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          );
        })}
      </div>

      {pagination && pagination.totalPages > 1 ? (
        <nav
          aria-label="Admin submissions pages"
          className="flex items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 sm:px-5"
        >
          <span className="text-sm text-muted-foreground">
            Page {pagination.pageNumber} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            {previousHref ? (
              <Button asChild variant="outline" size="sm">
                <Link href={previousHref}>Previous</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
            )}
            {nextHref ? (
              <Button asChild variant="outline" size="sm">
                <Link href={nextHref}>Next</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            )}
          </div>
        </nav>
      ) : null}
    </section>
  );
}
