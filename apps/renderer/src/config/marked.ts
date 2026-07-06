import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { shikiHighlighter } from '../renderer/shiki';
import { escapeHtml, heading } from '../utils/helpers/heading-helper';
import { MARKDOWN_LANGUAGES } from '../utils/constants/markdown-constants';
import { DEFAULT_THEME } from '../utils/constants/theme-constants';
import markedFootnote from 'marked-footnote';
import { superscriptExtension } from '../utils/helpers/superscript-extension';
import { emojiExtension } from '../utils/helpers/emoji-extension';

let instance: Marked | null = null;
let currentRegistry: Map<string, number>;

export function getMarkdown(registry: Map<string, number>): Marked {
  currentRegistry = registry;
  if (instance) return instance;
  instance = new Marked();

  // configure marked with GFM options
  instance.use({
    gfm: true,
    breaks: false,
    renderer: {
      heading(this: any, token: any) {
        const parsedText = this.parser.parseInline(token.tokens);
        return heading({ text: parsedText, depth: token.depth, rawText: token.text }, currentRegistry);
      },
    },
  });

  instance.use(markedFootnote());
  instance.use({ extensions: [superscriptExtension, emojiExtension] });

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
        const theme = DEFAULT_THEME;
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
