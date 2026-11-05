import { DATABASE_NAME, migrateDbIfNeeded } from '@/db';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reader/[id]" options={{ title: 'Reader' }} />
      </Stack>
    </SQLiteProvider>
  );
}
