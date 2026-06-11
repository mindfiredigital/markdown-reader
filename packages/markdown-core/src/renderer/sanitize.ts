import DOMPurify from 'dompurify';

DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
  const attrName = data.attrName.toLowerCase();
  const attrValue = data.attrValue.trim().toLowerCase();
  if (attrName.startsWith('on') || attrValue.startsWith('javascript:')) {
    data.keepAttr = false;
  }
});

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    FORBID_TAGS: ['iframe'],
    FORBID_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });
}
