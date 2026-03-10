export function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat('en-NZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}
