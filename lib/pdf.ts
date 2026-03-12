import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export async function renderPdfFromHtml(html: string): Promise<Uint8Array> {
  const executablePath = await chromium.executablePath;

  if (!executablePath) {
    throw new Error(
      "Chromium executable path is unavailable. For local development, run in a Linux environment similar to Vercel or provide a compatible Chromium path."
    );
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

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true
    });

    return new Uint8Array(pdf);
  } finally {
    await browser.close();
  }
}
