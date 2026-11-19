import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthenticatedNavbar } from "@/components/layout/AuthenticatedNavbar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiesi2027.uneti.edu.vn",
  ),
  title:
    "International Conference on Artificial Intelligence, Engineering and Sustainable Innovation (AIESI 2027) | AIESI",
  description:
    "AIESI 2027 is the second international conference on Artificial Intelligence in the annual conference series organized by CMC University, in collaboration with Steinbeis University - Schools of Next Practices, Germany, and Tsinghua University, Shenzhen International Graduate School (SIGS), China.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title:
      "International Conference on Artificial Intelligence, Engineering and Sustainable Innovation (AIESI 2027)",
    description:
      "AIESI 2027 is the second international conference on Artificial Intelligence in the annual conference series organized by CMC University, in collaboration with Steinbeis University - Schools of Next Practices, Germany, and Tsinghua University, Shenzhen International Graduate School (SIGS), China.",
    images: ["/images/bannerv1.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Suspense
          fallback={<Navbar initialUser={null} initialIsAdmin={false} />}
        >
          <AuthenticatedNavbar />
        </Suspense>
        <main className="flex-1 pt-16 sm:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
