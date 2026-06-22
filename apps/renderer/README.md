# renderer

This is the React application that makes up the entire UI of Markdown Reader. It runs inside the Electron `BrowserWindow` and handles everything the user sees and interacts with.

---

## What it does

The renderer is responsible for:

- Rendering parsed Markdown as HTML (via `marked`, Shiki, KaTeX, Mermaid)
- Managing tabs, themes, search, TOC, file browser, and settings
- Talking to the main process through the preload bridge (`window.markdownReaderAPI`)
- Watching for file changes and live-reloading the current tab
- Handling drag-and-drop file opens

It has no direct access to Node.js or the file system. All file operations go through IPC calls to the main process.

---

## Structure

```
src/
├── App.tsx              Root component - wires together all hooks and panels
├── components/          UI components (Reader, Sidebar, TabBar, SearchBar, etc.)
├── hooks/               Custom hooks for each feature area
├── renderer/            Markdown pipeline (markdown.ts, shiki.ts, katex.ts, mermaid.ts, toc.ts)
├── store/               Tab state management
├── context/             React context providers
├── config/              App-level configuration
├── styles/              Global styles and theme tokens
├── types/               Local TypeScript types
└── utils/               Small helper functions and constants
```

The `renderer/` subfolder is the Markdown processing pipeline, separate from React components. Each file handles one concern - syntax highlighting, math, diagrams, TOC extraction, etc.

---

## Key hooks

| Hook                 | What it manages                                 |
| -------------------- | ----------------------------------------------- |
| `useFile`            | Opening and reading files, loading state        |
| `useTabStore`        | Tab open/close/switch logic                     |
| `useTheme`           | Active theme and switching                      |
| `useSearch`          | In-document search with match highlighting      |
| `useToc`             | TOC active heading tracking while scrolling     |
| `useSettings`        | Font size, theme persistence via IPC            |
| `useExport`          | Triggers PDF / HTML / DOCX export via IPC       |
| `useDragDrop`        | Drag-and-drop file handling                     |
| `useShortcuts`       | Keyboard shortcut bindings                      |
| `useMenuEvents`      | Listening to menu events from the main process  |
| `useOpenFilePath`    | Handles files passed via CLI or OS double-click |
| `useFilePersistence` | Restores scroll position when reopening files   |

---

## Running

From the root of the monorepo:

```bash
pnpm dev
```

The renderer is loaded automatically by the Electron main process. It uses Vite for HMR during development.

To run tests for this package:

```bash
cd apps/renderer
pnpm test
```

---

## Notes

- The renderer uses `window.markdownReaderAPI` (exposed by the preload) for all IPC communication. If you're adding a new feature that needs file system access or native dialogs, add it to the preload bridge first.
- Themes are applied via CSS custom properties. Theme files live in `src/styles/`.
- The app also runs inside the Chrome extension (same React codebase). Platform-specific behavior is handled through `usePlatformAPI`, which returns the right API depending on whether it's running in Electron or the browser extension.
