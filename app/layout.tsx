import type { Metadata } from "next";
import type { ReactNode } from "react";
import "katex/dist/katex.min.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Markdown Exporter MVP",
  description: "Markdown to HTML and PDF with math support"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
