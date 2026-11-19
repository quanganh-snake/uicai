import type {
  AddKHCNAIESIBody,
  ApiSuccess,
  BffResult,
  DeleteFilesSuccess,
  EditKHCNAIESIBody,
  KHCNAIESIBaiDang,
  PagedSuccess,
  UploadedFile,
} from "./types";
import { getFriendlyErrorMessage } from "./error-messages";

async function parseBff<T>(response: Response): Promise<T> {
  const result = (await response.json().catch(() => null)) as BffResult<T> | null;
  if (!response.ok || !result?.ok) {
    throw new Error(
      getFriendlyErrorMessage(
        result && !result.ok ? result.error.message : undefined,
        "We couldn't complete your request. Please try again.",
      ),
    );
  }
  return result.data;
}

export async function getPosts(input: {
  pageNumber: number;
  pageSize: number;
  searchText?: string;
  trangThai?: string;
}) {
  const query = new URLSearchParams({
    pageNumber: String(input.pageNumber),
    pageSize: String(input.pageSize),
  });
  if (input.searchText) query.set("searchText", input.searchText);
  if (input.trangThai) query.set("trangThai", input.trangThai);
  return parseBff<PagedSuccess<KHCNAIESIBaiDang>>(
    await fetch(`/api/khcn-aiesi/posts?${query}`, { cache: "no-store" }),
  );
}

export interface KHCNAIESIField {
  id: string;
  ten: string;
}

export async function getFields() {
  return parseBff<KHCNAIESIField[]>(
    await fetch("/api/khcn-aiesi/fields", { cache: "no-store" }),
  );
}

export async function getPost(id: string) {
  const query = new URLSearchParams({ KHCN_AIESI_BaiDang_ID: id });
  return parseBff<ApiSuccess<KHCNAIESIBaiDang[]>>(
    await fetch(`/api/khcn-aiesi/posts/detail?${query}`, { cache: "no-store" }),
  );
}

export async function addPost(body: AddKHCNAIESIBody) {
  return parseBff<ApiSuccess<unknown[]>>(
    await fetch("/api/khcn-aiesi/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function updatePost(body: EditKHCNAIESIBody) {
  return parseBff<ApiSuccess<unknown[]>>(
    await fetch("/api/khcn-aiesi/posts/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function softDeletePost(id: string) {
  return parseBff<ApiSuccess<unknown[]>>(
    await fetch("/api/khcn-aiesi/posts/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ KHCN_AIESI_BaiDang_ID: id }),
    }),
  );
}

export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return parseBff<{ code: 200; message: string; body: UploadedFile[] }>(
    await fetch("/api/khcn-aiesi/files/upload", {
      method: "POST",
      body: formData,
    }),
  );
}

export async function deleteFiles(fileUrls: string[]) {
  const result = await parseBff<DeleteFilesSuccess>(
    await fetch("/api/khcn-aiesi/files/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrls }),
    }),
  );
  if (result.errors?.length) {
    throw new Error(
      result.errors
        .map((item) => getFriendlyErrorMessage(item.error))
        .join("; "),
    );
  }
  return result;
}
