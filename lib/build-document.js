import { ARTICLE_CSS, PRINT_CSS } from "@/lib/document-styles";

const KATEX_CSS_CDN_URL = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";

function escapeTitle(value) {
  return value.replace(/[&<>\"]/g, (ch) => {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    return "&quot;";
  });
}

export function buildHtmlDocument(htmlFragment, title = "document") {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeTitle(title)}</title>
    <link rel="stylesheet" href="${KATEX_CSS_CDN_URL}" />
    <style>${ARTICLE_CSS}</style>
    <style>${PRINT_CSS}</style>
  </head>
  <body>
    <main class="article-content">
      ${htmlFragment}
    </main>
  </body>
</html>`;
}
