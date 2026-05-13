import { htmlTemplate } from '../utils/helper/html-template';
import { EXPORT_CONST } from '../utils/constants/export-constants';

export function buildDocument(htmlBody: string, css: string): string {
  return htmlTemplate(htmlBody, css, EXPORT_CONST.EXPORT_HTML_TITLE);
}
