export const ACTIVITY_TIME_ZONE = "Europe/London";

export function getActivityDate(at: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ACTIVITY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(at);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)));
}
