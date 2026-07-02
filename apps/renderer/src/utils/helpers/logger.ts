import { normalizeArgs } from './normalize-args';

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    const normalized = normalizeArgs(args);
    if (window.api && window.api.log) {
      window.api.log.info(message, ...normalized);
    } else {
      console.info(message, ...normalized);
    }
  },
  error: (message: string, ...args: unknown[]) => {
    const normalized = normalizeArgs(args);
    if (window.api && window.api.log) {
      window.api.log.error(message, ...normalized);
    } else {
      console.error(message, ...normalized);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    const normalized = normalizeArgs(args);
    if (window.api && window.api.log) {
      window.api.log.warn(message, ...normalized);
    } else {
      console.warn(message, ...normalized);
    }
  },
};
