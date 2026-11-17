import { listBooks, type Book } from '@/db';
import { errorMessage } from '@/lib/errors';
import { Canvas, Image as SkiaImage, useImage } from '@shopify/react-native-skia';
import { router, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import PdfThumbnail, { type ThumbnailResult } from 'react-native-pdf-thumbnail';

const PAGE_OPTIONS = {
  maxHeight: 3200,
  maxWidth: 2400,
  quality: 100,
};

export default function SpikePdfScreen() {
  const db = useSQLiteContext();
  const { width: screenWidth } = useWindowDimensions();
  const [book, setBook] = useState<Book | null>(null);
  const [thumbnail, setThumbnail] = useState<ThumbnailResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const skiaImage = useImage(thumbnail?.uri ?? null);

  useEffect(() => {
    let active = true;

    const generateFirstPage = async () => {
      try {
        const books = await listBooks(db);
        const firstBook = books[0] ?? null;

        if (!active) {
          return;
        }

        setBook(firstBook);

        if (firstBook === null) {
          return;
        }

        const result = await PdfThumbnail.generate(firstBook.fileUri, 0, PAGE_OPTIONS);

        if (active) {
          setThumbnail(result);
        }
      } catch (caught) {
        if (active) {
          setError(errorMessage(caught));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void generateFirstPage();

    return () => {
      active = false;
    };
  }, [db]);

  const cardWidth = Math.min(240, Math.floor((screenWidth - 48) / 2));
  const imageHeight =
    thumbnail === null ? 0 : Math.round(cardWidth * (thumbnail.height / thumbnail.width));

  return (
    <>
      <Stack.Screen options={{ title: 'PDF Image Spike' }} />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#355070" size="large" />
            <Text style={styles.muted}>Rendering the first PDF page...</Text>
          </View>
        ) : error !== null ? (
          <View style={styles.centered}>
            <Text style={styles.errorTitle}>Could not render page</Text>
            <Text style={styles.muted}>{error}</Text>
          </View>
        ) : book === null ? (
          <View style={styles.centered}>
            <Text style={styles.errorTitle}>No books in the library</Text>
            <Text style={styles.muted}>Upload a PDF, then reopen this spike.</Text>
          </View>
        ) : thumbnail === null ? null : (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.muted}>
              Page 1 · {thumbnail.width} × {thumbnail.height} px · quality 100
            </Text>
            <View style={styles.row}>
              <View style={[styles.card, { width: cardWidth }]}>
                <Text style={styles.label}>React Native Image</Text>
                <Image
                  resizeMode="contain"
                  source={{ uri: thumbnail.uri }}
                  style={[styles.image, { height: imageHeight, width: cardWidth }]}
                />
              </View>
              <View style={[styles.card, { width: cardWidth }]}>
                <Text style={styles.label}>Skia Image</Text>
                {skiaImage === null ? (
                  <View style={[styles.skiaLoading, { height: imageHeight, width: cardWidth }]}>
                    <ActivityIndicator color="#355070" />
                  </View>
                ) : (
                  <Canvas style={{ height: imageHeight, width: cardWidth }}>
                    <SkiaImage
                      fit="contain"
                      height={imageHeight}
                      image={skiaImage}
                      width={cardWidth}
                      x={0}
                      y={0}
                    />
                  </Canvas>
                )}
              </View>
            </View>
            <Text style={styles.muted}>
              Generated image: {thumbnail.width} × {thumbnail.height} px
            </Text>
            <Text numberOfLines={1} style={styles.uri}>
              {thumbnail.uri}
            </Text>
          </ScrollView>
        )}
        <View style={styles.footer}>
          <Button title="Back" onPress={() => router.back()} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bookTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    gap: 8,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#e5e7eb',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  errorTitle: {
    color: '#b91c1c',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 16,
  },
  image: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderWidth: 1,
  },
  label: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  muted: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  skiaLoading: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderWidth: 1,
    justifyContent: 'center',
  },
  uri: {
    color: '#9ca3af',
    fontSize: 11,
    maxWidth: '100%',
    textAlign: 'center',
  },
});
