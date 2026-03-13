"use client";

import { JobStatus } from "@prisma/client";
import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  createDiaryJob,
  deleteDiaryJob,
  type JobActionState,
  updateDiaryJob,
} from "@/app/(app)/diary/actions";
import { MaterialIcon } from "@/components/layout/material-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VehicleLookupFields } from "@/components/vehicles/vehicle-lookup-fields";

type JobTypeOption = {
  id: string;
  name: string;
  color: string;
};

type DiaryDialogJob = {
  id: string;
  customerName: string;
  customerPhone: string | null;
  vehicleRegistration: string;
  jobTypeId: string;
  jobTypeName: string;
  status: JobStatus;
  durationMins: number;
  notes: string | null;
};

type CreateJobDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduledStart: string | null;
  slotLabel: string | null;
  selectedDate: string;
  selectedView?: "day" | "week";
  jobTypes: JobTypeOption[];
  slotLength: 30 | 60;
  job: DiaryDialogJob | null;
};

const initialState: JobActionState = {
  error: null,
};

const JOB_STATUS_OPTIONS: Array<{
  value: JobStatus;
  label: string;
}> = [
  { value: "BOOKED", label: "Booked" },
  { value: "ARRIVED", label: "Arrived" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "WAITING_PARTS", label: "Waiting Parts" },
  { value: "WAITING_COLLECTION", label: "Waiting Collection" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function SaveButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-strong)] disabled:opacity-50"
    >
      {pending ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save changes" : "Create job"}
    </button>
  );
}

function DeleteButton(props: React.ComponentProps<"button">) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formNoValidate
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50"
      {...props}
    >
      {pending ? "Deleting..." : "Delete job"}
    </button>
  );
}

export function CreateJobDialog({
  open,
  onOpenChange,
  scheduledStart,
  slotLabel,
  selectedDate,
  selectedView = "day",
  jobTypes,
  slotLength,
  job,
}: CreateJobDialogProps) {
  const [createState, createAction] = useActionState(createDiaryJob, initialState);
  const [updateState, updateAction] = useActionState(updateDiaryJob, initialState);
  const [deleteState, deleteAction] = useActionState(deleteDiaryJob, initialState);
  const isEditing = Boolean(job);
  const state = isEditing ? updateState : createState;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit job" : "Create job"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the job details, status, or delete the job. All changes remain scoped to the current workshop."
              : slotLabel
                ? `Create a job starting at ${slotLabel}. Existing customer and vehicle records will be reused by registration.`
                : "Create a new job for the selected slot."}
          </DialogDescription>
        </DialogHeader>

        <form action={isEditing ? updateAction : createAction} className="grid gap-4" key={job?.id ?? scheduledStart ?? "create"}>
          {isEditing ? <input type="hidden" name="jobId" value={job?.id ?? ""} /> : null}
          <input type="hidden" name="scheduledStart" value={scheduledStart ?? ""} />
          <input type="hidden" name="selectedDate" value={selectedDate} />
          <input type="hidden" name="selectedView" value={selectedView} />

          <VehicleLookupFields
            initialVehicle={
              job
                ? {
                    registration: job.vehicleRegistration,
                  }
                : undefined
            }
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="customerName">Customer name</Label>
              <Input
                id="customerName"
                name="customerName"
                placeholder="Jamie Smith"
                defaultValue={job?.customerName ?? ""}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="07123 456789"
                type="tel"
                defaultValue={job?.customerPhone ?? ""}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jobTypeId">Job type</Label>
              <Select
                id="jobTypeId"
                name="jobTypeId"
                required
                defaultValue={job?.jobTypeId ?? jobTypes[0]?.id}
              >
                {jobTypes.map((jobType) => (
                  <option key={jobType.id} value={jobType.id}>
                    {jobType.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="durationMins">Estimated duration</Label>
              <Select
                id="durationMins"
                name="durationMins"
                required
                defaultValue={`${job?.durationMins ?? slotLength}`}
              >
                {[slotLength, slotLength * 2, slotLength * 3, slotLength * 4].map((value) => (
                  <option key={value} value={value}>
                    {value} minutes
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                name="status"
                required
                defaultValue={job?.status ?? "BOOKED"}
              >
                {JOB_STATUS_OPTIONS.map((statusOption) => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Customer waiting. MOT and service if possible."
              defaultValue={job?.notes ?? ""}
              rows={4}
            />
          </div>

          {state.error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.error}
            </p>
          ) : null}

          {deleteState.error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {deleteState.error}
            </p>
          ) : null}

          <div className="flex items-center justify-between border-t border-[var(--surface-border)] pt-4">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <MaterialIcon name="schedule" className="text-[18px]" />
              {isEditing ? "Update job details" : `Slot length ${slotLength} minutes`}
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? <DeleteButton formAction={deleteAction} /> : null}
              <SaveButton isEditing={isEditing} />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
