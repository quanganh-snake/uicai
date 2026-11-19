import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getEmailVerificationUrl } from "@/lib/api/auth";

export const metadata: Metadata = {
  title: "Verify Email | AIESI 2027",
  description: "Verify the email address for your AIESI 2027 account",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string | string[];
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token: tokenParam } = await searchParams;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  if (!token) {
    const resultParams = new URLSearchParams({
      status: "error",
      message: "The verification link is missing its token.",
    });
    redirect(`/verify-email-result?${resultParams.toString()}`);
  }

  redirect(getEmailVerificationUrl(token));
}
