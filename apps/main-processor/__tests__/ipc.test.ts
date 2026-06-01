import { describe, it, expect, vi } from 'vitest';
import { realpath, stat } from 'node:fs/promises';
import { validatePath, validateSender } from '../src/utils/constants/ipc-validation';
import { resolveMarkdownFilePath } from '../src/utils/helper/ipc-path-resolver';

vi.mock('node:fs/promises', () => ({
  realpath: vi.fn(),
  stat: vi.fn(),
}));

// Mocking the ipc validation module
vi.mock('../src/utils/constants/ipc-validation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/utils/constants/ipc-validation')>();
  return {
    ...actual,
    validatePath: vi.fn(actual.validatePath),
  };
});

// mocking the url
function mockEvent(url: string) {
  return {
    senderFrame: { url },
  } as any;
}

describe('ipc - validation test', () => {
  // test 1:- to check blocked urls
  it('block unknow urls', () => {
    const event = mockEvent('http://hiii.com');
    expect(validateSender(event)).toBe(false);
  });

  //test 2:- to check empty urls
  it('return false when url is empty', () => {
    const event = mockEvent('');
    expect(validateSender(event)).toBe(false);
  });

  //test 3:- to check correct file path
  it('returns true for a valid file path string', () => {
    expect(validatePath('C:\\Users\\file.md')).toBe(true);
  });

  //test 4:- to check successful markdown resolution
  it('resolves and returns the path for valid markdown files', async () => {
    const fakeInput = '/docs/readme.md';
    vi.mocked(realpath).mockResolvedValue(fakeInput);
    vi.mocked(stat).mockResolvedValue({ isFile: () => true } as any);
    const result = await resolveMarkdownFilePath(fakeInput);
    expect(result).toBe(fakeInput);
  });

  //test 5:- to check directory traversal security
  it('throws an error if file escapes the allowed root directory', async () => {
    const maliciousPath = '/etc/passwd.md';
    const allowedRoot = '/app/user/docs';
    vi.mocked(validatePath).mockReturnValue(true);
    vi.mocked(realpath).mockResolvedValueOnce(maliciousPath).mockResolvedValueOnce(allowedRoot);
    vi.mocked(stat).mockResolvedValue({ isFile: () => true } as any);
    await expect(resolveMarkdownFilePath('../../etc/passwd.md', allowedRoot)).rejects.toThrow(
      'Path escapes allowed directory'
    );
  });
});
