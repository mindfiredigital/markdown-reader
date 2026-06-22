# Export

Markdown Reader can export rendered Markdown into shareable formats.

## Export to HTML

HTML export creates a self-contained `.html` file.

Expected behavior:

- inline the active styles
- preserve typography and theme
- embed local images where possible
- keep code highlighting visible
- preserve rendered math and diagrams

## Export to PDF

PDF export uses browser-quality rendering so the exported file looks close to the reader view.

Expected behavior:

- preserve page layout and theme
- keep images, code blocks, Mermaid diagrams, and KaTeX math readable
- create a PDF suitable for sharing, printing, or archiving

## Export to DOCX

DOCX export creates an editable Word-compatible document from the rendered Markdown.

Expected behavior:

- keep document structure readable in Word-compatible editors
- preserve headings, paragraphs, tables, lists, and images where possible
- create a file that can be edited after export

## Recommended workflow

Use HTML export when you want a portable web document. Use PDF export when you need a fixed document for review, printing, or sharing outside the development team. Use DOCX export when the next person needs to edit the document.
