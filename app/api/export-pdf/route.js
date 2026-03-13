import { NextResponse } from "next/server";
import { compileMarkdown } from "@/lib/compile-markdown";
import { buildHtmlDocument } from "@/lib/build-document";
import { renderPdfFromHtml } from "@/lib/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    if (typeof body.markdown !== "string") {
      return NextResponse.json({ error: "Invalid request body. Expected markdown string." }, { status: 400 });
    }

    const htmlFragment = await compileMarkdown(body.markdown);
    const fullHtml = buildHtmlDocument(htmlFragment, "markdown-export");
    const pdfBytes = await renderPdfFromHtml(fullHtml);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"document.pdf\""
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to export PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
