import "katex/dist/katex.min.css";
import "@/app/globals.css";

export const metadata = {
  title: "Markdown Exporter MVP",
  description: "Markdown to HTML and PDF with math support"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
