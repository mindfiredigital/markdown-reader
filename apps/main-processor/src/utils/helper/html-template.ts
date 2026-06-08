export function htmlTemplate(htmlBody: string, css: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${title}</title>

  <style>
${css}
  </style>
</head>

<body>
  <main class="content prose">
    ${htmlBody}
  </main>
</body>
</html>`;
}
