import fs from "node:fs";
import path from "node:path";

let cachedKatexCss: string | null = null;

export function getKatexCss(): string {
  if (cachedKatexCss) {
    return cachedKatexCss;
  }

  const katexPath = require.resolve("katex/dist/katex.min.css");
  cachedKatexCss = fs.readFileSync(path.resolve(katexPath), "utf8");
  return cachedKatexCss;
}
