import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VerifyEmailResultProps {
  status: "success" | "error";
  message: string;
}

export function VerifyEmailResult({
  status,
  message,
}: VerifyEmailResultProps) {
  if (status === "success") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-700" aria-hidden />
          </div>
          <CardTitle className="text-2xl text-emerald-700">
            Verification successful!
          </CardTitle>
          <CardDescription className="text-base">{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Your account has been activated. You can sign in and start using the
            system.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/auth/login" className="w-full">
            <Button className="w-full" size="lg">
              Sign in now
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-8 w-8 text-destructive" aria-hidden />
        </div>
        <CardTitle className="text-2xl text-destructive">
          Verification failed
        </CardTitle>
        <CardDescription className="text-base">{message}</CardDescription>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <p>
          The verification token may have expired or is not valid. You can request
          a new verification email.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Link href="/auth/resend-verification" className="w-full">
          <Button className="w-full">Resend verification email</Button>
        </Link>
        <Link
          href="/auth/login"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
