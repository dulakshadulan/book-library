import type { Book } from '@/db';
import { listBooks } from '@/db';
import { errorMessage } from '@/lib/errors';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';

const LOAD_ERROR_MESSAGE = 'Could not load your library.';

export interface UseBooksResult {
  books: Book[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useBooks(): UseBooksResult {
  const db = useSQLiteContext();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const latestRequest = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;

    setLoading(true);
    setError(null);

    try {
      const loadedBooks = await listBooks(db);

      if (latestRequest.current === requestId) {
        setBooks(loadedBooks);
      }
    } catch (loadError) {
      console.error('[library] failed to load books', loadError);

      if (latestRequest.current === requestId) {
        setError(__DEV__ ? errorMessage(loadError) : LOAD_ERROR_MESSAGE);
      }
    } finally {
      if (latestRequest.current === requestId) {
        setLoading(false);
      }
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  return { books, loading, error, refresh };
}
