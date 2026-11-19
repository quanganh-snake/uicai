"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, CheckCircle2, Mail } from "lucide-react";

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
import {
  resendVerificationSchema,
  type ResendVerificationFormData,
} from "@/lib/validations/auth";
import { AuthRequestError, resendVerificationEmail } from "@/lib/api/auth";
import { getFriendlyErrorMessage } from "@/lib/khcn-aiesi/error-messages";

export function ResendVerificationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<{
    message: string;
    reference?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
  });

  const onSubmit = async (data: ResendVerificationFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      await resendVerificationEmail(data);
      setSuccess(true);
    } catch (error) {
      const known = error instanceof AuthRequestError;

      setApiError({
        message: getFriendlyErrorMessage(
          known ? error.message : undefined,
          "We couldn't send the verification email. Please try again later.",
        ),
        reference: known ? error.reference : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Email sent!</CardTitle>
          <CardDescription className="text-base">
            The verification email has been sent again. Please check your inbox
            (including your Spam folder).
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3">
          <Link href="/auth/login" className="w-full">
            <Button className="w-full">Sign in</Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => setSuccess(false)}
            className="text-muted-foreground"
          >
            Send again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Resend verification email</CardTitle>
        <CardDescription>
          Enter your email and username to resend the verification email
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          {apiError && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {apiError.message}
              {apiError.reference ? (
                <span className="mt-1 block text-xs opacity-80">
                  Reference: {apiError.reference}
                </span>
              ) : null}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="username" required>
              Username
            </Label>
            <Input
              id="username"
              placeholder="username"
              {...register("username")}
              error={errors.username?.message}
            />
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
            Send verification email
          </Button>
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
