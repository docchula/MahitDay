import { resolve, dirname, sep as pathSep } from 'node:path';
import {
  writeFile as fsWriteFile,
  readFile as fsReadFile,
  rm as fsRm,
  mkdir,
} from 'node:fs/promises';

const DEFAULT_BASE_DIR = resolve(process.cwd(), 'uploads/');

class FileUtilsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileUtilsError';
  }
}

const ensureSafeFilePath = (filePath: string, baseDir: string): string => {
  // only allow ASCII chars (20-7E) and Thai chars (0E00-0E7F)
  const allowedChars = /^[\x20-\x7E\u0E00-\u0E7F]+$/;
  if (!allowedChars.test(filePath)) {
    throw new FileUtilsError(`Forbidden characters in file path: ${filePath}`);
  }

  const result = resolve(baseDir, filePath);
  const base = resolve(baseDir);

  // path must be file, not directory
  if (result.endsWith(pathSep)) {
    throw new FileUtilsError(`Path must be file, not directory: ${filePath}`);
  }
  // prevent file path from breaking out of base dir
  if (!result.startsWith(base + pathSep)) {
    throw new FileUtilsError(`Path breaks out of allowed directory: ${filePath}`);
  }

  return result;
};

export interface WriteFileOptions {
  checkFileName?: boolean;
  baseDir?: string;
}

export const writeFile = async (
  name: string,
  content: Parameters<typeof fsWriteFile>[1],
  options?: WriteFileOptions
): Promise<void> => {
  const checkFileName = options?.checkFileName ?? true;
  const baseDir = options?.baseDir ?? DEFAULT_BASE_DIR;

  const destination = checkFileName ? ensureSafeFilePath(name, baseDir) : resolve(baseDir, name);
  const destinationDir = dirname(destination);

  // ensure the destination directory actually exist
  await mkdir(destinationDir, {
    recursive: true,
  });

  return fsWriteFile(destination, content);
};

export interface ReadFileOptions {
  checkFileName?: boolean;
  baseDir?: string;
}

export const readFile = (name: string, options?: ReadFileOptions): Promise<Buffer> => {
  const checkFileName = options?.checkFileName ?? true;
  const baseDir = options?.baseDir ?? DEFAULT_BASE_DIR;

  const destination = checkFileName ? ensureSafeFilePath(name, baseDir) : resolve(baseDir, name);

  return fsReadFile(destination);
};

export interface DeleteFileOptions {
  checkFileName?: boolean;
  baseDir?: string;
  recursive?: boolean;
}

export const deleteFile = (name: string, options?: DeleteFileOptions): Promise<boolean> => {
  const checkFileName = options?.checkFileName ?? true;
  const baseDir = options?.baseDir ?? DEFAULT_BASE_DIR;

  const destination = checkFileName ? ensureSafeFilePath(name, baseDir) : resolve(baseDir, name);

  return fsRm(destination, {
    force: true,
    recursive: Boolean(options?.recursive),
  });
};
