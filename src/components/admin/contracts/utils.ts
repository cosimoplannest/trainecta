
/**
 * Formats duration days to a human-readable format
 */
export function formatDuration(days: number): string {
  if (days === 30) return "1 Mese";
  if (days === 90) return "3 Mesi";
  if (days === 180) return "6 Mesi";
  if (days === 365) return "12 Mesi";
  return `${days} giorni`;
}
