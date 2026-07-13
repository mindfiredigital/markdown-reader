export const normalizeArgs = (args: unknown[]) => {
  return args.map((arg) => {
    if (arg instanceof Error) {
      return { message: arg.message, stack: arg.stack, name: arg.name };
    }
    return arg;
  });
};
