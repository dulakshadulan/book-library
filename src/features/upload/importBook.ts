import type { Book } from '@/db';
import { addBook } from '@/db';
import { copyIntoBooksDir, deleteBookFile } from '@/lib/files';
import type { SQLiteDatabase } from 'expo-sqlite';

export interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string;
}

export interface ImportBookInput {
  pickedFile: PickedFile;
  title: string;
  author: string;
}

export async function importBook(db: SQLiteDatabase, input: ImportBookInput): Promise<Book> {
  const title = input.title.trim();

  if (!title) {
    throw new Error('A title is required.');
  }

  const storedUri = await copyIntoBooksDir(input.pickedFile.uri);

  try {
    return await addBook(db, {
      title,
      author: input.author.trim(),
      fileUri: storedUri,
      fileType: 'pdf',
    });
  } catch (error) {
    deleteBookFile(storedUri);
    throw error;
  }
}
