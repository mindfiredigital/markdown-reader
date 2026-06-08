import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { shikiHighlighter } from '../renderer/shiki';
import { THEMES } from '@package/shared-constants';
import { escapeHtml, heading } from '@package/shared-utils';
import { MARKDOWN_LANGUAGES } from '@package/shared-constants';

export function getMarkdown(registry: Map<string, number>): Marked {
  const instance = new Marked();

  // configure marked with GFM options
  instance.use({
    gfm: true,
    breaks: false,
    renderer: {
      heading(props) {
        return heading(props, registry);
      },
    },
  });

  //configure marked to use Shikhi for code blocks
  instance.use(
    markedHighlight({
      async: true,
      async highlight(code: string, lang: string): Promise<string> {
        const language = lang || MARKDOWN_LANGUAGES.TEXT;
        if (language === MARKDOWN_LANGUAGES.MERMAID) {
          return escapeHtml(code);
        }
        const highlighter = await shikiHighlighter();
        const theme = THEMES[1];
        try {
          return highlighter.codeToHtml(code, {
            lang: language,
            theme,
            transformers: [
              {
                pre(node) {
                  return node.children[0] as any;
                },
              },
            ],
          });
        } catch {
          return escapeHtml(code);
        }
      },
    })
  );
  return instance;
}
