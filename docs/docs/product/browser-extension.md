---
title: Browser Extension
---

# Browser Extension

The Markdown Reader browser extension lets you open and read Markdown files in Chrome with the same reader-first experience as the desktop app. It is useful when you want a lightweight reader tab inside the browser, without opening a separate desktop window.

## What it does

The extension opens a full-page Markdown Reader tab from the Chrome toolbar. From that tab, you can choose a local `.md` or `.markdown` file and read it with the shared Markdown Reader interface:

- Rendered GitHub Flavored Markdown
- Table of contents and reader layout
- Themes, zoom, and reading controls
- Recent file tracking through Chrome storage
- Local-first reading with no account or cloud upload

Because browsers protect local files more strictly than desktop apps, the extension asks you to choose a file through the browser file picker. After you choose it, the extension caches the opened content in Chrome storage so it can keep the recent-file experience usable inside Chrome.

## Why it matters

The extension gives Markdown Reader a second shell:

- Use the desktop app when you want native file associations, folder browsing, export, and operating-system integration
- Use the Chrome extension when you want a fast browser tab for reading Markdown without leaving Chrome

Both experiences share the same product code where possible, so the reading behavior stays consistent instead of becoming two separate apps.

## Enable it in Chrome

Until the extension is officially published through the Chrome Web Store, you can manually load the pre-compiled extension package directly into Google Chrome using these steps:

1. Download the extension bundle file (`markdown-reader-extension.zip`) from the latest repository releases section.
2. Unzip or extract the folder to a safe location on your computer (e.g., your Documents folder).
3. Open your Google Chrome browser and navigate to `chrome://extensions/` by typing it into the URL search bar.
4. Turn on the **Developer mode** toggle switch located in the top-right corner of the Extensions dashboard page.
5. Click the **Load unpacked** button visible in the top-left section of the dashboard page.
6. Select the extracted folder containing your extension files. This folder must contain the `manifest.json` file at its root level.
7. Click the extension jigsaw puzzle icon on the top right-hand toolbar of Chrome and pin **Markdown Reader** for easy, single-click access.

## Use it

1. Click the Markdown Reader extension icon in your browser toolbar.
2. The reader opens instantly as a standalone Chrome browser tab.
3. Choose a Markdown file from your computer using the safe web picker interface.
4. Read, search, change theme, adjust zoom, and use the table of contents just like in the desktop reader app.

## Current browser limits

The extension is intentionally browser-safe, so a few desktop-only features behave differently:

- Chrome cannot watch arbitrary local files after you choose them, so live reload is a desktop feature.
- Chrome cannot browse folders with the same native filesystem access as Electron.
- Native save dialogs and some export flows depend on platform support and may be more complete in the desktop app.

For the fullest operating-system integration, use the desktop app. For quick reading inside Chrome, use the extension.
