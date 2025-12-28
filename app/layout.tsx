import type { Metadata } from "next";
import { Geist_Mono, Afacad } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const afacad = Afacad({
  variable: "--font-afacad",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SDS CRM",
  description: "A simple CRM built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${afacad.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <NuqsAdapter>
          {children}
          <Toaster position="top-center" />
        </NuqsAdapter>
      </body>
    </html>
  );
}
