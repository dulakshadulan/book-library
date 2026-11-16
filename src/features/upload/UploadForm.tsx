import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import type { UploadStatus } from './useUploadBook';

interface UploadFormProps {
  status: UploadStatus;
  pickedFileName: string | null;
  title: string;
  author: string;
  error: string | null;
  confirmation: string | null;
  onPickFile: () => void;
  onTitleChange: (title: string) => void;
  onAuthorChange: (author: string) => void;
  onSave: () => void;
}

export function UploadForm({
  status,
  pickedFileName,
  title,
  author,
  error,
  confirmation,
  onPickFile,
  onTitleChange,
  onAuthorChange,
  onSave,
}: UploadFormProps) {
  const isPicking = status === 'picking';
  const isSaving = status === 'saving';
  const canSave = Boolean(pickedFileName && title.trim()) && !isPicking && !isSaving;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a PDF</Text>
      <Text style={styles.subtitle}>Choose a PDF from your device to add it to your library.</Text>

      <Button
        title={isPicking ? 'Choosing...' : pickedFileName ? 'Choose Another PDF' : 'Choose PDF'}
        onPress={onPickFile}
        disabled={isPicking || isSaving}
      />

      {pickedFileName ? <Text style={styles.filename}>{pickedFileName}</Text> : null}

      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={onTitleChange}
          placeholder="Book title"
          editable={!isSaving}
          autoCapitalize="sentences"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Author</Text>
        <TextInput
          style={styles.input}
          value={author}
          onChangeText={onAuthorChange}
          placeholder="Optional"
          editable={!isSaving}
          autoCapitalize="words"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {confirmation ? <Text style={styles.confirmation}>{confirmation}</Text> : null}

      <Button
        title={isSaving ? 'Saving...' : 'Save'}
        onPress={onSave}
        disabled={!canSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
  filename: {
    color: '#374151',
    fontSize: 14,
    textAlign: 'center',
  },
  field: {
    gap: 6,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  confirmation: {
    color: '#15803d',
    fontSize: 14,
    textAlign: 'center',
  },
});
