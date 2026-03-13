import puppeteer, { type Viewport } from "puppeteer-core";

type ChromiumAdapter = {
  args: string[];
  defaultViewport: Viewport | null;
  executablePath: Promise<string | null> | (() => Promise<string | null>);
};

const dynamicImport = new Function("modulePath", "return import(modulePath)") as (
  modulePath: string
) => Promise<{ default: ChromiumAdapter }>;

async function loadChromiumAdapter(): Promise<ChromiumAdapter> {
  try {
    const sparticuzModule = await dynamicImport("@sparticuz/chromium");
    return sparticuzModule.default;
  } catch {
    const awsLambdaModule = await dynamicImport("chrome-aws-lambda");
    return awsLambdaModule.default;
  }
}

export async function renderPdfFromHtml(html: string): Promise<Buffer> {
  const chromium = await loadChromiumAdapter();

  const runtimeExecutablePath =
    typeof chromium.executablePath === "function"
      ? await chromium.executablePath()
      : await chromium.executablePath;

  const executablePath =
    process.env.CHROMIUM_EXECUTABLE_PATH ?? process.env.PUPPETEER_EXECUTABLE_PATH ?? runtimeExecutablePath;

  if (!executablePath) {
    throw new Error(
      "Chromium executable path is unavailable. Set CHROMIUM_EXECUTABLE_PATH (or PUPPETEER_EXECUTABLE_PATH) to a compatible browser binary."
    );
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
      preferCSSPageSize: true
    });

    return pdf;
  } finally {
    await browser.close();
  }
}
