# Book Library — Implementation Plan

Mobile book library app. Users upload their own PDFs into a private personal
library. The 3D rotunda interface comes later; the core is built with plain 2D
screens first.

## Stack

- React Native + Expo (TypeScript, strict)
- Expo Router, routes in `src/app/`
- Local SQLite is the only source of truth for the UI (offline-first)
- Supabase cloud sync is stubbed for now (no Supabase packages yet)
- EAS development builds (development client), not Expo Go

## Folder layout

```
src/
  app/                      # Expo Router routes only
  db/
    types.ts                # Book, BookRow, NewBook + row mapping
    schema.ts               # SQL statements + schema version
    database.ts             # DB name + PRAGMA user_version migrations
    booksRepository.ts      # async typed CRUD (db passed as first arg)
    index.ts                # barrel export
  features/
    library/                # hooks + presentational components
    upload/
    reader/
  sync/                     # SyncProvider interface + no-op stub (later)
  lib/                      # env, files, format helpers (later as needed)
```

Keep non-route code outside `src/app/` and keep business logic out of screen
components.

## Schema

```sql
CREATE TABLE books (
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

CREATE INDEX books_added_at_idx ON books (added_at DESC);
```

`synced` is stored as `0 | 1` and mapped to/from `boolean` in exactly one place
(`src/db/types.ts`).

## Migrations

Migrations run through `PRAGMA user_version` inside `SQLiteProvider`'s
`onInit` handler. Version 0 creates the table and index. Future schema changes
add another `if (currentVersion === N)` block and bump `DATABASE_VERSION`.

## Repository API

All functions are async, fully typed, and take `db: SQLiteDatabase` as the
first argument.

- `listBooks(db): Promise<Book[]>` — newest `added_at` first
- `getBook(db, id): Promise<Book | null>`
- `addBook(db, input: NewBook): Promise<Book>` — id from `expo-crypto`
- `updateProgress(db, id, page): Promise<boolean>`
- `updateTotalPages(db, id, total): Promise<boolean>`
- `deleteBook(db, id): Promise<boolean>`

## Build order

1. Router scaffold (done)
2. DB layer: packages, schema, migrations, repository, provider, dev smoke test
3. Upload: document picker, private file copy, insert book
4. Library screen: list books from SQLite
5. Reader: resume at `last_page`, save progress, fill `total_pages` on first open
6. Sync stubs: `SyncProvider` interface + no-op implementation
7. Verify: typecheck, lint, device testing

## Native dependencies

Installed now in one batch so a single EAS development rebuild covers
everything:

- `expo-sqlite`
- `expo-crypto`
- `expo-file-system`
- `expo-document-picker`
- `react-native-pdf`
- `react-native-blob-util`
- `@config-plugins/react-native-pdf`
- `@config-plugins/react-native-blob-util`

PDF screen implementation is deferred to the reader step; only install and
native configuration happen in step 2.

## Rules

- Upload-based personal libraries only; files are private per user.
- No cross-user sharing or discovery features.
- Supabase storage isolation will use RLS when sync is implemented.
- Keep 3D code in `src/scene` and reading/book management in `src/features`.
- Small commits, one feature per task.
- Do not add libraries without agreement.
