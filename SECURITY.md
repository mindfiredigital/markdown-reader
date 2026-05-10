# Security Policy

## Supported Versions

The following versions of Markdown Reader currently receive security updates.

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅        |
| < 1.0   | ❌        |

---

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

Please do NOT create a public GitHub issue for security vulnerabilities.

Instead, contact the maintainers directly with:

- Description of the issue
- Steps to reproduce
- Potential impact
- Screenshots or proof-of-concept (if applicable)

---

## Security Principles

Markdown Reader is designed with a security-first approach.

### Offline-First Architecture

- No telemetry
- No external tracking
- No remote analytics
- No hidden background requests

---

### Renderer Security

The application follows Electron security best practices:

- `contextIsolation` enabled
- `nodeIntegration` disabled
- Secure preload bridge
- Limited IPC exposure

---

### Markdown Sanitization

User-rendered Markdown content is sanitized before rendering.

Security protections include:

- Script tag removal
- Dangerous HTML filtering
- Event handler sanitization
- XSS mitigation using DOMPurify

---

### Dependency Management

Security updates are handled through:

- Regular dependency updates
- GitHub Dependabot alerts
- CI-based validation
- Locked package manager versions

---

## Third-Party Libraries

This project uses several open-source libraries, including:

- Electron
- React
- Marked
- Shiki
- KaTeX
- Mermaid

Please report vulnerabilities related to these dependencies both upstream and to this project maintainers.

---

## Best Practices for Users

When using Markdown Reader:

- Only open trusted Markdown files
- Avoid running unknown external scripts
- Keep the application updated
- Download releases only from official GitHub Releases

---

## Disclosure Policy

After a vulnerability is confirmed:

1. The issue will be investigated
2. A fix will be prepared
3. A patched release will be published
4. Public disclosure may follow after users have time to update

---

## Scope

This security policy applies to:

- Desktop application
- Renderer process
- Preload process
- IPC communication
- Markdown rendering pipeline

---

## Contact

For security concerns, please contact the project maintainers through private communication channels.

Thank you for helping keep Markdown Reader secure.
