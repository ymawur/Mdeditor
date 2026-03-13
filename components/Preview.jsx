export function Preview({ html }) {
  return (
    <article
      className="article-content"
      dangerouslySetInnerHTML={{ __html: html }}
      aria-label="Markdown preview"
    />
  );
}
