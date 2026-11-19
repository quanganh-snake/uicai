"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, LoaderCircle, Upload, X } from "lucide-react";
import { cn } from "cn";

import { SubmissionApiError, submitPaper } from "@/lib/api/submissions";
import { getFields, type KHCNAIESIField } from "@/lib/khcn-aiesi/client";
import { getFriendlyErrorMessage } from "@/lib/khcn-aiesi/error-messages";
import {
  isAcceptedPaperFile,
  MAX_PAPER_FILE_BYTES,
  MAX_SUBMISSION_FILES,
  MAX_SUBMISSION_TOTAL_BYTES,
  PAPER_FILE_ACCEPT,
  paperSubmissionSchema,
  type PaperSubmissionFormData,
} from "@/lib/validations/submission";
import {
  clearSubmissionDraft,
  loadAuthenticatedSubmissionDraft,
  saveSubmissionDraft,
  SUBMISSION_RECOVERY_LOGIN_PATH,
} from "@/lib/submission-recovery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  StatusDialogBody,
  type StatusDialogVariant,
} from "@/components/ui/status-dialog";
import { QuillEditor } from "./QuillEditor";

const FILE_SIZE_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${FILE_SIZE_FORMATTER.format(size / 1024)} KB`;
  }
  return `${FILE_SIZE_FORMATTER.format(size / (1024 * 1024))} MB`;
}

function splitFileName(fileName: string) {
  const extensionIndex = fileName.lastIndexOf(".");
  const extension = extensionIndex > 0 ? fileName.slice(extensionIndex) : "";
  const baseName = extensionIndex > 0 ? fileName.slice(0, extensionIndex) : fileName;
  const tail = `${baseName.slice(-10)}${extension}`;
  return {
    head: baseName.slice(0, Math.max(0, baseName.length - 10)),
    tail,
  };
}

interface PaperSubmissionDialogProps {
  isAuthenticated: boolean;
  triggerClassName?: string;
}

interface SubmissionResult {
  variant: Extract<StatusDialogVariant, "error" | "success">;
  title: string;
  description: string;
}

export function PaperSubmissionDialog({
  isAuthenticated,
  triggerClassName,
}: PaperSubmissionDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fields, setFields] = useState<KHCNAIESIField[]>([]);
  const [fieldsStatus, setFieldsStatus] = useState<"idle" | "ready" | "error">(
    "idle",
  );
  const fieldsFetchStarted = useRef(false);
  const restoredDraft = useRef(false);
  const {
    control,
    handleSubmit,
    getValues,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaperSubmissionFormData>({
    resolver: zodResolver(paperSubmissionSchema),
    defaultValues: {
      title: "",
      abstract: "",
      authors: "",
      keywords: "",
      linhVuc: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated || !open || fieldsFetchStarted.current) return;
    fieldsFetchStarted.current = true;

    getFields()
      .then((data) => {
        setFields(data);
        setFieldsStatus("ready");
      })
      .catch(() => {
        setFieldsStatus("error");
      });
  }, [isAuthenticated, open]);

  useEffect(() => {
    if (!isAuthenticated || restoredDraft.current) return;
    restoredDraft.current = true;

    void loadAuthenticatedSubmissionDraft()
      .then((draft) => {
        if (!draft) return;
        reset(draft.fields);
        setFiles(draft.files);
        setOpen(true);
      })
      .catch(() => {
        void clearSubmissionDraft();
      });
  }, [isAuthenticated, reset]);

  const redirectToLoginWithDraft = useCallback(
    async (fields: PaperSubmissionFormData) => {
      try {
        await saveSubmissionDraft(fields, files);
        window.location.replace(SUBMISSION_RECOVERY_LOGIN_PATH);
      } catch {
        setSubmissionResult({
          variant: "error",
          title: "Session recovery failed",
          description:
            "Your session expired, and the form could not be saved automatically. Keep this page open and sign in in another tab before trying again.",
        });
      }
    },
    [files],
  );

  useEffect(() => {
    if (!isAuthenticated || !open || submissionResult) return;

    let active = true;
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const result = (await response.json()) as { isAuthenticated?: boolean };
        if (active && !result.isAuthenticated) {
          await redirectToLoginWithDraft(getValues());
        }
      } catch {
        // A network failure is not proof that the session expired.
      }
    };

    void checkSession();
    const interval = window.setInterval(checkSession, 30_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [
    getValues,
    isAuthenticated,
    open,
    redirectToLoginWithDraft,
    submissionResult,
  ]);

  const resetDialog = () => {
    reset();
    setFiles([]);
    setFileError("");
    setSubmissionResult(null);
    setIsDragging(false);
  };

  const changeOpen = (
    nextOpen: boolean,
    eventDetails?: { cancel: () => void },
  ) => {
    if (!nextOpen && isSubmitting) {
      eventDetails?.cancel();
      return;
    }
    setOpen(nextOpen);
    if (!nextOpen) {
      void clearSubmissionDraft();
      resetDialog();
    }
  };

  const addFiles = (selectedFiles: File[]) => {
    setFileError("");

    const unsupportedFile = selectedFiles.find(
      (file) => !isAcceptedPaperFile(file.name),
    );
    if (unsupportedFile) {
      setFileError(
        `${unsupportedFile.name} is not a .doc, .docx, or .pdf file.`,
      );
      return;
    }

    if (files.length + selectedFiles.length > MAX_SUBMISSION_FILES) {
      setFileError(`You can attach up to ${MAX_SUBMISSION_FILES} files.`);
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_PAPER_FILE_BYTES,
    );
    if (oversizedFile) {
      setFileError(`${oversizedFile.name} is larger than 50 MB.`);
      return;
    }

    const totalBytes = [...files, ...selectedFiles].reduce(
      (sum, file) => sum + file.size,
      0,
    );
    if (totalBytes > MAX_SUBMISSION_TOTAL_BYTES) {
      setFileError("Total attachment size must stay under 28 MB.");
      return;
    }

    setFiles((currentFiles) => [...currentFiles, ...selectedFiles]);
  };

  const onSubmit = async (data: PaperSubmissionFormData) => {
    setSubmissionResult(null);
    if (files.length === 0) {
      setFileError("Attach at least one manuscript file.");
      document.getElementById("paper-files")?.focus();
      return;
    }

    try {
      const message = await submitPaper({ ...data, files });
      setSubmissionResult({
        variant: "success",
        title: "Paper submitted",
        description: getFriendlyErrorMessage(
          message,
          "Your paper has been submitted successfully.",
        ),
      });
      reset();
      setFiles([]);
      setFileError("");
      void clearSubmissionDraft();
    } catch (error) {
      if (error instanceof SubmissionApiError && error.status === 401) {
        await redirectToLoginWithDraft(data);
        return;
      }

      setSubmissionResult({
        variant: "error",
        title: "Submission failed",
        description: getFriendlyErrorMessage(
          error instanceof Error ? error.message : undefined,
          "The paper could not be submitted. Please try again.",
        ),
      });
    }
  };

  return (
    <Dialog
      open={open}
      disablePointerDismissal
      onOpenChange={(nextOpen, eventDetails) =>
        changeOpen(nextOpen, eventDetails)
      }
    >
      <button
        type="button"
        className={triggerClassName}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        Submit Now
      </button>

      <DialogContent
        showCloseButton={!submissionResult}
        className={cn(
          !isAuthenticated || submissionResult
            ? "p-0 sm:max-w-md"
            : "max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-2xl",
        )}
      >
        {!isAuthenticated ? (
          <StatusDialogBody
            variant="warning"
            title="Sign in required"
            description="Please sign in to submit a paper."
            actionLabel="Sign in now"
            onAction={() => router.push("/auth/login")}
          />
        ) : submissionResult ? (
          <StatusDialogBody
            variant={submissionResult.variant}
            title={submissionResult.title}
            description={submissionResult.description}
            actionLabel={
              submissionResult.variant === "success" ? "Close" : "Back to form"
            }
            onAction={() => {
              if (submissionResult.variant === "success") {
                changeOpen(false);
                return;
              }
              setSubmissionResult(null);
            }}
          />
        ) : (
          <>
            <DialogHeader className="px-5 pb-4 pt-5 pr-14 sm:px-6 sm:pt-6 sm:pr-14">
              <DialogTitle className="text-lg font-semibold">
                Submit a paper
              </DialogTitle>
              <DialogDescription className="text-pretty text-sm/6">
                Complete the form and attach up to five Word or PDF files.
              </DialogDescription>
            </DialogHeader>

            <form
              id="paper-submission-form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="contents"
            >
              <div className="min-h-0 space-y-5 overflow-y-auto border-y border-slate-200 px-5 py-5 sm:px-6">

                <div className="space-y-1.5">
                  <Label htmlFor="paper-title" required>
                    Paper title
                  </Label>
                  <Input
                    id="paper-title"
                    autoFocus
                    error={errors.title?.message}
                    aria-describedby={
                      errors.title ? "paper-title-error" : undefined
                    }
                    {...register("title")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="paper-abstract" required>
                    Abstract
                  </Label>
                  <Controller
                    name="abstract"
                    control={control}
                    render={({ field }) => (
                      <QuillEditor
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        invalid={Boolean(errors.abstract)}
                      />
                    )}
                  />
                  <p
                    id="paper-abstract-error"
                    className={cn(
                      "min-h-4 text-xs",
                      errors.abstract
                        ? "text-red-600"
                        : "text-slate-500",
                    )}
                  >
                    {errors.abstract?.message ||
                      "Use the toolbar for essential formatting."}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="paper-authors" required>
                    Authors
                  </Label>
                  <Input
                    id="paper-authors"
                    error={errors.authors?.message}
                    {...register("authors")}
                  />
                  {!errors.authors ? (
                    <p className="text-xs text-slate-500">
                      Separate multiple authors with commas.
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="paper-keywords" required>
                    Keywords
                  </Label>
                  <Input
                    id="paper-keywords"
                    error={errors.keywords?.message}
                    {...register("keywords")}
                  />
                  {!errors.keywords ? (
                    <p className="text-xs text-slate-500">
                      Separate keywords with commas.
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="paper-track" required>
                    Track/Subcommittee Selection
                  </Label>
                  <Controller
                    name="linhVuc"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={fieldsStatus !== "ready"}
                      >
                        <SelectTrigger
                          id="paper-track"
                          aria-invalid={Boolean(errors.linhVuc)}
                          className="w-full"
                        >
                          <SelectValue
                            placeholder={
                              fieldsStatus === "error"
                                ? "Tracks unavailable"
                                : fieldsStatus === "ready"
                                  ? "Select a track/subcommittee"
                                  : "Loading tracks…"
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
                    )}
                  />
                  {fieldsStatus === "error" ? (
                    <p className="text-xs text-red-600">
                      We couldn&apos;t load the list of tracks/subcommittees.
                      Please close and reopen this form to try again.
                    </p>
                  ) : errors.linhVuc ? (
                    <p className="text-xs text-red-600">
                      {errors.linhVuc.message}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Please select one of the four tracks/subcommittees
                      below that best matches the author&apos;s submission.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="paper-files" required>
                    Attachments
                  </Label>
                  <label
                    className={cn(
                      "flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:bg-slate-100",
                      isDragging && "border-blue-500 bg-blue-50",
                    )}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      setIsDragging(false);
                      addFiles(Array.from(event.dataTransfer.files));
                    }}
                  >
                    <input
                      id="paper-files"
                      type="file"
                      multiple
                      accept={PAPER_FILE_ACCEPT}
                      className="sr-only"
                      aria-invalid={Boolean(fileError)}
                      aria-describedby="paper-files-help paper-files-error"
                      onChange={(event) => {
                        addFiles(Array.from(event.currentTarget.files ?? []));
                        event.currentTarget.value = "";
                      }}
                    />
                    <p className="text-sm font-medium [@media(hover:none)]:hidden">
                      {isDragging
                        ? "Drop files to attach them"
                        : "Drag and drop manuscript files here"}
                    </p>
                    <p
                      id="paper-files-help"
                      className="mt-1 text-pretty text-sm text-slate-500"
                    >
                      .doc, .docx, or .pdf. Up to {MAX_SUBMISSION_FILES} files.
                    </p>
                    <span className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium">
                      <Upload className="size-4" aria-hidden />
                      Choose files
                    </span>
                  </label>

                  <p
                    id="paper-files-error"
                    className="min-h-4 text-xs text-red-600"
                  >
                    {fileError}
                  </p>

                  {files.length > 0 ? (
                    <ul className="divide-y divide-slate-200" aria-label="Attached files">
                      {files.map((file, index) => {
                        const nameParts = splitFileName(file.name);
                        return (
                          <li
                            key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                            className="flex min-w-0 items-center gap-3 py-3"
                          >
                            <FileText
                              className="size-5 shrink-0 text-slate-500"
                              aria-hidden
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className="flex min-w-0 text-sm font-medium"
                                title={file.name.length > 35 ? file.name : undefined}
                              >
                                <span className="truncate">{nameParts.head}</span>
                                <span className="shrink-0">{nameParts.tail}</span>
                              </p>
                              <p className="mt-1 text-xs text-slate-500 tabular-nums">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            <button
                              type="button"
                              aria-label={`Remove ${file.name}`}
                              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
                              onClick={() => {
                                setFiles((currentFiles) =>
                                  currentFiles.filter(
                                    (_, fileIndex) => fileIndex !== index,
                                  ),
                                );
                                setFileError("");
                              }}
                            >
                              <X className="size-4" aria-hidden />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-11 px-4 md:h-10"
                  disabled={isSubmitting}
                  onClick={() => changeOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="paper-submission-form"
                  aria-busy={isSubmitting || undefined}
                  aria-disabled={isSubmitting || undefined}
                  className="relative h-11 min-w-32 px-4 md:h-10"
                  onClick={(event) => {
                    if (isSubmitting) event.preventDefault();
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="invisible">Submit paper</span>
                      <LoaderCircle
                        className="absolute inset-0 m-auto size-4 animate-spin motion-reduce:animate-none"
                        aria-hidden
                      />
                    </>
                  ) : (
                    "Submit paper"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
