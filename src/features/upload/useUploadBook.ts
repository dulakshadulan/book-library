import type { Book } from '@/db';
import { titleFromFilename } from '@/lib/format';
import * as DocumentPicker from 'expo-document-picker';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { importBook, type PickedFile } from './importBook';

export type UploadStatus = 'idle' | 'picking' | 'ready' | 'saving' | 'error';

export interface UploadBookState {
  status: UploadStatus;
  pickedFile: PickedFile | null;
  title: string;
  author: string;
  error: string | null;
}

const PDF_MIME_TYPE = 'application/pdf';

const INITIAL_STATE: UploadBookState = {
  status: 'idle',
  pickedFile: null,
  title: '',
  author: '',
  error: null,
};

function isPdf(asset: DocumentPicker.DocumentPickerAsset): boolean {
  return (
    asset.name.toLowerCase().endsWith('.pdf') ||
    asset.mimeType?.toLowerCase() === PDF_MIME_TYPE
  );
}

export function useUploadBook() {
  const db = useSQLiteContext();
  const [state, setState] = useState<UploadBookState>(INITIAL_STATE);

  const pickFile = useCallback(async () => {
    setState((previous) => ({ ...previous, status: 'picking', error: null }));

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: PDF_MIME_TYPE,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        setState((previous) => ({
          ...previous,
          status: previous.pickedFile ? 'ready' : 'idle',
          error: null,
        }));
        return;
      }

      const asset = result.assets[0];

      if (!asset || !isPdf(asset)) {
        setState((previous) => ({
          ...previous,
          status: 'error',
          error: 'Please choose a PDF file.',
        }));
        return;
      }

      setState({
        status: 'ready',
        pickedFile: {
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType,
        },
        title: titleFromFilename(asset.name),
        author: '',
        error: null,
      });
    } catch {
      setState((previous) => ({
        ...previous,
        status: 'error',
        error: 'Could not open the file picker. Please try again.',
      }));
    }
  }, []);

  const setTitle = useCallback((title: string) => {
    setState((previous) => ({
      ...previous,
      title,
      error: null,
      status: previous.pickedFile ? 'ready' : previous.status,
    }));
  }, []);

  const setAuthor = useCallback((author: string) => {
    setState((previous) => ({
      ...previous,
      author,
      error: null,
      status: previous.pickedFile ? 'ready' : previous.status,
    }));
  }, []);

  const save = useCallback(async (): Promise<Book | null> => {
    if (
      !state.pickedFile ||
      !state.title.trim() ||
      state.status === 'picking' ||
      state.status === 'saving'
    ) {
      return null;
    }

    const { pickedFile, title, author } = state;

    setState((previous) => ({ ...previous, status: 'saving', error: null }));

    try {
      const book = await importBook(db, { pickedFile, title, author });
      setState(INITIAL_STATE);
      return book;
    } catch {
      setState((previous) => ({
        ...previous,
        status: 'error',
        error: 'Could not save the book. Please try again.',
      }));
      return null;
    }
  }, [db, state]);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    pickFile,
    setTitle,
    setAuthor,
    save,
    reset,
  };
}
