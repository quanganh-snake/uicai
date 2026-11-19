"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CircleX, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegistrationResultDialogProps {
  result:
    | { type: "success" }
    | {
        type: "error";
        message: string;
        reference?: string;
      };
  onClose: () => void;
}

const VERIFICATION_TIMEOUT_SECONDS = 10 * 60;
const VERIFICATION_TIMEOUT_MS = VERIFICATION_TIMEOUT_SECONDS * 1000;

function RegistrationSuccessContent() {
  const [remainingSeconds, setRemainingSeconds] = useState(
    VERIFICATION_TIMEOUT_SECONDS,
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);
    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
      setRemainingSeconds(0);
    }, VERIFICATION_TIMEOUT_MS);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const isExpired = remainingSeconds === 0;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedRemainingTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  return (
    <>
      <DialogHeader className="items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-7 text-emerald-700" aria-hidden />
        </div>
        <DialogTitle className="text-xl font-semibold text-emerald-700">
          Registration successful!
        </DialogTitle>
        <DialogDescription className="text-pretty text-sm/6">
          Please check your email to verify your account (valid for 10 minutes).
        </DialogDescription>
      </DialogHeader>

      {isExpired ? (
        <div
          className="rounded-xl bg-destructive/10 p-4 text-center text-sm/6 text-destructive"
          role="alert"
        >
          The verification time has expired. Please request a new verification email.
        </div>
      ) : (
        <div className="rounded-xl bg-muted p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="size-4" aria-hidden />
            <span>Time remaining to verify</span>
          </div>
          <p
            className="mt-2 text-2xl font-semibold tabular-nums"
            role="timer"
            aria-label={`Time remaining to verify: ${formattedRemainingTime}`}
          >
            {formattedRemainingTime}
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
        {isExpired ? (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/auth/resend-verification">Resend verification email</Link>
          </Button>
        ) : (
          <>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/auth/resend-verification">Resend email</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export function RegistrationResultDialog({
  result,
  onClose,
}: RegistrationResultDialogProps) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="gap-6 p-6 sm:max-w-md">
        {result.type === "success" ? (
          <RegistrationSuccessContent />
        ) : (
          <>
            <DialogHeader className="items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
                <CircleX className="size-7 text-destructive" aria-hidden />
              </div>
              <DialogTitle className="text-xl font-semibold text-destructive">
                Registration failed
              </DialogTitle>
              <DialogDescription className="text-pretty text-sm/6">
                {result.message}
              </DialogDescription>
              {result.reference ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Error code: {result.reference}
                </p>
              ) : null}
            </DialogHeader>
            <div className="flex justify-center">
              <Button type="button" className="w-full sm:w-auto" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
