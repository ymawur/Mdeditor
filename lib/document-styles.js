export const ARTICLE_CSS = `
:root {
  --text: #0f172a;
  --muted: #475569;
  --border: #cbd5e1;
  --code-bg: #f8fafc;
}

body {
  margin: 0;
  color: var(--text);
  font: 16px/1.7 Georgia, Cambria, "Times New Roman", Times, serif;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.25;
  margin-top: 1.8em;
  margin-bottom: 0.6em;
}

p, ul, ol, blockquote, pre, table {
  margin: 1em 0;
}

a {
  color: #1d4ed8;
}

blockquote {
  border-left: 4px solid var(--border);
  padding: 0.25rem 1rem;
  color: var(--muted);
  background: #f8fafc;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  background: var(--code-bg);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}

pre {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  overflow-x: auto;
}

pre code {
  background: transparent;
  padding: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

thead th {
  background: #f1f5f9;
}
`;

export const PRINT_CSS = `
@page {
  size: A4;
  margin: 18mm;
}

@media print {
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  main {
    max-width: none;
    padding: 0;
  }

  pre, blockquote {
    break-inside: avoid;
  }

  table, img {
    break-inside: avoid;
  }
}
`;
