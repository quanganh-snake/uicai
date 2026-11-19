import { NextResponse } from "next/server";

import { hasSuccessFlag, relayUpstreamJson } from "@/lib/auth/upstream";
import { dobDisplayToIso, registerSchema } from "@/lib/validations/auth";

const API_BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://apiv3.uneti.edu.vn";
const REGISTER_ENDPOINT = `${API_BASE_URL}/api/auth/nguoi-dung-ngoai/register`;

const INVALID_MESSAGE =
  "Your registration details are not valid. Please check the required fields.";
const REJECTED_MESSAGE =
  "Registration was not successful. The username or email may already be in use. Please check your details.";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      {
        code: 400,
        success: false,
        message: INVALID_MESSAGE,
        reference: "REG-400",
      },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  // `confirmPassword` is only for client-side form validation and is not sent to apiv3.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirmPassword, ...upstreamPayload } = parsed.data;

  // The form sends the date of birth as dd/mm/yyyy; apiv3 expects sql.Date-compatible yyyy-mm-dd.
  upstreamPayload.HT_NguoiDungNgoai_NgaySinh = dobDisplayToIso(
    upstreamPayload.HT_NguoiDungNgoai_NgaySinh,
  );

  return relayUpstreamJson({
    scope: "auth/register",
    prefix: "REG",
    endpoint: REGISTER_ENDPOINT,
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upstreamPayload),
    },
    isSuccess: (value, response) => response.ok && hasSuccessFlag(value),
    successMessage: "Registration successful.",
    rejectedMessage: REJECTED_MESSAGE,
  });
}
