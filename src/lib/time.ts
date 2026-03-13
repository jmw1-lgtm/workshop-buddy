export function minutesToTimeInput(minutes: number) {
  const safeMinutes = Math.max(0, Math.min(23 * 60 + 59, minutes));
  const hours = `${Math.floor(safeMinutes / 60)}`.padStart(2, "0");
  const mins = `${safeMinutes % 60}`.padStart(2, "0");

  return `${hours}:${mins}`;
}

export function timeInputToMinutes(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}
