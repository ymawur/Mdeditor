"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { SAMPLE_MARKDOWN } from "@/lib/sample-markdown";
import { compileMarkdown } from "@/lib/compile-markdown";
import { Preview } from "@/components/Preview";

async function downloadFromApi(url: string, markdown: string, filename: string) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown })
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = (await response.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // No-op fallback to generic message.
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}

export function Editor() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isExportingHtml, setIsExportingHtml] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    let cancelled = false;

    startTransition(() => {
      compileMarkdown(markdown)
        .then((html) => {
          if (!cancelled) {
            setPreviewHtml(html);
            setPreviewError(null);
          }
        })
        .catch((error: unknown) => {
          if (!cancelled) {
            setPreviewError(error instanceof Error ? error.message : "Failed to compile preview.");
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, [markdown]);

  const status = useMemo(() => {
    if (isExportingHtml) return "Exporting HTML...";
    if (isExportingPdf) return "Exporting PDF...";
    if (isPending) return "Rendering preview...";
    return "Ready";
  }, [isExportingHtml, isExportingPdf, isPending]);

  return (
    <main className="app-shell">
      <section className="editor-layout">
        <section className="pane">
          <header className="pane-header">
            <strong>Markdown</strong>
            <div className="toolbar">
              <button type="button" onClick={() => setMarkdown(SAMPLE_MARKDOWN)}>
                Load sample content
              </button>
              <button
                type="button"
                disabled={isExportingHtml || isExportingPdf}
                onClick={async () => {
                  setExportError(null);
                  setIsExportingHtml(true);
                  try {
                    await downloadFromApi("/api/export-html", markdown, "document.html");
                  } catch (error: unknown) {
                    setExportError(error instanceof Error ? error.message : "Failed to export HTML.");
                  } finally {
                    setIsExportingHtml(false);
                  }
                }}
              >
                Export HTML
              </button>
              <button
                type="button"
                disabled={isExportingHtml || isExportingPdf}
                onClick={async () => {
                  setExportError(null);
                  setIsExportingPdf(true);
                  try {
                    await downloadFromApi("/api/export-pdf", markdown, "document.pdf");
                  } catch (error: unknown) {
                    setExportError(error instanceof Error ? error.message : "Failed to export PDF.");
                  } finally {
                    setIsExportingPdf(false);
                  }
                }}
              >
                Export PDF
              </button>
            </div>
          </header>
          <textarea
            aria-label="Markdown input"
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            spellCheck={false}
          />
        </section>

        <section className="pane">
          <header className="pane-header">
            <strong>Preview</strong>
            <small>{status}</small>
          </header>
          <div className="preview-scroll">
            {previewError ? <p className="error-text">{previewError}</p> : <Preview html={previewHtml} />}
            {exportError ? <p className="error-text">{exportError}</p> : null}
          </div>
        </section>
      </section>
    </main>
  );
}
