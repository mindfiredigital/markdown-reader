# Markdown Reader

A native desktop application for reading Markdown files, built entirely on the JavaScript/TypeScript ecosystem using Electron as the desktop runtime.

markdown-reader is to Markdown what Adobe Acrobat Reader is to PDF:
a dedicated, native, first-class desktop viewer for .md files.

## Table of Contents

- [Why Markdown Reader?](#why-markdown-reader)
- [Features](#features)
- [Supported Markdown Features](#supported-markdown-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Available Scripts](#available-scripts)
- [Install the Chrome Extension from ZIP](#install-the-chrome-extension-from-zip)
- [Release Workflow](#release-workflow)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Themes](#themes)
- [License](#license)

---

## Why Markdown Reader ?

### The Problem

Markdown is the most widely used plain-text writing format in the world.
Developers, writers, and teams produce millions of .md files daily.
Yet there is no dedicated desktop reader for Markdown that:

| Missing Capability                       |             Current Workaround             | Pain Level |
| :--------------------------------------- | :----------------------------------------: | ---------: |
| Opens .md files natively on double-click |   No default handler — opens as raw text   |       High |
| Renders beautifully like a document      | VS Code preview pane feels like a dev tool |     Medium |
| Has a sidebar TOC like a PDF reader      |          Manual heading scanning           |     Medium |
| Supports all Markdown features           | GitHub renders some, browsers render none  |       High |
| Works fully offline                      |        Must open a browser manually        |       High |
| Feels like a reader, not an editor       |      Every tool adds edit affordances      |     Medium |

VS Code is an editor. GitHub is a web interface. Obsidian is a note-taking vault.
None of them are just a reader — a clean, dedicated app for opening and
reading Markdown files.

### The Solution

markdown-reader is a dedicated native desktop Markdown reader:

- Double-click any .md file and it opens in markdown-reader
- Registered as the system default application for .md files on install
- Beautiful readable typography — not a developer tool aesthetic
- Full Markdown support: code, diagrams, math, tables, task lists, callouts
- Auto-generated table of contents sidebar like a PDF reader
- File watching — live reload when the file is edited externally
- Multiple built-in themes
- Fully offline — zero cloud, zero telemetry, zero accounts
- Built entirely on the JS/TS ecosystem — no Rust, no Go, no C++

## Features

- Native desktop Markdown reader
- Fully offline-first experience
- GitHub Flavored Markdown (GFM) support
- Live file watching & auto reload
- Multiple built-in themes
- Syntax highlighting with Shiki
- KaTeX math rendering
- Mermaid diagram support
- **Automatic Mind Map Generation** (Interactive document structure tree visualization)
- **Raw Text Toggle** (Instantly switch between rendered view and source markdown)
- **Advanced Copy Options** (Export selection or content as MD, or Plain Text)
- In-document search
- Sidebar Table of Contents
- File explorer & recent files
- Keyboard shortcuts
- Native OS integration via platform-adapters
- Cross-platform builds
- Multi-tab reading
- Export to HTML, PDF, and DOCX

---

## Supported Markdown Features

- Headings (H1–H6)
- Ordered & unordered lists
- Task lists
- Blockquotes
- Tables
- Horizontal rules
- Inline code
- Fenced code blocks
- Images
- Links
- Footnotes
- Inline HTML
- Mermaid diagrams
- KaTeX math
- **Interactive Mind Maps** (Auto-generated from document markdown structure)

---

## Tech Stack

| Layer               | Technology    |
| ------------------- | ------------- |
| Desktop runtime     | Electron      |
| Frontend            | React         |
| Language            | TypeScript    |
| Build tool          | electron-vite |
| Styling             | Tailwind CSS  |
| Markdown parser     | Marked        |
| Syntax highlighting | Shiki         |
| Math rendering      | KaTeX         |
| Diagram rendering   | Mermaid       |
| Mind Map engine     | Markmap       |
| Testing             | Vitest        |
| Package manager     | pnpm          |

---

## Project Structure

```
markdown-reader/
├── apps/
│   ├── main-processor/
│   ├── preload/
│   └── renderer/
│
├── packages/
│   ├── shared-constants/
│   └── shared-types/
│
├── assets/
├── release/
└── .github/
```

---

## Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/mindfiredigital/markdown-reader
cd markdown-reader
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build all packages

go inside each package and build

```bash
pnpm build
```

### 4. Start Development Server

```bash
pnpm dev
```

## Available Scripts

### Development

```bash
pnpm dev
```

Starts Electron + Vite development environment.

### Production Build

```bash
pnpm build
```

Builds Electron main, preload, and renderer processes.

### Run Tests

```bash
pnpm test
```

### Run Coverage

```bash
pnpm test:coverage
```

### Run Lint

```bash
pnpm lint
```

### Run Typecheck

```bash
pnpm typecheck
```

---

## Install the Chrome Extension from ZIP

The Chrome extension can be installed manually from a ZIP file attached to each GitHub Release.

### Steps

1. Go to the [Releases page](https://github.com/mindfiredigital/markdown-reader/releases) for this repository.
2. Open the latest release and download `extension-release.zip` from the release assets.
3. Extract or unzip the downloaded file somewhere permanent on your computer.

   Choose a location you will keep, such as `Documents/Markdown Reader Extension`. Chrome loads unpacked extensions from that folder, so do not delete or move it after installation.

4. Open Google Chrome, or another Chromium browser such as Brave, Microsoft Edge, or Opera.
5. Navigate to:

   ```text
   chrome://extensions/
   ```

6. Enable **Developer mode** using the toggle in the top-right corner.
7. Click **Load unpacked** in the top-left corner.
8. Select the folder where you extracted the ZIP file.

   Make sure you select the folder that contains `manifest.json`.

9. Optional: pin **Markdown Reader** to your browser toolbar for quick access.

After installation, click the extension icon to open Markdown Reader in a browser tab.

### Developer-mode note

Because this is a manual unpacked extension install, Chrome may occasionally ask you to confirm that you want to keep developer extensions enabled. That is normal for extensions loaded outside the Chrome Web Store. If you downloaded the ZIP from this repository's GitHub Releases page, you can keep using it confidently.

---

## Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/mindfiredigital/markdown-reader
cd markdown-reader
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build all packages

go inside each package and build

```bash
pnpm build
```

### 4. Build extension

```bash
pnpm build:extension
```

---

## Release Workflow

This project uses GitHub Actions for CI/CD.

### CI Pipeline

Runs automatically on:

- Pull requests
- Pushes to `main` & `dev`

Checks include:

- Build
- Lint
- Typecheck
- Tests

### Release Pipeline

Production releases are created using Git tags.

**Example:**

```bash
git tag v1.0.0
git push origin v1.0.0
```

This automatically:

- Builds installers
- Creates GitHub Release
- Uploads release artifacts

### Supported Release Formats

| Platform | Format              |
| -------- | ------------------- |
| Windows  | `.exe`              |
| Linux    | `.AppImage`, `.deb` |
| macOS    | `.dmg`              |

---

## Keyboard Shortcuts

| Shortcut           | Action                        |
| ------------------ | ----------------------------- |
| `Ctrl / Cmd + O`   | Open File                     |
| `Ctrl / Cmd + F`   | Search                        |
| `Ctrl / Cmd + +`   | Zoom In                       |
| `Ctrl / Cmd + -`   | Zoom Out                      |
| `Ctrl / Cmd + 0`   | Reset Zoom                    |
| `Ctrl / Cmd + T`   | Switch Theme                  |
| `Cmd/Ctrl+Shift+O` | Open folder                   |
| `Cmd/Ctrl+W`       | Close current tab             |
| `Ctrl+ [`          | Toggle TOC sidebar            |
| `Ctrl + \`         | Backslash Toggle file browser |
| `Ctrl+Tab`         | Next tab                      |
| `Ctrl+Shift+Tab`   | Previous tab                  |

---

## Themes

- GitHub Light
- GitHub Dark
- Dracula
- Nord
- Notion
- Minimal

---

## License

ISC License

---

## Author

**Mindfire Digital**

---
