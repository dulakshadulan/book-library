import { Pressable, StyleSheet, Text, View } from 'react-native';

interface EmptyLibraryProps {
  onUpload: () => void;
}

export function EmptyLibrary({ onUpload }: EmptyLibraryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mark}>
        <Text style={styles.markText}>+</Text>
      </View>
      <Text style={styles.title}>Your library is empty</Text>
      <Text style={styles.subtitle}>
        Upload a PDF to start building your personal collection.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onUpload}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Upload a PDF</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: '#e8eef5',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  markText: {
    color: '#355070',
    fontSize: 32,
    fontWeight: '600',
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 280,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#355070',
    borderRadius: 999,
    marginTop: 4,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
