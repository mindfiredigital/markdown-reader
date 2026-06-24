# preload

The preload script runs in a sandboxed context between the Electron main process and the renderer. Its only job is to expose a typed, safe API to the renderer via `contextBridge`.

---

## What it does

Electron's security model keeps the renderer isolated from Node.js by default (`contextIsolation: true`, `nodeIntegration: false`). The preload bridges that gap - it can access both the Electron IPC APIs and the renderer's `window` object.

This package exposes a single API object (`window.markdownReaderAPI`) that the renderer uses for everything: reading files, opening dialogs, watching files, exporting, listening for menu events, etc.

The renderer never calls `ipcRenderer` directly. It goes through this bridge, which keeps the surface area controlled and auditable.

---

## Structure

```text
src/
├── index.ts         Defines the API contract and calls contextBridge.exposeInMainWorld
└── utils/
    └── menu-event-helper.ts   Validates that an event name is a known menu event
```

---

## API surface

Everything exposed to the renderer is defined in `index.ts` as an `apiContract` object. The type for this object (`MarkdownReaderAPI`) lives in `@package/shared-types`.

```text
readFile(path)               → reads a file, returns content
openFileDialog()             → opens OS file picker, returns selected path
openFolderDialog()           → opens OS folder picker, returns selected path
readFolder(path)             → returns a directory tree
watchFile(path)              → starts watching a file for changes
unWatchFile(path)            → stops watching
onFileChanged(callback)      → called when a watched file changes on disk
removeFileChangedListener()  → cleans up the file-changed listener
getRecentFiles()             → returns recent files list
addRecentFile(path)          → adds to recent files
clearRecentFiles()           → clears the list
getSettings()                → loads saved settings
saveSettings(settings)       → persists settings
getAppVersion()              → returns app version string
searchFolder(path, query)    → searches Markdown files in a directory
showSaveDialog(opts)         → opens OS save dialog
exportHTML(html, css, path)  → writes an HTML export
exportPDF(html, css, path)   → writes a PDF export
exportDOCX(html, css, path)  → writes a DOCX export
onMenuEvent(event, callback) → listens for a native menu action
removeMenuListeners()        → cleans up all menu listeners
onOpenFilePath(callback)     → called when a file is opened via CLI or OS
removeOpenFilePathListener() → cleans up that listener
onUpdateAvailable(callback)  → called when a new version is available
downloadUpdate()             → triggers the auto-updater download
getPathForFile(file)         → resolves an absolute path from a File object (drag-drop)
```

---

## Notes

- This package has no UI and no tests of its own — it's just a typed bridge.
- If you add a new IPC handler in `main-processor`, add the corresponding entry here and update the `MarkdownReaderAPI` type in `@package/shared-types`.
- The `isMenuEvent` guard in `utils/menu-event-helper.ts` prevents the renderer from listening on arbitrary IPC channels.
