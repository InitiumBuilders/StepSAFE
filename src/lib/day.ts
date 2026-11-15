/* The calendar day where the learner is, as YYYY-MM-DD. toISOString() gives the UTC day, which
   runs a day ahead in the American evening and broke the streak and the daily moves after 7pm Central. */

export function localDay(ms: number = Date.now()): string {
  const d = new Date(ms);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/** the calendar day before, counted in days rather than 24 hours so a clock change cannot skip one */
export function localYesterday(ms: number = Date.now()): string {
  const d = new Date(ms);
  d.setDate(d.getDate() - 1);
  return localDay(d.getTime());
}
