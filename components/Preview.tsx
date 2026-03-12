type PreviewProps = {
  html: string;
};

export function Preview({ html }: PreviewProps) {
  return (
    <article
      className="article-content"
      dangerouslySetInnerHTML={{ __html: html }}
      aria-label="Markdown preview"
    />
  );
}
