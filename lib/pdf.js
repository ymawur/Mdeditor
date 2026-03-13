import fs from "node:fs";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const FALLBACK_CHROMIUM_PATHS = [
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/opt/google/chrome/chrome"
];

function escapePdfText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function toPlainText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function createFallbackPdfFromHtml(html) {
  const lines = toPlainText(html)
    .split("\n")
    .flatMap((line) => {
      if (line.length <= 95) {
        return [line];
      }

      const chunks = [];
      let remaining = line;

      while (remaining.length > 95) {
        chunks.push(remaining.slice(0, 95));
        remaining = remaining.slice(95);
      }

      if (remaining.length > 0) {
        chunks.push(remaining);
      }

      return chunks;
    })
    .slice(0, 65);

  const textOps = lines.map((line, index) => `1 0 0 1 50 ${790 - index * 11} Tm (${escapePdfText(line)}) Tj`).join("\n");
  const stream = `BT\n/F1 10 Tf\n${textOps}\nET`;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += object;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

export async function renderPdfFromHtml(html) {
  const runtimeExecutablePath = await chromium.executablePath;
  const executablePath =
    process.env.CHROMIUM_EXECUTABLE_PATH ??
    process.env.PUPPETEER_EXECUTABLE_PATH ??
    runtimeExecutablePath ??
    FALLBACK_CHROMIUM_PATHS.find((path) => fs.existsSync(path));

  if (!executablePath) {
    return createFallbackPdfFromHtml(html);
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    return await page.pdf({
      format: "a4",
      printBackground: true,
      preferCSSPageSize: true
    });
  } catch {
    return createFallbackPdfFromHtml(html);
  } finally {
    await browser.close();
  }
}
