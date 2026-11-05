export const DATABASE_VERSION = 1;

export const BOOKS_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT '',
    file_uri TEXT NOT NULL,
    file_type TEXT NOT NULL DEFAULT 'pdf',
    cover_uri TEXT,
    total_pages INTEGER NOT NULL DEFAULT 0,
    last_page INTEGER NOT NULL DEFAULT 1,
    added_at INTEGER NOT NULL,
    remote_path TEXT,
    synced INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS books_added_at_idx ON books (added_at DESC);
`;
