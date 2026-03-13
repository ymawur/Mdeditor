import { NextResponse } from "next/server";
import { compileMarkdown } from "@/lib/compile-markdown";
import { buildHtmlDocument } from "@/lib/build-document";
import { renderPdfFromHtml } from "@/lib/pdf";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { markdown?: string };

    if (typeof body.markdown !== "string") {
      return NextResponse.json({ error: "Invalid request body. Expected markdown string." }, { status: 400 });
    }

    const htmlFragment = await compileMarkdown(body.markdown);
    const fullHtml = buildHtmlDocument(htmlFragment, "markdown-export");
    const pdfBuffer = await renderPdfFromHtml(fullHtml);
    const pdfBytes = Uint8Array.from(pdfBuffer);

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"document.pdf\""
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to export PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
