import { File, Paths } from 'expo-file-system';

import { copyIntoBooksDir, deleteBookFile } from './files';

export async function runFileSystemSmokeTest(): Promise<string> {
  const marker = `file-system-smoke-${Date.now()}`;
  const source = new File(Paths.cache, `${marker}.txt`);
  await source.write(marker);

  let copiedUri: string | null = null;

  try {
    copiedUri = await copyIntoBooksDir(source.uri);

    const copied = new File(copiedUri);
    const readBack = copied.textSync();

    if (readBack !== marker) {
      throw new Error('The copied file contents did not match the source.');
    }

    return copiedUri;
  } finally {
    try {
      if (source.exists) {
        source.delete();
      }
    } catch {}

    if (copiedUri) {
      deleteBookFile(copiedUri);
    }
  }
}
