import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { branding } from "@/lib/branding";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kawn Sentiment Analysis",
  description:
    "See how Kawn reads the vibe of every comment—demo experience.",
  icons: {
    icon: [{ url: branding.favicon, type: "image/png" }],
    apple: branding.favicon,
    shortcut: branding.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505]">{children}</body>
    </html>
  );
}
