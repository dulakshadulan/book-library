import { Directory, File, Paths } from 'expo-file-system';

const BOOKS_DIRECTORY_NAME = 'books';

function getBooksDirectory(): Directory {
  const directory = new Directory(Paths.document, BOOKS_DIRECTORY_NAME);

  if (!directory.exists) {
    directory.create({ idempotent: true, intermediates: true });
  }

  return directory;
}

function extensionFromUri(uri: string): string {
  const path = uri.split('?')[0];
  const filename = path.split('/').pop() ?? '';
  const dotIndex = filename.lastIndexOf('.');

  if (dotIndex < 0) {
    return '.pdf';
  }

  const extension = filename.slice(dotIndex).toLowerCase();
  return /^\.[a-z0-9]+$/.test(extension) ? extension : '.pdf';
}

export async function copyIntoBooksDir(sourceUri: string): Promise<string> {
  const booksDirectory = getBooksDirectory();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extensionFromUri(sourceUri)}`;
  const destination = new File(booksDirectory, filename);

  await new File(sourceUri).copy(destination);

  return destination.uri;
}

export function deleteBookFile(uri: string): void {
  try {
    const file = new File(uri);

    if (file.exists) {
      file.delete();
    }
  } catch {
    // The file is already gone or cannot be accessed; nothing to clean up.
  }
}
