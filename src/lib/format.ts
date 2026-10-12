/** Formats an ISO date (YYYY-MM-DD) as e.g. "26 Jul 2022" / "26 jul 2022". */
export function formatDate(iso: string, locale: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}
