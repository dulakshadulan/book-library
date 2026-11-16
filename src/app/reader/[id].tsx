import { PdfViewer } from '@/features/reader/PdfViewer';
import { useReader } from '@/features/reader/useReader';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { PdfError } from 'react-native-pdf';

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { book, loading, notFound, handleLoadComplete, handlePageChanged } = useReader(id);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handlePdfError = useCallback((error: PdfError) => {
    console.error('[reader] pdf error', error);
    setPdfError(error.message || 'Could not open this PDF.');
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: book?.title ?? 'Reader' }} />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#355070" size="large" />
        </View>
      ) : notFound || book === null ? (
        <View style={styles.centered}>
          <Text style={styles.notFound}>Book not found</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {pdfError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{pdfError}</Text>
            </View>
          ) : null}
          <PdfViewer
            fileUri={book.fileUri}
            initialPage={book.lastPage}
            onPageChanged={handlePageChanged}
            onLoadComplete={handleLoadComplete}
            onError={handlePdfError}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e7eb',
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  notFound: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderBottomColor: '#fecaca',
    borderBottomWidth: 1,
    padding: 12,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    textAlign: 'center',
  },
});
