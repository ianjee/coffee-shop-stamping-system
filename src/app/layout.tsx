import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Coffee Shop Stamping",
  description: "Digital coffee shop loyalty card"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
