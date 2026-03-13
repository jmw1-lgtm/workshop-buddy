"use client";

import { JobStatus } from "@prisma/client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  type JobCardActionState,
  updateJobCard,
} from "@/app/(app)/jobs/[jobId]/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VehicleLookupFields } from "@/components/vehicles/vehicle-lookup-fields";

const initialState: JobCardActionState = {
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

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Job Card"}
    </Button>
  );
}

type JobCardEditorProps = {
  job: {
    id: string;
    status: JobStatus;
    scheduledStart: Date;
    durationMins: number;
    notes: string | null;
    customer: {
      name: string;
      phone: string | null;
    };
    vehicle: {
      registration: string;
      make: string | null;
      model: string | null;
      fuel: string | null;
      year: number | null;
      engineSizeCc: number | null;
    };
    jobType: {
      id: string;
    };
  };
  jobTypes: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toTimeInputValue(date: Date) {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function JobCardEditor({ job, jobTypes }: JobCardEditorProps) {
  const [state, formAction] = useActionState(updateJobCard, initialState);

  return (
    <Card className="print:hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Edit job</CardTitle>
            <CardDescription>
              The Job Card is the operational workspace for updating this booking.
            </CardDescription>
          </div>
          <Badge variant="default">Tenant-scoped edit</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-5">
          <input type="hidden" name="jobId" value={job.id} />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="scheduledDate">Scheduled date</Label>
              <Input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                defaultValue={toDateInputValue(job.scheduledStart)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="scheduledTime">Scheduled time</Label>
              <Input
                id="scheduledTime"
                name="scheduledTime"
                type="time"
                defaultValue={toTimeInputValue(job.scheduledStart)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="customerName">Customer name</Label>
              <Input
                id="customerName"
                name="customerName"
                defaultValue={job.customer.name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={job.customer.phone ?? ""}
                required
              />
            </div>
          </div>

          <VehicleLookupFields
            initialVehicle={{
              registration: job.vehicle.registration,
              make: job.vehicle.make,
              model: job.vehicle.model,
              fuel: job.vehicle.fuel,
              year: job.vehicle.year,
              engineSizeCc: job.vehicle.engineSizeCc,
            }}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="jobTypeId">Job type</Label>
              <Select id="jobTypeId" name="jobTypeId" defaultValue={job.jobType.id} required>
                {jobTypes.map((jobType) => (
                  <option key={jobType.id} value={jobType.id}>
                    {jobType.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={job.status} required>
                {JOB_STATUS_OPTIONS.map((statusOption) => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="grid gap-2">
              <Label htmlFor="durationMins">Duration</Label>
              <Input
                id="durationMins"
                name="durationMins"
                type="number"
                min={15}
                step={15}
                defaultValue={job.durationMins}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={job.notes ?? ""}
                rows={5}
              />
            </div>
          </div>

          {state.error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.error}
            </p>
          ) : null}

          <div className="flex justify-end">
            <SaveButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
