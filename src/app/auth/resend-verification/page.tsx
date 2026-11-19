import type { Metadata } from "next";
import { ResendVerificationForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Resend Verification Email | AIESI 2027",
  description: "Resend the verification email for your AIESI 2027 account",
};

export default function ResendVerificationPage() {
  return <ResendVerificationForm />;
}
