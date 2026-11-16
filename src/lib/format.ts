import type { Book } from '@/db';

const BOOK_COLORS = [
  '#6D597A',
  '#355070',
  '#B56576',
  '#2A9D8F',
  '#E76F51',
  '#457B9D',
  '#7F5539',
  '#5F6F52',
] as const;

export function titleFromFilename(name: string): string {
  const withoutExtension = name.replace(/\.[^./\\]+$/, '');
  return withoutExtension.replace(/[_-]+/g, ' ').trim();
}

export function formatProgress(book: Book): string {
  if (book.totalPages === 0) {
    return 'Not opened yet';
  }

  const percent = Math.round((book.lastPage / book.totalPages) * 100);
  return `${Math.min(100, Math.max(0, percent))}%`;
}

export function colorFromId(id: string): string {
  let hash = 2166136261;

  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return BOOK_COLORS[(hash >>> 0) % BOOK_COLORS.length] ?? BOOK_COLORS[0];
}
