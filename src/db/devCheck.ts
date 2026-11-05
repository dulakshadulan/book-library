import type { SQLiteDatabase } from 'expo-sqlite';

import {
  addBook,
  deleteBook,
  getBook,
  listBooks,
  updateProgress,
  updateTotalPages,
} from './booksRepository';

export async function runDatabaseSmokeTest(db: SQLiteDatabase): Promise<void> {
  const book = await addBook(db, {
    title: `DB smoke test ${new Date().toISOString()}`,
    author: 'Dev',
    fileUri: 'file:///dev/null/smoke-test.pdf',
    fileType: 'pdf',
    totalPages: 10,
  });
  console.log('[db smoke] addBook', book);

  const books = await listBooks(db);
  console.log('[db smoke] listBooks', books);

  const progressUpdated = await updateProgress(db, book.id, 3);
  console.log('[db smoke] updateProgress', progressUpdated);

  const totalPagesUpdated = await updateTotalPages(db, book.id, 12);
  console.log('[db smoke] updateTotalPages', totalPagesUpdated);

  const updatedBook = await getBook(db, book.id);
  console.log('[db smoke] getBook after updates', updatedBook);

  const deleted = await deleteBook(db, book.id);
  console.log('[db smoke] deleteBook', deleted);

  const deletedBook = await getBook(db, book.id);
  console.log('[db smoke] getBook after delete', deletedBook);
}
