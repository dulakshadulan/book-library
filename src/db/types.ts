export interface Book {
  id: string;
  title: string;
  author: string;
  fileUri: string;
  fileType: string;
  coverUri: string | null;
  totalPages: number;
  lastPage: number;
  addedAt: number;
  remotePath: string | null;
  synced: boolean;
}

export interface BookRow {
  id: string;
  title: string;
  author: string;
  file_uri: string;
  file_type: string;
  cover_uri: string | null;
  total_pages: number;
  last_page: number;
  added_at: number;
  remote_path: string | null;
  synced: 0 | 1;
}

export interface NewBook {
  title: string;
  author?: string;
  fileUri: string;
  fileType?: string;
  coverUri?: string | null;
  totalPages?: number;
}

export function bookFromRow(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    fileUri: row.file_uri,
    fileType: row.file_type,
    coverUri: row.cover_uri,
    totalPages: row.total_pages,
    lastPage: row.last_page,
    addedAt: row.added_at,
    remotePath: row.remote_path,
    synced: row.synced === 1,
  };
}

export function syncedToDb(synced: boolean): 0 | 1 {
  return synced ? 1 : 0;
}
