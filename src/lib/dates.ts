export function parseDateParam(dateParam?: string) {
  if (!dateParam) {
    return startOfLocalDay(new Date());
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateParam);

  if (!match) {
    return startOfLocalDay(new Date());
  }

  const [, year, month, day] = match;

  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function getSelectedDayFromSearchParam(dateParam?: string) {
  return parseDateParam(dateParam);
}

export function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function startOfWeek(date: Date) {
  const dayOfWeek = date.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  return addDays(startOfLocalDay(date), diffToMonday);
}

export function differenceInCalendarDays(left: Date, right: Date) {
  const leftStart = startOfLocalDay(left).getTime();
  const rightStart = startOfLocalDay(right).getTime();

  return Math.round((leftStart - rightStart) / 86_400_000);
}

export function formatDateParam(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatWeekRange(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    return `${new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
    }).format(start)}-${new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(end)}`;
  }

  if (sameYear) {
    return `${new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
    }).format(start)} - ${new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(end)}`;
  }

  return `${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(start)} - ${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(end)}`;
}

export function formatDisplayDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function setTimeOnDate(date: Date, hours: number, minutes: number) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0,
  );
}

export function formatTimeLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
