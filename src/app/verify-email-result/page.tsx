import type { Metadata } from "next";

import { VerifyEmailResult } from "@/components/auth";
import { getFriendlyErrorMessage } from "@/lib/khcn-aiesi/error-messages";

export const metadata: Metadata = {
  title: "Email Verification Result | AIESI 2027",
  description: "Result of the email address verification for your AIESI 2027 account",
};

interface VerifyEmailResultPageProps {
  searchParams: Promise<{
    status?: string | string[];
    message?: string | string[];
  }>;
}

export default async function VerifyEmailResultPage({
  searchParams,
}: VerifyEmailResultPageProps) {
  const { status: statusParam, message: messageParam } = await searchParams;
  const rawStatus = Array.isArray(statusParam) ? statusParam[0] : statusParam;
  const rawMessage = Array.isArray(messageParam) ? messageParam[0] : messageParam;
  const status = rawStatus === "success" ? "success" : "error";
  const defaultMessage =
    status === "success"
      ? "Your email has been verified successfully!"
      : "The verification link is not valid or has expired.";
  // The message arrives in the query string, possibly from the upstream API in
  // Vietnamese: unknown non-English text falls back to the default message.
  const message = getFriendlyErrorMessage(rawMessage, defaultMessage);

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <VerifyEmailResult status={status} message={message} />
    </div>
  );
}
