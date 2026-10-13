import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["Geist Mono", "Geist Mono Fallback", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://icai.cmcu.edu.vn"),
  title: "The 2nd International Conference on AI: AI-Native for Universities and Industry | ICAI",
  description:
    "ICAI-FAI 2026 is the second international conference on Artificial Intelligence in the annual conference series organized by CMC University, in collaboration with Steinbeis University - Schools of Next Practices, Germany, and Tsinghua University, Shenzhen International Graduate School (SIGS), China.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "The 2nd International Conference on AI: AI-Native for Universities and Industry",
    description:
      "ICAI-FAI 2026 is the second international conference on Artificial Intelligence in the annual conference series organized by CMC University, in collaboration with Steinbeis University and Tsinghua University SIGS.",
    images: ["/images/banner.png"],
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
      className={`${geistMono.variable} ${geistMono.className} h-full antialiased font-mono`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-mono">
        <Navbar />
        <main className="flex-1 pt-16 sm:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}


