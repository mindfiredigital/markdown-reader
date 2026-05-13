export const EXPORT_CONST = {
  EXPORT_HTML_TITLE: 'Markdown Reader Export',

  EXPORT_IMAGE_SRC_REGEX: /src="(?!https?:\/\/|data:|file:\/\/)([^"]+)"/gi,

  DANGEROUS_CSS_PATTERNS: [
    /behavior\s*:/gi,
    /-moz-binding\s*:/gi,
    /expression\s*\(/gi,
    /javascript\s*:/gi,
  ],
};
