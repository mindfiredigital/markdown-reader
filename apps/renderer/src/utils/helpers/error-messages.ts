function getFileName(path: string): string {
  return path.split(/[\\/]/).pop() || path;
}

export function ErrorMessage(raw: string, path: string): string {
  const name = getFileName(path);
  const lower = raw.toLowerCase();

  if (
    lower.includes('enoent') ||
    lower.includes('no such file') ||
    lower.includes('could not read file')
  ) {
    return `File not found - "${name}" doesn't exist or has been moved.`;
  }
  if (lower.includes('eperm') || lower.includes('eacces') || lower.includes('permission denied')) {
    return `Permission denied - unable to read "${name}". Check file permissions.`;
  }
  if (lower.includes('eisdir') || lower.includes('is a directory')) {
    return `"${name}" is a folder, not a file. Please select a Markdown file.`;
  }
  if (lower.includes('emfile') || lower.includes('too many open files')) {
    return `Too many files open. Close some tabs and try again.`;
  }
  if (lower.includes('enametoolong')) {
    return `The file path is too long. Try moving the file to a shorter path.`;
  }
  if (lower.includes('untrusted') || lower.includes('unauthorized')) {
    return `This file cannot be opened for security reasons.`;
  }
  // Fallback: strip technical prefixes
  return `Unable to open "${name}". Please try a different file.`;
}
