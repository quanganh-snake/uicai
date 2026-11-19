import type { Metadata } from "next";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign in | AIESI 2027",
  description: "Sign in to manage your papers and register for the AIESI 2027 conference",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    recoverSubmission?: string;
    sessionExpired?: string;
  }>;
}) {
  const { recoverSubmission, sessionExpired } = await searchParams;
  return (
    <LoginForm
      recoveryRequested={recoverSubmission === "1"}
      sessionExpired={sessionExpired === "1"}
    />
  );
}
