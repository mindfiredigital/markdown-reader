# Markdown Reader

A native desktop applicaion for reading Markdown files, built entirely on the JavaScript/TypeScript ecosystem using Electron as the desktop runtime.

markdown-reader is to Markdown what Adobe Acrobat Reader is to PDF:
a dedicated, native, first-class desktop viewer for .md files.

## Table of Contents

- [Why Markdown Reader?](#why-markdown-reader)

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
