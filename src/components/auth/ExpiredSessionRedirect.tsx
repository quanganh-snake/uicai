"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";

export function ExpiredSessionRedirect() {
  const startedRef = React.useRef(false);

  React.useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const signOutAndLeave = async () => {
      try {
        await fetch("/api/auth/session", { method: "DELETE" });
      } catch {
        // Cookie clearing failed; still leave the page.
      }

      window.location.replace("/aiesi-2027");
    };

    void signOutAndLeave();
  }, []);

  return (
    <div className="min-h-[calc(100vh-9rem)] bg-slate-50 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-xl font-semibold text-slate-950">
          Your session has expired
        </h1>
        <p className="mt-2 text-pretty text-sm leading-6 text-muted-foreground">
          Your session has ended. Redirecting to the conference home page…
        </p>
        <Button asChild className="mt-6 h-11 px-5 md:h-10">
          <Link href="/aiesi-2027">Back to the conference home page</Link>
        </Button>
      </div>
    </div>
  );
}
