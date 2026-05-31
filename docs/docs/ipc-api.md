---
title: IPC API
---

# IPC API

| Constant             | Direction        | Parameters               | Returns                         | Description                                        |
| -------------------- | ---------------- | ------------------------ | ------------------------------- | -------------------------------------------------- |
| `READ_FILE`          | Renderer to Main | `filePath: string`       | `Promise<string>`               | Reads a validated markdown file.                   |
| `OPEN_FILE_DIALOG`   | Renderer to Main | none                     | `Promise<string \| null>`       | Opens the native markdown picker.                  |
| `OPEN_FOLDER_DIALOG` | Renderer to Main | none                     | `Promise<string \| null>`       | Opens the native folder picker.                    |
| `READ_FOLDER`        | Renderer to Main | `folderPath: string`     | `Promise<FileType>`             | Reads a bounded markdown folder tree.              |
| `SEARCH_FOLDER`      | Renderer to Main | `folderPath`, `query`    | `Promise<FolderSearchResult[]>` | Searches markdown files in an opened folder.       |
| `WATCH_FILE`         | Renderer to Main | `filePath: string`       | `Promise<void>`                 | Starts a validated markdown file watcher.          |
| `UNWATCH_FILE`       | Renderer to Main | `filePath: string`       | `Promise<void>`                 | Stops a file watcher.                              |
| `FILE_CHANGED`       | Main to Renderer | `filePath: string`       | event                           | Notifies the renderer that a watched file changed. |
| `GET_RECENT_FILES`   | Renderer to Main | none                     | `Promise<RecentFile[]>`         | Returns existing recent files.                     |
| `ADD_RECENT_FILES`   | Renderer to Main | `filePath: string`       | `Promise<void>`                 | Adds a file to recents.                            |
| `GET_SETTINGS`       | Renderer to Main | none                     | `Promise<AppSettings>`          | Loads settings.                                    |
| `SAVE_SETTINGS`      | Renderer to Main | `Partial<AppSettings>`   | `Promise<AppSettings>`          | Validates and merges settings.                     |
| `GET_APP_VERSION`    | Renderer to Main | none                     | `Promise<string>`               | Returns `app.getVersion()`.                        |
| `EXPORT_HTML`        | Renderer to Main | `html`, `css`, `outPath` | `Promise<ExportResult>`         | Writes HTML export.                                |
| `EXPORT_PDF`         | Renderer to Main | `html`, `css`, `outPath` | `Promise<ExportResult>`         | Writes PDF export.                                 |
| `EXPORT_DOCX`        | Renderer to Main | `html`, `css`, `outPath` | `Promise<ExportResult>`         | Writes DOCX export.                                |

Most handlers throw on untrusted senders, invalid paths, disallowed extensions, or paths that escape the opened folder root.

## DOCX Export

DOCX export is currently treated as a bonus export format. Keep it covered by tests and IPC docs while it remains in the product.
