import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in / Sign up | AIESI 2027",
  description:
    "Sign in or create an account to take part in the AIESI 2027 conference",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
