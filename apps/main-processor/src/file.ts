import { readFile as fsReadFile } from 'node:fs/promises';
import chokidar, { type FSWatcher } from 'chokidar';
import { WatchFileOptions } from './types/watch-file-types';

//file read logic
export async function readFile(filePath: string): Promise<string> {
  try {
    const content = await fsReadFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(`Could not read file: ${filePath}`, { cause: error });
  }
}

const currentWatchers = new Map<string, FSWatcher>();
const debounceTimers = new Map<string, NodeJS.Timeout>();
//file watching logic
export async function watchFile(
  filePath: string,
  options: WatchFileOptions | (() => void)
): Promise<void> {
  const { onChange, onDeleted, onError } =
    typeof options === 'function' ? { onChange: options } : options;

  if (currentWatchers.has(filePath)) {
    await unWatchFile(filePath);
  }

  const watcher = chokidar.watch(filePath, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 50,
    },
  });
  await new Promise<void>((resolve) => {
    watcher.on('ready', resolve);
  });
  watcher.on('change', () => {
    const existingTimer = debounceTimers.get(filePath);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      if (!currentWatchers.has(filePath)) {
        debounceTimers.delete(filePath);
        return;
      }
      debounceTimers.delete(filePath);
      onChange();
    }, 100);
    debounceTimers.set(filePath, timer);
  });
  watcher.on('unlink', () => {
    void unWatchFile(filePath).then(() => onDeleted?.());
  });
  watcher.on('error', (error) => {
    const watcherError = error instanceof Error ? error : new Error(String(error));
    void unWatchFile(filePath).then(() => onError?.(watcherError));
  });
  currentWatchers.set(filePath, watcher);
}

//unwatch file
export async function unWatchFile(filePath: string): Promise<void> {
  const timer = debounceTimers.get(filePath);
  if (timer) {
    clearTimeout(timer);
    debounceTimers.delete(filePath);
  }
  if (!currentWatchers.has(filePath)) return;
  await currentWatchers.get(filePath)!.close();
  currentWatchers.delete(filePath);
}

export function getWatcherDiagnostics(): { watchers: number; debounceTimers: number } {
  return {
    watchers: currentWatchers.size,
    debounceTimers: debounceTimers.size,
  };
}
