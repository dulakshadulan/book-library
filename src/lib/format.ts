export function titleFromFilename(name: string): string {
  const withoutExtension = name.replace(/\.[^./\\]+$/, '');
  return withoutExtension.replace(/[_-]+/g, ' ').trim();
}
