export type WatchFileOptions = {
  onChange: () => void;
  onDeleted?: () => void;
  onError?: (error: Error) => void;
};
