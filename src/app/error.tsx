"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[app] render error", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-9rem)] bg-slate-50 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-xl font-semibold text-slate-950">
          Something went wrong
        </h1>
        <p className="mt-2 text-pretty text-sm leading-6 text-muted-foreground">
          The page could not be loaded. Please try again.
        </p>
        {error.digest ? (
          <p className="mt-1 text-xs tabular-nums text-muted-foreground">
            Error ID: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset} className="h-11 px-5 md:h-10">
            Try again
          </Button>
          <Button asChild variant="outline" className="h-11 px-5 md:h-10">
            <Link href="/aiesi-2027">Conference home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
