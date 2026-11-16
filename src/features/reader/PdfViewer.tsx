import Pdf, { type PdfError } from 'react-native-pdf';
import { StyleSheet } from 'react-native';

interface PdfViewerProps {
  fileUri: string;
  initialPage: number;
  onPageChanged: (page: number, total: number) => void;
  onLoadComplete: (total: number) => void;
  onError: (error: PdfError) => void;
}

export function PdfViewer({
  fileUri,
  initialPage,
  onPageChanged,
  onLoadComplete,
  onError,
}: PdfViewerProps) {
  return (
    <Pdf
      source={{ uri: fileUri, cache: false }}
      page={initialPage}
      enablePaging={false}
      onLoadComplete={(total) => onLoadComplete(total)}
      onPageChanged={(page, total) => onPageChanged(page, total)}
      onError={(error) => onError(error)}
      style={styles.pdf}
    />
  );
}

const styles = StyleSheet.create({
  pdf: {
    backgroundColor: '#ffffff',
    flex: 1,
    width: '100%',
  },
});
