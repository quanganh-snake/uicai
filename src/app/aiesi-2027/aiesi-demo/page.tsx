import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AiesiDemo } from "@/components/khcn-aiesi/AiesiDemo";
import { AUTH_COOKIE_NAME, parseAuthSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "KHCN AIESI API Demo | AIESI 2027",
  description: "Demo of integrated CRUD and file management for KHCN_AIESI.",
};

export default async function AiesiDemoPage() {
  const store = await cookies();
  const session = parseAuthSession(store.get(AUTH_COOKIE_NAME)?.value);
  if (!session) redirect("/auth/login");

  return <AiesiDemo />;
}
