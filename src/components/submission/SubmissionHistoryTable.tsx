"use client";

import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  Ban,
  Check,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  Pencil,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuillEditor } from "@/components/submission/QuillEditor";
import type {
  PaperSubmission,
  SubmissionStatus,
} from "@/data/submissions";
import { toSubmissionUpdate } from "@/data/submissions";
import {
  getFields,
  updatePost,
  type KHCNAIESIField,
} from "@/lib/khcn-aiesi/client";
import type { UploadedFile } from "@/lib/khcn-aiesi/types";
import { cn } from "@/lib/utils";

type SearchColumn =
  | "all"
  | "id"
  | "title"
  | "summary"
  | "authors"
  | "keywords"
  | "linhVuc"
  | "status";

interface EditDraft {
  title: string;
  summary: string;
  authors: string;
  keywords: string;
  linhVuc: string;
}

type ModerationStatus = 2 | -2;

interface ModerationAction {
  submission: PaperSubmission;
  status: ModerationStatus;
}

const MODERATION_COPY: Record<
  ModerationStatus,
  {
    action: string;
    title: string;
    description: string;
    pending: string;
    success: string;
  }
> = {
  2: {
    action: "Approve",
    title: "Approve submission?",
    description: "The submission status will change to “Approved”.",
    pending: "Approving…",
    success: "Submission approved.",
  },
  [-2]: {
    action: "Reject",
    title: "Reject submission?",
    description: "The submission status will change to “Rejected”.",
    pending: "Rejecting…",
    success: "Submission rejected.",
  },
};

const SEARCH_COLUMNS: Array<{ id: SearchColumn; label: string }> = [
  { id: "all", label: "All" },
  { id: "title", label: "Paper title" },
  { id: "summary", label: "Abstract" },
  { id: "authors", label: "Authors" },
  { id: "keywords", label: "Keywords" },
  { id: "linhVuc", label: "Track/Subcommittee" },
  { id: "status", label: "Status" },
];

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  "Submitted": "bg-blue-50 text-blue-800 ring-blue-200",
  "Viewed by Reviewer": "bg-amber-50 text-amber-800 ring-amber-200",
  "Approved": "bg-emerald-50 text-emerald-800 ring-emerald-200",
  "Cancelled by Submitter": "bg-slate-100 text-slate-700 ring-slate-200",
  "Rejected": "bg-rose-50 text-rose-800 ring-rose-200",
  "Unknown": "bg-slate-100 text-slate-600 ring-slate-200",
};

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value: string | null) {
  return value ? DATE_FORMATTER.format(new Date(value)) : "—";
}

function searchableValue(submission: PaperSubmission, column: SearchColumn) {
  if (column === "all") {
    return [
      submission.id,
      submission.title,
      submission.summaryText,
      submission.authors,
      submission.keywords,
      submission.linhVuc,
      submission.status,
      submission.submittedAt,
    ].join(" ");
  }

  return submission[column];
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

function officePreviewUrl(fileUrl: string) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
}

function ExpandableContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || expanded) return;

    const measure = () => {
      setCanExpand(content.scrollHeight > content.clientHeight + 1);
    };
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(content);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [children, expanded]);
  return (
    <div className="min-w-0">
      <div
        ref={contentRef}
        className={cn(
          "text-pretty",
          expanded ? null : "line-clamp-2",
          className,
        )}
      >
        {children}
      </div>
      {canExpand ? (
        <Button
          type="button"
          variant="link"
          className="mt-1 h-auto min-h-0 p-0 text-xs"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      ) : null}
    </div>
  );
}

function FileLinks({
  submission,
  pending,
  onPreview,
}: {
  submission: PaperSubmission;
  pending: boolean;
  onPreview: (file: UploadedFile) => void | Promise<void>;
}) {
  if (submission.files.length === 0) return <>—</>;

  return (
    <ul className="space-y-1">
      {submission.files.map((file) => (
        <li key={`${file.URL}-${file.TenFileSlug}`}>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            title={file.TenFileGoc}
            aria-label={`Preview file ${file.TenFileGoc}`}
            disabled={pending}
            onClick={() => void onPreview(file)}
          >
            <FileText aria-hidden />
            Preview
          </Button>
        </li>
      ))}
    </ul>
  );
}

