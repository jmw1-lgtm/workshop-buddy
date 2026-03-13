"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  type SettingsActionState,
  updateDiarySettings,
  updateJobTypeColors,
  updateWorkshopProfile,
} from "@/app/(app)/settings/actions";
import { AppPage } from "@/components/layout/app-page";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const initialState: SettingsActionState = {
  error: null,
  success: null,
};

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

function ActionFeedback({ state }: { state: SettingsActionState }) {
  if (state.error) {
    return (
      <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {state.error}
      </p>
    );
  }

  if (state.success) {
    return (
      <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        {state.success}
      </p>
    );
  }

  return null;
}

type SettingsSectionsProps = {
  workshop: {
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    slotLength: number;
    workingDayStartMins: number;
    workingDayEndMins: number;
    jobTypes: Array<{
      id: string;
      name: string;
      color: string;
    }>;
  };
  workingDayStart: string;
  workingDayEnd: string;
};

export function SettingsSections({
  workshop,
  workingDayStart,
  workingDayEnd,
}: SettingsSectionsProps) {
  const [profileState, profileAction] = useActionState(updateWorkshopProfile, initialState);
  const [diaryState, diaryAction] = useActionState(updateDiarySettings, initialState);
  const [jobTypeState, jobTypeAction] = useActionState(updateJobTypeColors, initialState);

  return (
    <AppPage>
      <PageHeader
        eyebrow="Settings"
        title="Workshop settings"
        description="Manage workshop profile, diary configuration, and job type colours for the current workshop."
        actions={<Badge variant="success">Tenant-scoped</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workshop profile</CardTitle>
            <CardDescription>
              Update the workshop information shown across the app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={profileAction} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Workshop name</Label>
                <Input id="name" name="name" defaultValue={workshop.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={workshop.address ?? ""}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={workshop.phone ?? ""}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={workshop.email ?? ""}
                    required
                  />
                </div>
              </div>
              <ActionFeedback state={profileState} />
              <div className="flex justify-end">
                <SaveButton label="Save profile" />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diary settings</CardTitle>
            <CardDescription>
              Control slot length and working day hours for scheduling.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={diaryAction} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="slotLength">Slot length</Label>
                <Select
                  id="slotLength"
                  name="slotLength"
                  defaultValue={`${workshop.slotLength}`}
                  required
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="workingDayStart">Working day start</Label>
                  <Input
                    id="workingDayStart"
                    name="workingDayStart"
                    type="time"
                    defaultValue={workingDayStart}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="workingDayEnd">Working day end</Label>
                  <Input
                    id="workingDayEnd"
                    name="workingDayEnd"
                    type="time"
                    defaultValue={workingDayEnd}
                    required
                  />
                </div>
              </div>
              <ActionFeedback state={diaryState} />
              <div className="flex justify-end">
                <SaveButton label="Save diary settings" />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job types</CardTitle>
          <CardDescription>
            Edit the colour used for each job type in this workshop.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={jobTypeAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workshop.jobTypes.map((jobType) => (
                <div
                  key={jobType.id}
                  className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{jobType.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        Diary colour
                      </p>
                    </div>
                    <input
                      type="color"
                      name={`jobType:${jobType.id}`}
                      defaultValue={jobType.color}
                      className="h-12 w-14 cursor-pointer rounded-xl border border-[var(--surface-border)] bg-white p-1"
                      aria-label={`${jobType.name} colour`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <ActionFeedback state={jobTypeState} />
            <div className="flex justify-end">
              <SaveButton label="Save job type colours" />
            </div>
          </form>
        </CardContent>
      </Card>
    </AppPage>
  );
}
