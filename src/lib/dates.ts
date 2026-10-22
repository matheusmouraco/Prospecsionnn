export const BUSINESS_TZ = 'America/Sao_Paulo';

// YYYY-MM-DD for the business day in Brazil (metrics and daily limits use this, not UTC).
export function businessDay(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: BUSINESS_TZ }).format(date);
}
