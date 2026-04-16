import marked from 'marked';
import { markedHighlight } from 'marked-highlight';
import { sikhiHighlighter } from '../renderer/sikhi';

// configure marked with GFM options
marked.setOptions({
  gfm: true,
  breaks: false,
});

//configure marked to use Shikhi for code blocks
marked.use(
  markedHighlight({
    async: true,
    async highlight(code: string, lang: string): Promise<string> {
      const highlighter = await sikhiHighlighter();
      const theme = 'github-dark';
      const language = lang || 'text';
      try {
        return highlighter.codeToHtml(code, { lang: language, theme });
      } catch {
        return highlighter.codeToHtml(code, { lang: 'text', theme });
      }
    },
  })
);
