import { listBooks } from '@/db';
import { runDatabaseSmokeTest } from '@/db/devCheck';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const db = useSQLiteContext();
  const [bookCount, setBookCount] = useState<number | null>(null);

  const handleDatabaseSmokeTest = async () => {
    try {
      await runDatabaseSmokeTest(db);
    } catch (error) {
      console.error('[db smoke] failed', error);
    }
  };

  const handleLogBookCount = async () => {
    try {
      const books = await listBooks(db);
      setBookCount(books.length);
      console.log('[db] book count', books.length, books);
    } catch (error) {
      console.error('[db] book count failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Account and sync settings will live here.</Text>
      {__DEV__ ? (
        <>
          <Text style={styles.debug}>Books in DB: {bookCount ?? '—'}</Text>
          <Button title="Log book count" onPress={handleLogBookCount} />
          <Button title="Run DB smoke test" onPress={handleDatabaseSmokeTest} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 16,
  },
  debug: {
    color: '#6b7280',
    fontSize: 14,
  },
});
