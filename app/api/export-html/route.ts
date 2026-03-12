import { NextResponse } from "next/server";
import { compileMarkdown } from "@/lib/compile-markdown";
import { buildHtmlDocument } from "@/lib/build-document";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { markdown?: string };

    if (typeof body.markdown !== "string") {
      return NextResponse.json({ error: "Invalid request body. Expected markdown string." }, { status: 400 });
    }

    const htmlFragment = await compileMarkdown(body.markdown);
    const fullHtml = buildHtmlDocument(htmlFragment, "markdown-export");

    return new NextResponse(fullHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": "attachment; filename=\"document.html\""
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to export HTML.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
