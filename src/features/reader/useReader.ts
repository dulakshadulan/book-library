import type { Book } from '@/db';
import { getBook, updateProgress, updateTotalPages } from '@/db';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';

const PROGRESS_SAVE_DELAY_MS = 500;

export interface UseReaderResult {
  book: Book | null;
  loading: boolean;
  notFound: boolean;
  handlePageChanged: (page: number) => void;
  handleLoadComplete: (total: number) => void;
}

export function useReader(id: string): UseReaderResult {
  const db = useSQLiteContext();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const bookRef = useRef<Book | null>(null);
  const pendingPageRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushPendingPage = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const page = pendingPageRef.current;
    const currentBook = bookRef.current;
    pendingPageRef.current = null;

    if (page === null || !currentBook) {
      return;
    }

    try {
      await updateProgress(db, currentBook.id, page);
    } catch (error) {
      console.error('[reader] failed to save progress', error);
    }
  }, [db]);

  const handlePageChanged = useCallback(
    (page: number) => {
      if (!bookRef.current) {
        return;
      }

      pendingPageRef.current = page;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        void flushPendingPage();
      }, PROGRESS_SAVE_DELAY_MS);
    },
    [flushPendingPage]
  );

  const handleLoadComplete = useCallback(
    (total: number) => {
      const currentBook = bookRef.current;

      if (!currentBook || currentBook.totalPages === total) {
        return;
      }

      void (async () => {
        try {
          await updateTotalPages(db, currentBook.id, total);

          if (bookRef.current?.id !== currentBook.id) {
            return;
          }

          bookRef.current = { ...currentBook, totalPages: total };
          setBook((previous) => (previous ? { ...previous, totalPages: total } : previous));
        } catch (error) {
          console.error('[reader] failed to save total pages', error);
        }
      })();
    },
    [db]
  );

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLoading(true);
      bookRef.current = null;
      setBook(null);

      try {
        const loadedBook = await getBook(db, id);

        if (active) {
          bookRef.current = loadedBook;
          setBook(loadedBook);
        }
      } catch (loadError) {
        console.error('[reader] failed to load book', loadError);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBook();

    return () => {
      active = false;
      void flushPendingPage();
    };
  }, [db, id, flushPendingPage]);

  return {
    book,
    loading,
    notFound: !loading && book === null,
    handlePageChanged,
    handleLoadComplete,
  };
}
