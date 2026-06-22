# main-processor

This is the Electron main process. It runs in Node.js, handles everything that needs native OS access, and communicates with the renderer through IPC.

---

## What it does

- Creates and manages the `BrowserWindow`
- Registers all IPC handlers so the renderer can request file reads, exports, settings, etc.
- Watches files with `chokidar` and notifies the renderer when they change
- Handles files opened via CLI arguments or OS double-click
- Builds the native application menu
- Manages recent files list
- Handles export to PDF, HTML, and DOCX
- Runs the auto-updater

---

## Structure

```
src/
├── index.ts             Entry point - creates the window and registers everything
├── ipc.ts               All IPC handler registrations
├── file.ts              Read file, watch/unwatch with chokidar
├── folder.ts            Read a directory tree for the file browser
├── folder-search.ts     Search inside a folder for Markdown files matching a query
├── menu.ts              Native application menu definition
├── register-menu.ts     Registers the menu with Electron
├── cli.ts               Parses a file path from process.argv (CLI / double-click)
├── updater.ts           Sets up electron-updater
├── export/
│   ├── exportHtml.ts    Export rendered HTML to a .html file
│   ├── exportPdf.ts     Export to PDF using Electron's printToPDF
│   └── exportDocx.ts    Export to DOCX using html-to-docx
├── recent/
│   ├── getRecentFile.ts Read the recent files list from disk
│   └── addRecentFile.ts Add a file to the recent list
├── settings/
│   ├── get-settings.ts  Load app settings from disk
│   └── save-settings.ts Persist settings to disk
└── utils/
    ├── constants/       Path constants, IPC validation rules, window size constants
    └── helper/          Path resolution and sanitization helpers
```

---

## IPC handlers

All handlers validate the sender before doing anything. The full list is in `ipc.ts`, but here's a summary:

| Channel              | What it does                                  |
| -------------------- | --------------------------------------------- |
| `read-file`          | Reads a Markdown file and returns its content |
| `open-file-dialog`   | Opens the OS file picker                      |
| `open-folder-dialog` | Opens the OS folder picker                    |
| `read-folder`        | Returns a directory tree                      |
| `watch-file`         | Starts watching a file for changes            |
| `unwatch-file`       | Stops watching a file                         |
| `get-recent-files`   | Returns the recent files list                 |
| `add-recent-file`    | Adds a file to the recent list                |
| `get-settings`       | Returns saved app settings                    |
| `save-settings`      | Persists app settings                         |
| `get-app-version`    | Returns the current app version               |
| `show-save-dialog`   | Opens the OS save dialog                      |
| `export-html`        | Writes an HTML file to disk                   |
| `export-pdf`         | Writes a PDF file to disk                     |
| `export-docx`        | Writes a DOCX file to disk                    |
| `search-folder`      | Searches Markdown files in a directory        |
| `download-update`    | Triggers the auto-updater download            |

---

## Security

All file paths go through `resolveMarkdownFilePath` or `resolveDirectoryPath` before use. These helpers resolve and normalize paths and reject anything that looks like a traversal attempt. The `allowedMarkdownFiles` and `allowedFolderRoots` sets track which paths the user has explicitly opened so the renderer can't request arbitrary files.

---

## Running tests

```bash
cd apps/main-processor
pnpm test
```
