import type { TokenizerAndRendererExtension } from 'marked';

export const superscriptExtension: TokenizerAndRendererExtension = {
  name: 'superscript',
  level: 'inline',
  start(src: string) {
    return src.match(/\^/)?.index;
  },
  tokenizer(src: string) {
    const rule = /^\^([^^]+)\^/;
    const match = rule.exec(src);
    if (match && match[1]) {
      return {
        type: 'superscript',
        raw: match[0],
        tokens: this.lexer.inlineTokens(match[1]),
      };
    }
    return undefined;
  },
  renderer(token: any) {
    return `<sup>${this.parser.parseInline(token.tokens)}</sup>`;
  },
};
