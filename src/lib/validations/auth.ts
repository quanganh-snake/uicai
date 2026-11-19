import { z } from "zod";

// Date of birth is entered and displayed as dd/mm/yyyy regardless of browser locale.
export const DOB_DISPLAY_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const DOB_MIN_YEAR = 1900;

// Parses a dd/mm/yyyy date of birth into a Date, e.g. to sync the calendar picker with what was typed.
export function parseDobDisplayValue(value: string): Date | null {
  const match = DOB_DISPLAY_PATTERN.exec(value);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const isRealCalendarDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isRealCalendarDate ? date : null;
}

// Formats a Date picked from the calendar back into the dd/mm/yyyy display value.
export function formatDobDisplayValue(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

// Converts a dd/mm/yyyy date of birth into the yyyy-mm-dd format the upstream API expects.
export function dobDisplayToIso(value: string): string {
  const match = DOB_DISPLAY_PATTERN.exec(value);
  if (!match) return value;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

// Account registration schema
export const registerSchema = z
  .object({
    HT_NguoiDungNgoai_HoDem: z
      .string()
      .trim()
      .min(1, "Enter your middle and last name")
      .max(100, "Middle and last name must be 100 characters or fewer"),
    HT_NguoiDungNgoai_Ten: z
      .string()
      .trim()
      .min(1, "Enter your first name")
      .max(50, "First name must be 50 characters or fewer"),
    HT_NguoiDungNgoai_NgaySinh: z
      .string()
      .trim()
      .min(1, "Enter your date of birth")
      .superRefine((value, ctx) => {
        if (!DOB_DISPLAY_PATTERN.test(value)) {
          ctx.addIssue({
            code: "custom",
            message: "Date of birth must be in dd/mm/yyyy format",
          });
          return;
        }

        const date = parseDobDisplayValue(value);
        if (!date) {
          ctx.addIssue({ code: "custom", message: "Enter a valid date of birth" });
          return;
        }

        if (date.getFullYear() < DOB_MIN_YEAR) {
          ctx.addIssue({
            code: "custom",
            message: `Date of birth year must be ${DOB_MIN_YEAR} or later`,
          });
          return;
        }

        if (date.getTime() > Date.now()) {
          ctx.addIssue({
            code: "custom",
            message: "Date of birth cannot be in the future",
          });
        }
      }),
    HT_NguoiDungNgoai_GioiTinh: z.boolean({
      error: "Select your gender",
    }),
    HT_NguoiDungNgoai_CoQuan: z
      .string()
      .trim()
      .min(1, "Enter your organization or institution")
      .max(250, "Organization name must be 250 characters or fewer"),
    HT_NguoiDungNgoai_ChucVu: z
      .string()
      .trim()
      .min(1, "Enter your position")
      .max(100, "Position must be 100 characters or fewer"),
    HT_NguoiDungNgoai_DiaChi: z
      .string()
      .trim()
      .max(500, "Address must be 500 characters or fewer")
      .optional(),
    HT_NguoiDungNgoai_TenDangNhap: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(100, "Username must be 100 characters or fewer")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores"
      ),
    HT_NguoiDungNgoai_Email: z
      .string()
      .min(1, "Enter your email address")
      .email("Enter a valid email address")
      .max(250, "Email must be 250 characters or fewer"),
    HT_NguoiDungNgoai_SoDienThoai: z
      .string()
      .trim()
      .min(1, "Enter your phone number")
      .max(20, "Phone number must be 20 characters or fewer")
      .regex(/^[0-9+\-\s]+$/, "Enter a valid phone number"),
    HT_NguoiDungNgoai_MatKhau: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be 50 characters or fewer")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least 1 special character"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.HT_NguoiDungNgoai_MatKhau === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Sign-in schema
export const loginSchema = z.object({
  TenDangNhap: z.string().min(1, "Enter your username"),
  MatKhau: z.string().min(1, "Enter your password"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Resend verification email schema
export const resendVerificationSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address")
    .email("Enter a valid email address")
    .max(250, "Email must be 250 characters or fewer"),
  username: z
    .string()
    .trim()
    .min(1, "Enter your username")
    .max(100, "Username must be 100 characters or fewer")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),
});

export type ResendVerificationFormData = z.infer<
  typeof resendVerificationSchema
>;
