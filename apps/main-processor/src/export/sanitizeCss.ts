import { EXPORT_CONST } from '../utils/constants/export-constants';

export function sanitizeCss(css: string): string {
  const sanitized = EXPORT_CONST.DANGEROUS_CSS_PATTERNS.reduce(
    (safeCss, pattern) => safeCss.replace(pattern, ''),
    css
  );
  return sanitized;
}
