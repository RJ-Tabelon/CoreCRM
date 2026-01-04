export function formatDate(value) {
  if (!value) return '';
  // Backend returns ISO timestamps; tasks due_date may come as YYYY-MM-DD.
  const d =
    typeof value === 'string' && value.length === 10
      ? new Date(value + 'T00:00:00')
      : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(d);
}
