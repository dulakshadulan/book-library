import { getBook, type Book } from '@/db';
import { errorMessage } from '@/lib/errors';
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLoading(true);
      setError(null);

      try {
        const loadedBook = await getBook(db, id);

        if (active) {
          setBook(loadedBook);
        }
      } catch (loadError) {
        console.error('[reader] failed to load book', loadError);

        if (active) {
          setError(errorMessage(loadError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBook();

    return () => {
      active = false;
    };
  }, [db, id]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#355070" size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <Text style={styles.title}>{book?.title ?? 'Book not found'}</Text>
          <Text style={styles.subtitle}>Book ID: {id}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  error: {
    color: '#dc2626',
    fontSize: 15,
    textAlign: 'center',
  },
});