function SubmissionActions({
  submission,
  isAdmin,
  pending,
  onEdit,
  onCancel,
  onModerate,
}: {
  submission: PaperSubmission;
  isAdmin: boolean;
  pending: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onModerate: (status: ModerationStatus) => void;
}) {
  const canModerate =
    submission.statusCode === null || submission.statusCode === 1;

  if (isAdmin) {
    if (!canModerate) {
      return <span className="text-sm text-muted-foreground">—</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onModerate(2)}
          disabled={pending}
        >
          <Check aria-hidden /> Approve
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onModerate(-2)}
          disabled={pending}
        >
          <Ban aria-hidden /> Reject
        </Button>
      </div>
    );
  }

  if (submission.statusCode !== null) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onEdit}
        disabled={pending}
      >
        <Pencil aria-hidden /> Edit
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onCancel}
        disabled={pending}
      >
        <Ban aria-hidden /> Cancel
      </Button>
    </div>
  );
}

interface SubmissionHistoryTableProps {
  submissions: PaperSubmission[];
  isAdmin: boolean;
  pagination: {
    pageNumber: number;
    totalPages: number;
    totalRecords: number;
  };
  previousHref: string | null;
  nextHref: string | null;
}

export function SubmissionHistoryTable({
  submissions,
  pagination,
  previousHref,
  nextHref,
  isAdmin,
}: SubmissionHistoryTableProps) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState<SearchColumn>("all");
  const [editing, setEditing] = useState<PaperSubmission | null>(null);
  const [canceling, setCanceling] = useState<PaperSubmission | null>(null);
  const [previewingFile, setPreviewingFile] = useState<UploadedFile | null>(null);
  const viewedIdsRef = useRef(new Set<string>());
  const [moderating, setModerating] = useState<ModerationAction | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [fields, setFields] = useState<KHCNAIESIField[]>([]);
  const [fieldsStatus, setFieldsStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const selectedColumn =
    SEARCH_COLUMNS.find((column) => column.id === searchColumn) ??
    SEARCH_COLUMNS[0];
  const filteredSubmissions = normalizedQuery
    ? submissions.filter((submission) =>
        searchableValue(submission, searchColumn)
          .toLocaleLowerCase()
          .includes(normalizedQuery),
      )
    : submissions;

  const clearSearch = () => {
    setQuery("");
    searchInputRef.current?.focus();
  };

  const openEditor = (submission: PaperSubmission) => {
    setError("");
    setEditing(submission);
    setDraft({
      title: submission.title,
      summary: submission.summary,
      authors: submission.authors,
      keywords: submission.keywords,
      linhVuc: submission.linhVuc,
    });

    if (fieldsStatus === "idle") {
      setFieldsStatus("loading");
      getFields()
        .then((data) => {
          setFields(data);
          setFieldsStatus("ready");
        })
        .catch(() => {
          setFieldsStatus("error");
        });
    }
  };

  const openModeration = (
    submission: PaperSubmission,
    status: ModerationStatus,
  ) => {
    setError("");
    setModerating({ submission, status });
  };

  const previewFile = async (
    submission: PaperSubmission,
    file: UploadedFile,
  ) => {
    if (
      !isAdmin ||
      submission.statusCode !== null ||
      viewedIdsRef.current.has(submission.id)
    ) {
      setPreviewingFile(file);
      return;
    }

    setPendingId(submission.id);
    setError("");
    try {
      await updatePost(toSubmissionUpdate(submission, { statusCode: 1 }));
      viewedIdsRef.current.add(submission.id);
      setNotice("Submission marked as viewed.");
      setPreviewingFile(file);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to mark submission as viewed.",
      );
    } finally {
      setPendingId(null);
    }
  };

  const saveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing || !draft) return;

    setPendingId(editing.id);
    setError("");
    try {
      await updatePost(toSubmissionUpdate(editing, draft));
      setEditing(null);
      setDraft(null);
      setNotice("Submission updated successfully.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update submission.");
    } finally {
      setPendingId(null);
    }
  };

  const confirmCancel = async () => {
    if (!canceling) return;

    setPendingId(canceling.id);
    setError("");
    try {
      await updatePost(toSubmissionUpdate(canceling, { statusCode: -1 }));
      setCanceling(null);
      setNotice("Submission cancelled successfully.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to cancel submission.");
    } finally {
      setPendingId(null);
    }
  };

  const confirmModeration = async () => {
    if (!moderating) return;

    const { submission, status } = moderating;
    setPendingId(submission.id);
    setError("");
    try {
      await updatePost(toSubmissionUpdate(submission, { statusCode: status }));
      setModerating(null);
      setNotice(MODERATION_COPY[status].success);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to update submission status.",
      );
    } finally {
      setPendingId(null);
    }
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportError("");
    try {
      const params = new URLSearchParams();
      if (normalizedQuery) {
        params.set("q", normalizedQuery);
        params.set("column", searchColumn);
      }
      const response = await fetch(
        `/api/khcn-aiesi/posts/export${params.size ? `?${params}` : ""}`,
      );
      if (!response.ok) {
        throw new Error(
          response.status === 403
            ? "You don't have permission to export submissions."
            : "Could not export submissions. Please try again.",
        );
      }
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const filename =
        /filename="?([^"]+)"?/.exec(disposition)?.[1] ?? "submissions.xlsx";
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(
        err instanceof Error
          ? err.message
          : "Could not export submissions. Please try again.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const shortenedQuery = query.length > 24 ? `${query.slice(0, 24)}…` : query;

  return (
    <>
      <section
        className="@container overflow-hidden rounded-2xl border border-slate-200 bg-white"
        aria-labelledby="submission-history-heading"
      >
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-end">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="submission-search"
                className="mb-1.5 block w-fit text-sm font-medium text-slate-900"
              >
                Search submissions
              </label>
              <div className="relative max-w-xl">
                <Input
                  ref={searchInputRef}
                  id="submission-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Enter a keyword"
                  className="h-11 bg-white pr-10 text-base md:h-10 md:text-sm [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute inset-y-0 right-1 my-auto size-8"
                  >
                    <X className="size-4" aria-hidden />
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="shrink-0">
              <span className="mb-1.5 block text-sm font-medium text-slate-900">
                Search in
              </span>
              <MenuPrimitive.Root>
                <MenuPrimitive.Trigger className="inline-flex h-10 min-w-48 cursor-pointer items-center justify-between gap-3 rounded-lg border border-input bg-white px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {selectedColumn.label}
                  <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
                </MenuPrimitive.Trigger>
                <MenuPrimitive.Portal>
                  <MenuPrimitive.Positioner align="start" sideOffset={6} className="z-70">
                    <MenuPrimitive.Popup className="w-56 rounded-xl border border-border bg-popover p-1 shadow-lg">
                      {SEARCH_COLUMNS.map((column) => (
                        <MenuPrimitive.Item
                          key={column.id}
                          onClick={() => setSearchColumn(column.id)}
                          className="flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-sm outline-none data-highlighted:bg-accent"
                        >
                          <span>{column.label}</span>
                          {column.id === searchColumn ? (
                            <Check className="size-4" aria-hidden />
                          ) : null}
                        </MenuPrimitive.Item>
                      ))}
                    </MenuPrimitive.Popup>
                  </MenuPrimitive.Positioner>
                </MenuPrimitive.Portal>
              </MenuPrimitive.Root>
            </div>

            {isAdmin ? (
              <div className="shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="h-10 w-full @2xl:w-auto"
                >
                  {isExporting ? (
                    <LoaderCircle className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <FileSpreadsheet className="size-4" aria-hidden />
                  )}
                  Export Excel
                </Button>
              </div>
            ) : null}
          </div>

          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            Showing {filteredSubmissions.length} of {pagination.totalRecords}{" "}
            submissions
          </p>
          {exportError ? (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {exportError}
            </p>
          ) : null}
          {notice ? (
            <p className="mt-3 text-sm text-emerald-700" role="status">
              {notice}
            </p>
          ) : null}
          {error && !editing && !canceling && !moderating ? (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        {filteredSubmissions.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No submissions match{normalizedQuery ? " " : ""}
            {normalizedQuery ? (
              <span className="font-medium text-foreground" title={query}>
                &quot;{shortenedQuery}&quot;
              </span>
            ) : null}
            {normalizedQuery ? ". Try another keyword. " : ". "}
            {normalizedQuery ? (
              <button
                type="button"
                onClick={clearSearch}
                className="cursor-pointer font-medium text-foreground underline-offset-4 hover:underline"
              >
                Clear search
              </button>
            ) : null}
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-[1950px] border-collapse text-left">
                <caption className="sr-only">
                  Submission history with status and available actions
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-medium text-muted-foreground">
                    <th scope="col" className="w-20 px-4 py-3">STT</th>
                    <th scope="col" className="w-72 px-4 py-3">Title</th>
                    <th scope="col" className="w-[30rem] px-4 py-3">Abstract</th>
                    <th scope="col" className="w-72 px-4 py-3">Authors</th>
                    <th scope="col" className="w-64 px-4 py-3">Keywords</th>
                    <th scope="col" className="w-64 px-4 py-3">Track/Subcommittee</th>
                    <th scope="col" className="w-64 px-4 py-3">File</th>
                    <th scope="col" className="w-56 px-4 py-3">Status</th>
                    <th scope="col" className="w-48 px-4 py-3">Submitted at</th>
                    <th scope="col" className="sticky right-0 w-80 bg-white px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="group hover:bg-slate-50">
                      <td className="px-4 py-4 align-top text-sm tabular-nums">
                        {submission.ordinal}
                      </td>
                      <td className="px-4 py-4 align-top text-sm">
                        <ExpandableContent className="font-medium">
                          {submission.title}
                        </ExpandableContent>
                      </td>
                      <td className="px-4 py-4 align-top text-sm">
                        {submission.summaryHtml ? (
                          <ExpandableContent>
                            <div
                              className="prose prose-sm max-w-none text-slate-700"
                              dangerouslySetInnerHTML={{
                                __html: submission.summaryHtml,
                              }}
                            />
                          </ExpandableContent>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-4 align-top text-sm">
                        {submission.authors ? (
                          <ExpandableContent>{submission.authors}</ExpandableContent>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-4 align-top text-sm">
                        {submission.keywords ? (
                          <ExpandableContent>{submission.keywords}</ExpandableContent>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-4 align-top text-sm">
                        {submission.linhVuc ? (
                          <ExpandableContent>{submission.linhVuc}</ExpandableContent>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-4 align-top text-sm">
                        <FileLinks
                          submission={submission}
                          pending={pendingId === submission.id}
                          onPreview={(file) => previewFile(submission, file)}
                        />
                      </td>
                      <td className="px-4 py-4 align-top">
                        <StatusBadge status={submission.status} />
                      </td>
                      <td className="px-4 py-4 align-top text-sm">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="sticky right-0 bg-white px-4 py-4 align-top group-hover:bg-slate-50">
                        <SubmissionActions
                          submission={submission}
                          isAdmin={isAdmin}
                          pending={pendingId === submission.id}
                          onEdit={() => openEditor(submission)}
                          onCancel={() => {
                            setError("");
                            setCanceling(submission);
                          }}
                          onModerate={(status) =>
                            openModeration(submission, status)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ol className="divide-y divide-slate-200 md:hidden">
              {filteredSubmissions.map((submission) => (
                <li key={submission.id} className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        STT {submission.ordinal}
                      </p>
                      <h2 className="mt-1 text-sm font-semibold text-slate-950">
                        <ExpandableContent>{submission.title}</ExpandableContent>
                      </h2>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                  <dl className="grid gap-3 text-sm">
                    <div>
                      <dt className="font-medium">Abstract</dt>
                      <dd className="mt-1 text-slate-600">
                        {submission.summaryHtml ? (
                          <ExpandableContent>
                            <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: submission.summaryHtml,
                              }}
                            />
                          </ExpandableContent>
                        ) : (
                          "—"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium">Authors</dt>
                      <dd className="mt-1 text-slate-600">
                        {submission.authors ? (
                          <ExpandableContent>{submission.authors}</ExpandableContent>
                        ) : (
                          "—"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium">Keywords</dt>
                      <dd className="mt-1 text-slate-600">
                        {submission.keywords ? (
                          <ExpandableContent>{submission.keywords}</ExpandableContent>
                        ) : (
                          "—"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium">Track/Subcommittee</dt>
                      <dd className="mt-1 text-slate-600">
                        {submission.linhVuc ? (
                          <ExpandableContent>{submission.linhVuc}</ExpandableContent>
                        ) : (
                          "—"
                        )}
                      </dd>
                    </div>
                    <div><dt className="font-medium">File</dt><dd className="mt-1 text-slate-600"><FileLinks submission={submission} pending={pendingId === submission.id} onPreview={(file) => previewFile(submission, file)} /></dd></div>
                    <div><dt className="font-medium">Submitted at</dt><dd className="mt-1 text-slate-600">{formatDate(submission.submittedAt)}</dd></div>
                  </dl>
                  <SubmissionActions
                    submission={submission}
                    isAdmin={isAdmin}
                    pending={pendingId === submission.id}
                    onEdit={() => openEditor(submission)}
                    onCancel={() => {
                      setError("");
                      setCanceling(submission);
                    }}
                    onModerate={(status) =>
                      openModeration(submission, status)
                    }
                  />
                </li>
              ))}
            </ol>
          </>
        )}

        {pagination.totalPages > 1 ? (
          <nav aria-label="Submission history pages" className="flex items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 sm:px-5">
            <span className="text-sm text-muted-foreground">Page {pagination.pageNumber} of {pagination.totalPages}</span>
            <div className="flex gap-2">
              {previousHref ? <Button asChild variant="outline" size="sm"><Link href={previousHref}>Previous</Link></Button> : null}
              {nextHref ? <Button asChild variant="outline" size="sm"><Link href={nextHref}>Next</Link></Button> : null}
            </div>
          </nav>
        ) : null}
      </section>
      <Dialog
        open={Boolean(previewingFile)}
        onOpenChange={(open) => {
          if (!open) setPreviewingFile(null);
        }}
      >
        <DialogContent className="h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-none grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-none">
          <DialogHeader className="border-b border-slate-200 px-5 py-4 pr-14">
            <DialogTitle>Preview file</DialogTitle>
            <DialogDescription className="truncate" title={previewingFile?.TenFileGoc}>
              {previewingFile?.TenFileGoc}
            </DialogDescription>
          </DialogHeader>
          {previewingFile ? (
            <iframe
              src={officePreviewUrl(previewingFile.URL)}
              title={`Preview ${previewingFile.TenFileGoc}`}
              className="h-full min-h-0 w-full border-0 bg-white"
              allowFullScreen
            />
          ) : null}
        </DialogContent>
      </Dialog>


      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open && !pendingId) {
            setEditing(null);
            setDraft(null);
            setError("");
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit submission</DialogTitle>
            <DialogDescription>
              Only submissions in the “Submitted” status can be edited. Attachments remain unchanged.
            </DialogDescription>
          </DialogHeader>
          {draft ? (
            <form className="space-y-5" onSubmit={saveEdit}>
              <div className="space-y-2">
                <Label htmlFor="history-edit-title" required>Title</Label>
                <Input id="history-edit-title" value={draft.title} required maxLength={2000} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="history-edit-summary">Abstract</Label>
                <QuillEditor
                  value={draft.summary}
                  onChange={(summary) => setDraft({ ...draft, summary })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="history-edit-authors">Authors</Label>
                <textarea id="history-edit-authors" value={draft.authors} rows={3} onChange={(event) => setDraft({ ...draft, authors: event.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="history-edit-keywords">Keywords</Label>
                <Input id="history-edit-keywords" value={draft.keywords} maxLength={2000} onChange={(event) => setDraft({ ...draft, keywords: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="history-edit-track" required>
                  Track/Subcommittee Selection
                </Label>
                <Select
                  value={draft.linhVuc ?? ""}
                  onValueChange={(value) => setDraft({ ...draft, linhVuc: value ?? "" })}
                  disabled={fieldsStatus !== "ready"}
                >
                  <SelectTrigger id="history-edit-track" className="w-full">
                    <SelectValue
                      placeholder={
                        fieldsStatus === "loading"
                          ? "Loading tracks…"
                          : fieldsStatus === "error"
                            ? "Tracks unavailable"
                            : "Select a track/subcommittee"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((option) => (
                      <SelectItem key={option.id} value={option.ten}>
                        {option.ten}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldsStatus === "error" ? (
                  <p className="text-xs text-red-600">
                    We couldn&apos;t load the list of tracks/subcommittees.
                    The current selection is kept unless you reopen this
                    dialog to try again.
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Please select one of the four tracks/subcommittees
                    below that best matches the author&apos;s submission.
                  </p>
                )}
              </div>
              {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={Boolean(pendingId)}>Close</Button>
                <Button type="submit" disabled={Boolean(pendingId)}>{pendingId ? "Saving…" : "Save changes"}</Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(canceling)}
        onOpenChange={(open) => {
          if (!open && !pendingId) {
            setCanceling(null);
            setError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel submission?</DialogTitle>
            <DialogDescription>
              The status will change to “Cancelled by Submitter”, and the
              submission can no longer be edited.
            </DialogDescription>
          </DialogHeader>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCanceling(null)} disabled={Boolean(pendingId)}>Keep submission</Button>
            <Button type="button" variant="destructive" onClick={confirmCancel} disabled={Boolean(pendingId)}>{pendingId ? "Cancelling…" : "Cancel submission"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(moderating)}
        onOpenChange={(open) => {
          if (!open && !pendingId) {
            setModerating(null);
            setError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {moderating ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {MODERATION_COPY[moderating.status].title}
                </DialogTitle>
                <DialogDescription>
                  {MODERATION_COPY[moderating.status].description}
                </DialogDescription>
              </DialogHeader>
              {error ? (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModerating(null)}
                  disabled={Boolean(pendingId)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  variant={
                    moderating.status === -2 ? "destructive" : "default"
                  }
                  onClick={confirmModeration}
                  disabled={Boolean(pendingId)}
                >
                  {pendingId
                    ? MODERATION_COPY[moderating.status].pending
                    : MODERATION_COPY[moderating.status].action}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
