import { runDatabaseSmokeTest } from '@/db/devCheck';
import { useSQLiteContext } from 'expo-sqlite';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const db = useSQLiteContext();

  const handleDatabaseSmokeTest = async () => {
    try {
      await runDatabaseSmokeTest(db);
    } catch (error) {
      console.error('[db smoke] failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Account and sync settings will live here.</Text>
      {__DEV__ ? <Button title="Run DB smoke test" onPress={handleDatabaseSmokeTest} /> : null}
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
});
