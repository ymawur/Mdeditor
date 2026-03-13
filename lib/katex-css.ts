import fs from "node:fs";
import path from "node:path";

let cachedKatexCss: string | null = null;

export function getKatexCss(): string {
  if (cachedKatexCss) {
    return cachedKatexCss;
  }

  const resolvedKatexPath = require.resolve("katex/dist/katex.min.css");
  const katexPath =
    typeof resolvedKatexPath === "string"
      ? resolvedKatexPath
      : path.join(process.cwd(), "node_modules", "katex", "dist", "katex.min.css");

  cachedKatexCss = fs.readFileSync(katexPath, "utf8");
  return cachedKatexCss;
}
