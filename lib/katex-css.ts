import fs from "node:fs";
import path from "node:path";

let cachedKatexCss: string | null = null;

const FALLBACK_KATEX_CSS = `
.katex { font: normal 1.21em KaTeX_Main, Times New Roman, serif; line-height: 1.2; white-space: nowrap; }
.katex-display { display: block; margin: 1em 0; text-align: center; }
.katex-display > .katex { display: inline-block; text-align: initial; }
.katex .base { position: relative; display: inline-block; white-space: nowrap; width: min-content; }
.katex .mord, .katex .mop, .katex .mbin, .katex .mrel, .katex .mopen, .katex .mclose, .katex .mpunct { display: inline-block; }
`;

export function getKatexCss(): string {
  if (cachedKatexCss) {
    return cachedKatexCss;
  }

  try {
    const resolvedKatexPath = require.resolve("katex/dist/katex.min.css");
    const katexPath =
      typeof resolvedKatexPath === "string"
        ? resolvedKatexPath
        : path.join(process.cwd(), "node_modules", "katex", "dist", "katex.min.css");

    cachedKatexCss = fs.readFileSync(katexPath, "utf8");
  } catch {
    cachedKatexCss = FALLBACK_KATEX_CSS;
  }

  return cachedKatexCss;
}
