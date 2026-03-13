import { requireCurrentWorkshop } from "@/lib/workshop";
import {
  addDays,
  formatDateParam,
  parseDateParam,
  startOfWeek,
} from "@/lib/dates";
import { getDiaryPageData, getDiaryWeekPageData } from "@/services/diary";
import { DiaryGrid } from "@/components/diary/diary-grid";
import { DiaryToolbar } from "@/components/diary/diary-toolbar";
import { WeekDiaryGrid } from "@/components/diary/week-diary-grid";
import { AppPage } from "@/components/layout/app-page";
import type { DiaryWeekPageData } from "@/services/diary";

type DiaryPageProps = {
  searchParams?: Promise<{
    date?: string;
    view?: string;
  }>;
};

export default async function DiaryPage({ searchParams }: DiaryPageProps) {
  const tenant = await requireCurrentWorkshop();
  const resolvedSearchParams = await searchParams;
  const view = resolvedSearchParams?.view === "week" ? "week" : "day";
  const selectedDate = parseDateParam(resolvedSearchParams?.date);
  const diary =
    view === "week"
      ? await getDiaryWeekPageData({
          workshopId: tenant.workshopId,
          date: selectedDate,
        })
      : await getDiaryPageData({
          workshopId: tenant.workshopId,
          date: selectedDate,
        });

  const previousDate =
    view === "week"
      ? formatDateParam(addDays(startOfWeek(diary.selectedDate), -7))
      : formatDateParam(addDays(diary.selectedDate, -1));
  const nextDate =
    view === "week"
      ? formatDateParam(addDays(startOfWeek(diary.selectedDate), 7))
      : formatDateParam(addDays(diary.selectedDate, 1));
  const todayDate = formatDateParam(new Date());
  const weekDiary: DiaryWeekPageData | null = view === "week" ? (diary as DiaryWeekPageData) : null;

  return (
    <AppPage>
      <DiaryToolbar
        dateParam={diary.dateParam}
        previousDate={previousDate}
        nextDate={nextDate}
        todayDate={todayDate}
        view={view}
      />

      {view === "day" ? (
        <DiaryGrid
          slotLength={diary.slotLength}
          selectedDate={diary.dateParam}
          slots={diary.slots.map((slot) => ({
            index: slot.index,
            label: slot.label,
            dateTimeValue: slot.dateTimeValue,
          }))}
          jobTypes={diary.jobTypes}
          jobs={diary.jobs.map((job) => ({
            id: job.id,
            customerName: job.customerName,
            customerPhone: job.customerPhone,
            vehicleRegistration: job.vehicleRegistration,
            jobTypeId: job.jobTypeId,
            jobTypeName: job.jobTypeName,
            jobTypeColor: job.jobTypeColor,
            status: job.status,
            durationMins: job.durationMins,
            notes: job.notes,
            slotIndex: job.slotIndex,
            slotSpan: job.slotSpan,
            dayIndex: job.dayIndex,
          }))}
        />
      ) : (
        weekDiary && (
          <WeekDiaryGrid
            slotLength={weekDiary.slotLength}
            slots={weekDiary.slots.map((slot) => ({
              index: slot.index,
              label: slot.label,
              dateTimeValue: slot.dateTimeValue,
            }))}
            days={weekDiary.days.map((day) => ({
              dateParam: day.dateParam,
              label: day.label,
              shortLabel: day.shortLabel,
              isToday: day.isToday,
              isSelected: day.isSelected,
            }))}
            jobTypes={weekDiary.jobTypes}
            jobs={weekDiary.jobs.map((job) => ({
              id: job.id,
              customerName: job.customerName,
              customerPhone: job.customerPhone,
              vehicleRegistration: job.vehicleRegistration,
              jobTypeId: job.jobTypeId,
              jobTypeName: job.jobTypeName,
              jobTypeColor: job.jobTypeColor,
              status: job.status,
              durationMins: job.durationMins,
              notes: job.notes,
              slotIndex: job.slotIndex,
              slotSpan: job.slotSpan,
              dayIndex: job.dayIndex,
            }))}
          />
        )
      )}
    </AppPage>
  );
}
