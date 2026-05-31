---
title: Architecture
---

# Architecture

# Architecture Overview

## 1. System Communication Flow

The application processes data across four distinct layers, moving sequentially from the user interface down to the computer operating system:

- **Renderer (React)**: The frontend user interface. It owns the UI state and triggers operations by calling a global `window.api` object.
- **Preload Bridge**: The secure intermediary layer. It exposes a strictly typed, context-isolated API to the renderer and passes messages back and forth across the process boundary.
- **Main Process IPC**: The core background application. It validates all incoming requests, checks message senders, verifies system paths, and coordinates backend actions.
- **Subsystems**: The individual specialized modules managed directly by the Main Process. These include:
  - **Local Filesystem**: Handles raw reading and writing of document files.
  - **Export Modules**: Converts and packages documents for output.
  - **File Watcher**: Monitors project directories for automated file changes and sends real-time update notifications back through the Main Process to the Renderer.

---

## 2. Step-by-Step File Open Flow

When a user opens a file, the application executes a sequential 7-step process across its operational layers:

1. **Renderer** initiates the request by invoking the `readFile(path)` function on the bridge API.
2. **Preload Bridge** translates this function call into a secure background communication token named `IPC READ_FILE` and forwards it to the main environment.
3. **Main Process** intercepts the token and instantly runs security checks to validate both the message sender and the requested filesystem path safety.
4. **Main Process** queries the **Filesystem** to read the specific markdown file text on the disk.
5. **Filesystem** reads the hard drive storage and returns the raw file content bytes back up to the **Main Process**.
6. **Main Process** forwards that document content back across the security boundary to the awaiting **Preload Bridge**.
7. **Preload Bridge** delivers the final content package directly into the **Renderer** application state to be displayed on the screen.
