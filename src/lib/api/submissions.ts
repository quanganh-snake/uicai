import type { PaperSubmissionFormData } from "@/lib/validations/submission";

interface SubmitPaperInput extends PaperSubmissionFormData {
  files: File[];
}

interface SubmissionApiResponse {
  success?: boolean;
  message?: string;
}
export class SubmissionApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "SubmissionApiError";
  }
}

export async function submitPaper({
  files,
  ...fields
}: SubmitPaperInput): Promise<string> {
  const formData = new FormData();

  formData.set("title", fields.title);
  formData.set("abstract", fields.abstract);
  formData.set("authors", fields.authors);
  formData.set("keywords", fields.keywords);
  formData.set("linhVuc", fields.linhVuc);
  files.forEach((file) => formData.append("files", file));

  const response = await fetch("/api/submissions", {
    method: "POST",
    body: formData,
  });
  const result = (await response.json().catch(() => null)) as
    | SubmissionApiResponse
    | null;

  if (!response.ok || !result?.success) {
    throw new SubmissionApiError(
      result?.message || "The paper could not be submitted",
      response.status,
    );
  }

  return result.message || "Your paper has been submitted successfully.";
}
