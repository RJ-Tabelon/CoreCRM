export function formatCurrency(value) {
  const num = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(num) || num === null || num === undefined) return '$0.00';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(num);
}
