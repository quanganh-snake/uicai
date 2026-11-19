import "server-only";

import type { KHCNAIESIBaiDang, UploadedFile } from "./types";
import { absoluteFile, backendFile } from "./backend";

export function browserPost(post: KHCNAIESIBaiDang): KHCNAIESIBaiDang {
  return {
    ...post,
    KHCN_AIESI_BaiDang_LinkFile:
      post.KHCN_AIESI_BaiDang_LinkFile.map(absoluteFile),
  };
}

export function upstreamFiles(files: UploadedFile[]) {
  return files.map(backendFile);
}

export function passthroughQuery(
  values: Record<string, string | number | undefined>,
) {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return query;
}
