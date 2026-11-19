import "server-only";

import { z } from "zod";

const envSchema = z.object({
  KHCN_AIESI_API_URL: z.url(),
  KHCN_AIESI_FILE_PUBLIC_URL: z.url(),
});

const env = envSchema.parse({
  KHCN_AIESI_API_URL: process.env.KHCN_AIESI_API_URL,
  KHCN_AIESI_FILE_PUBLIC_URL: process.env.KHCN_AIESI_FILE_PUBLIC_URL,
});

export const KHCN_AIESI_API_BASE = new URL(
  "/api/SP_KHCN_AIESI/",
  env.KHCN_AIESI_API_URL,
);
export const KHCN_AIESI_FILE_BASE = env.KHCN_AIESI_FILE_PUBLIC_URL;
