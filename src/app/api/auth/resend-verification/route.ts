import { NextResponse } from "next/server";

import { hasSuccessFlag, relayUpstreamJson } from "@/lib/auth/upstream";
import { resendVerificationSchema } from "@/lib/validations/auth";

const API_BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://apiv3.uneti.edu.vn";
const RESEND_ENDPOINT = `${API_BASE_URL}/api/auth/nguoi-dung-ngoai/resend-verification`;

const INVALID_MESSAGE =
  "The information provided is not valid. Please enter your email and username correctly.";
const REJECTED_MESSAGE =
  "We couldn't send the verification email. Please check your email and username, or try again later.";

export async function POST(request: Request) {
  const parsed = resendVerificationSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      {
        code: 400,
        success: false,
        message: INVALID_MESSAGE,
        reference: "RSV-400",
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  return relayUpstreamJson({
    scope: "auth/resend-verification",
    prefix: "RSV",
    endpoint: RESEND_ENDPOINT,
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    },
    isSuccess: (value, response) => response.ok && hasSuccessFlag(value),
    successMessage: "The verification email has been sent again.",
    rejectedMessage: REJECTED_MESSAGE,
  });
}
