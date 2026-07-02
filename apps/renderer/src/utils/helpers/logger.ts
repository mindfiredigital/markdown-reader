export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (window.api && window.api.log) {
      window.api.log.info(message, ...args);
    } else {
      console.info(message, ...args);
    }
  },
  error: (message: string, ...args: unknown[]) => {
    if (window.api && window.api.log) {
      window.api.log.error(message, ...args);
    } else {
      console.error(message, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (window.api && window.api.log) {
      window.api.log.warn(message, ...args);
    } else {
      console.warn(message, ...args);
    }
  },
};
