import "./globals.css";
import { Suspense } from "react";
import LoadingProvider from "@/components/LoadingProvider";
import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Coffee Shop Stamping",
  description: "Digital coffee shop loyalty card"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${sans.variable}`}><Suspense fallback={null}><LoadingProvider>{children}</LoadingProvider></Suspense></body></html>;
}
