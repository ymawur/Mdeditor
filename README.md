# Markdown Exporter MVP (Next.js + Vercel)

A production-minded MVP for writing Markdown, previewing rendered output live, and exporting to standalone HTML or PDF with math support.

## Features

- Split editor + preview UI
- Markdown pipeline based on unified/remark/rehype
- GFM support (tables, task lists, etc.)
- Inline and block math via KaTeX
- Export standalone HTML
- Export PDF server-side with Puppeteer + Vercel-compatible Chromium
- Shared compile/render pipeline across preview, HTML export, and PDF export

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Route Handlers (`app/api/*`)
- `unified` + `remark-*` + `rehype-*`
- `puppeteer-core` + `chrome-aws-lambda`

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open http://localhost:3000.

## Build for production

```bash
npm run build
npm run start
```

## API routes

- `POST /api/export-html`
  - Body: `{ "markdown": "# Hello" }`
  - Returns downloadable `text/html`
- `POST /api/export-pdf`
  - Body: `{ "markdown": "# Hello" }`
  - Returns downloadable `application/pdf`

## Vercel deployment notes

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Framework preset: **Next.js**.
4. No extra server required; Route Handlers run as serverless functions.
5. PDF generation uses `chrome-aws-lambda` + `puppeteer-core`, which is compatible with Vercel serverless constraints.

If you need higher PDF throughput, consider moving PDF rendering to a dedicated queue/worker in a future iteration.

## Project structure

- `app/page.tsx` – page entry
- `components/Editor.tsx` – editor UI + actions
- `components/Preview.tsx` – HTML preview component
- `app/api/export-html/route.ts` – HTML export route
- `app/api/export-pdf/route.ts` – PDF export route
- `lib/compile-markdown.ts` – shared Markdown->HTML fragment compiler
- `lib/build-document.ts` – wraps HTML fragment into standalone document
- `lib/pdf.ts` – server-side PDF rendering
- `styles/article.css` – article styling
- `styles/print.css` – print-specific styling

