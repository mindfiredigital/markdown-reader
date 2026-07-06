import type { TokenizerAndRendererExtension } from 'marked';
import { EMOJI_MAP } from '../constants/style-constants';

export const emojiExtension: TokenizerAndRendererExtension = {
  name: 'emoji',
  level: 'inline',
  start(src: string) {
    return src.match(/:/)?.index;
  },
  tokenizer(src: string) {
    const rule = /^:([a-zA-Z0-9_-]+):/;
    const match = rule.exec(src);
    if (match && match[1]) {
      const shortcode = match[1];
      if (EMOJI_MAP[shortcode]) {
        return {
          type: 'emoji',
          raw: match[0],
          emoji: EMOJI_MAP[shortcode],
        };
      }
    }
    return undefined;
  },
  renderer(token: any) {
    return token.emoji;
  },
};
