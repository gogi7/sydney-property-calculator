/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format as percentage change with + or - sign
 */
export function formatPercentageChange(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '0%';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

