import Link from "next/link";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DiaryToolbarProps = {
  dateParam: string;
  previousDate: string;
  nextDate: string;
  todayDate: string;
  view: "day" | "week";
};

export function DiaryToolbar({
  dateParam,
  previousDate,
  nextDate,
  todayDate,
  view,
}: DiaryToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--surface-border)] bg-white/80 px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.035)] backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={view === "day" ? "default" : "outline"} size="sm" asChild>
          <Link href={`/diary?date=${dateParam}&view=day`}>
            <MaterialIcon name="calendar_view_day" className="text-[18px]" />
            Day
          </Link>
        </Button>
        <Button variant={view === "week" ? "secondary" : "outline"} size="sm" asChild>
          <Link href={`/diary?date=${dateParam}&view=week`}>
            <MaterialIcon name="calendar_view_week" className="text-[18px]" />
            Week
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/diary?date=${previousDate}&view=${view}`}>
              <MaterialIcon name="chevron_left" className="text-[18px]" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/diary?date=${todayDate}&view=${view}`}>Today</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/diary?date=${nextDate}&view=${view}`}>
              <MaterialIcon name="chevron_right" className="text-[18px]" />
            </Link>
          </Button>
        </div>

        <form className="flex items-center gap-2" method="get">
          <input type="hidden" name="view" value={view} />
          <Input
            type="date"
            name="date"
            defaultValue={dateParam}
            className="min-w-[180px] bg-[var(--surface-muted)]"
          />
          <Button type="submit" variant="outline" size="sm">
            <MaterialIcon name="event" className="text-[18px]" />
            Go
          </Button>
        </form>
      </div>
    </div>
  );
}
