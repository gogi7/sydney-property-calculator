/**
 * Format number as Australian currency
 */
export function formatCurrency(value: number, showCents: boolean = false): string {
  if (isNaN(value)) return '$0';
  
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  };
  
  return new Intl.NumberFormat('en-AU', options).format(value);
}

/**
 * Format large numbers with abbreviations (e.g., $1.2M)
 */
export function formatCurrencyCompact(value: number): string {
  if (isNaN(value)) return '$0';
  
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  
  return formatCurrency(value);
}

/**
 * Parse currency string back to number
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

