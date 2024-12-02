export function setLocalHoursToUTCOffset(
  date: Date | undefined
): Date | undefined {
  if (!date) return undefined;

  const offset = date.getTimezoneOffset();
  const utcDate = new Date(date.getTime() - offset * 60000);
  return utcDate;
}
