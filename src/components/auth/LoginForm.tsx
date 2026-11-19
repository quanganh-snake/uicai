"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { AuthRequestError, loginUser } from "@/lib/api/auth";
import { getFriendlyErrorMessage } from "@/lib/khcn-aiesi/error-messages";
import {
  clearSubmissionDraft,
  hasPendingSubmissionRecovery,
  markSubmissionRecoveryAuthenticated,
  SUBMISSION_PATH,
} from "@/lib/submission-recovery";
interface LoginErrorState {
  message: string;
  canResendVerification: boolean;
}

interface LoginFormProps {
  recoveryRequested?: boolean;
  sessionExpired?: boolean;
}

/**
 * Matches the raw message returned by the auth backend (not UI copy). The
 * upstream apiv3 may still answer in Vietnamese ("chưa được xác thực",
 * "xác thực email"), while this app's own routes answer in English
 * ("...whether your email has been verified", "email has not been verified").
 */
function requiresEmailVerification(message: string) {
  const normalizedMessage = message.toLocaleLowerCase("vi-VN");

  return (
    normalizedMessage.includes("email") &&
    (normalizedMessage.includes("chưa được xác thực") ||
      normalizedMessage.includes("xác thực email") ||
      /\b(verif(y|ied|ication)|not verified)\b/.test(normalizedMessage))
  );
}

export function LoginForm({
  recoveryRequested = false,
  sessionExpired = false,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<LoginErrorState | null>(null);

  useEffect(() => {
    if (!recoveryRequested || !hasPendingSubmissionRecovery()) return;


    const abandonOnNavigation = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || link.target === "_blank") return;

      event.preventDefault();
      const destination = link.href;
      void clearSubmissionDraft().finally(() => {
        window.location.assign(destination);
      });
    };
    const abandonOnHistoryNavigation = () => {
      void clearSubmissionDraft();
    };

    document.addEventListener("click", abandonOnNavigation, true);
    window.addEventListener("popstate", abandonOnHistoryNavigation);
    return () => {
      document.removeEventListener("click", abandonOnNavigation, true);
      window.removeEventListener("popstate", abandonOnHistoryNavigation);
    };
  }, [recoveryRequested]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      await loginUser(data);
      const shouldRecover =
        new URLSearchParams(window.location.search).get("recoverSubmission") ===
          "1" && markSubmissionRecoveryAuthenticated();
      window.location.replace(shouldRecover ? SUBMISSION_PATH : "/aiesi-2027");
    } catch (error) {
      const fallback = "Sign-in failed. Please check your details and try again.";
      const rawMessage =
        error instanceof AuthRequestError ? error.message : fallback;
      setApiError({
        message: getFriendlyErrorMessage(rawMessage, fallback),
        // Detect on the raw backend text, before it is translated.
        canResendVerification: requiresEmailVerification(rawMessage),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {sessionExpired ? (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed right-4 top-4 z-100 max-w-[calc(100vw-2rem)] rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950 shadow-lg sm:max-w-md"
        >
          Your session has ended. Please sign in again to continue.
        </div>
      ) : null}

      <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Sign in to manage your papers and register for the conference
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {apiError && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <p>{apiError.message}</p>
              {apiError.canResendVerification && (
                <Link
                  href="/auth/resend-verification"
                  className="mt-2 inline-flex font-semibold underline underline-offset-4 hover:text-destructive/80"
                >
                  Resend verification email
                </Link>
              )}
            </div>
          )}

          {recoveryRequested ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
              Sign in again to continue your paper submission. Your form data
              and attached files will be restored.
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="TenDangNhap" required>
              Username
            </Label>
            <Input
              id="TenDangNhap"
              placeholder="username"
              autoComplete="username"
              {...register("TenDangNhap")}
              error={errors.TenDangNhap?.message}
              tabIndex={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="MatKhau" required>
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
                tabIndex={4}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="MatKhau"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("MatKhau")}
                error={errors.MatKhau?.message}
                tabIndex={2}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
          {recoveryRequested ? (
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                void clearSubmissionDraft().finally(() => {
                  window.location.replace("/aiesi-2027");
                });
              }}
            >
              Cancel and discard form data
            </Button>
          ) : null}
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
      </Card>
    </>
  );
}
