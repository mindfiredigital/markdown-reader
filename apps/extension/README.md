# extension

A Chrome extension that lets you render `.md` files directly in the browser. It uses the same React UI and Markdown pipeline as the desktop app, just running in a browser tab instead of an Electron window.

Works in Chrome, Edge, Brave, and other Chromium-based browsers.

---

## How it works

The extension has three parts:

**background.ts** - a service worker that runs in the background. When the user clicks the extension icon, it opens `viewer.html` in a new tab. It also receives messages from the popup and viewer pages and routes them to the right handler.

**popup.html / popup.ts** - the small UI that appears when you click the extension icon in the toolbar. It lets you open a local `.md` file and send it to the viewer.

**viewer.html / viewer.ts** - a full-page tab that renders the Markdown. It's essentially the same `Reader` component from the desktop app, adapted to run without Electron IPC. Files are loaded through the browser's File API.

---

## Structure

```text
apps/extension/
├── manifest.json         Chrome extension manifest (Manifest V3)
├── popup.html            Popup page HTML shell
├── viewer.html           Full viewer page HTML shell
├── vite.extension.config.ts  Builds all three entry points into dist/extensions/chrome/
└── src/
    ├── background.ts     Service worker — handles icon click, routes messages
    ├── types.ts          Extension-specific TypeScript types
    ├── popup/            Popup page entry
    ├── viewer/           Viewer page entry
    └── utils/
        └── helpers/      Message validation and routing
```

---

## Building

The extension is built with Vite. The output goes to `dist/extensions/chrome/` in the project root.

```bash
# from the monorepo root
pnpm build
```

Or from inside this package:

```bash
cd apps/extension
pnpm build
```

The build copies `manifest.json` and app icons into the output directory automatically.

---

## Installing locally (for development)

1. Run `pnpm build` to produce the extension bundle
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select `dist/extensions/chrome/`
5. The extension is now installed - click the icon in the toolbar to use it

---

## Installing from a release

Each GitHub Release includes an `extension-release.zip` in the assets.

1. Download and extract the ZIP somewhere permanent (the folder can't move after loading)
2. Go to `chrome://extensions` → Enable Developer mode → Load unpacked → select the extracted folder
3. Optionally pin the extension to the toolbar

Chrome may occasionally ask you to confirm keeping developer extensions enabled. That's expected for manually loaded extensions.

---

## Notes

- The extension doesn't have access to arbitrary URLs or file system paths. It only reads files that the user explicitly selects through the browser's file picker.
- It shares the `renderer` app's React components and Markdown pipeline via the `platform-adapters` package, which provides a browser-compatible implementation of the same API that the Electron preload exposes.
- Manifest V3 is used, so the background script runs as a service worker (not a persistent background page).
