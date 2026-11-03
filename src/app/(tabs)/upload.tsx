import { StyleSheet, Text, View } from 'react-native';

export default function UploadScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload</Text>
      <Text style={styles.subtitle}>PDF upload will live here.</Text>
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
