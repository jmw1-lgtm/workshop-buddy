"use client";

import { JobStatus } from "@prisma/client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  type JobCardActionState,
  updateJobCard,
} from "@/app/(app)/jobs/[jobId]/actions";
import { Button } from "@/components/ui/button";
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

function SaveButton({ form }: { form?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" form={form} disabled={pending}>
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
      email: string | null;
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
  const formId = "job-card-form";

  return (
    <form id={formId} action={formAction} className="grid gap-6">
      <input type="hidden" name="jobId" value={job.id} />

      <section className="grid gap-4 lg:grid-cols-[1.08fr_1.22fr]">
        <DocumentSection
          title="Customer details"
          description="Primary contact for this work order."
        >
          <div className="grid gap-4">
            <FieldGroup>
              <Label htmlFor="customerName">Customer name</Label>
              <Input
                id="customerName"
                name="customerName"
                defaultValue={job.customer.name}
                required
              />
            </FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <FieldGroup>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={job.customer.phone ?? ""}
                  placeholder="Optional"
                />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  defaultValue={job.customer.email ?? ""}
                  placeholder="customer@example.com"
                />
              </FieldGroup>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FieldGroup>
                <Label htmlFor="scheduledDate">Scheduled date</Label>
                <Input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  defaultValue={toDateInputValue(job.scheduledStart)}
                  required
                />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="scheduledTime">Scheduled time</Label>
                <Input
                  id="scheduledTime"
                  name="scheduledTime"
                  type="time"
                  defaultValue={toTimeInputValue(job.scheduledStart)}
                  required
                />
              </FieldGroup>
            </div>
          </div>
        </DocumentSection>

        <DocumentSection
          title="Vehicle details"
          description="Confirm or update the vehicle before saving."
        >
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
        </DocumentSection>
      </section>

      <DocumentSection
        title="Job details"
        description="Operational details for the work being booked."
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_180px]">
          <FieldGroup>
            <Label htmlFor="jobTypeId">Job type</Label>
            <Select id="jobTypeId" name="jobTypeId" defaultValue={job.jobType.id} required>
              {jobTypes.map((jobType) => (
                <option key={jobType.id} value={jobType.id}>
                  {jobType.name}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={job.status} required>
              {JOB_STATUS_OPTIONS.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup>
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
          </FieldGroup>
        </div>
      </DocumentSection>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <DocumentSection
          title="Notes"
          description="Customer-facing and workshop notes for this job."
        >
          <FieldGroup>
            <Label htmlFor="notes">Customer / job notes</Label>
            <Textarea id="notes" name="notes" defaultValue={job.notes ?? ""} rows={7} />
          </FieldGroup>
        </DocumentSection>

        <DocumentSection
          title="Technician area"
          description="Use these spaces when printing or reviewing the job card in the workshop."
          className="print:border-l-0"
        >
          <div className="grid gap-4">
            <StaticNotesBlock title="Technician notes" />
            <StaticNotesBlock title="Sign-off" compact />
          </div>
        </DocumentSection>
      </section>

      {state.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end print:hidden">
        <SaveButton form={formId} />
      </div>
    </form>
  );
}

function DocumentSection({
  title,
  description,
  className,
  children,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
}>) {
  return (
    <section
      className={`rounded-[26px] border border-[var(--surface-border)] bg-white p-5 ${className ?? ""}`}
    >
      <div className="mb-4 border-b border-[var(--surface-border)] pb-3">
        <h3 className="text-sm font-semibold tracking-[0.04em] text-[var(--foreground)]">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function FieldGroup({ children }: React.PropsWithChildren) {
  return <div className="grid gap-2">{children}</div>;
}

function StaticNotesBlock({
  title,
  compact = false,
}: {
  title: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/18 p-4 print:bg-white">
      <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      <div
        className={`mt-3 rounded-2xl border border-dashed border-[var(--surface-border)] bg-white/70 print:bg-white ${compact ? "min-h-24" : "min-h-40"}`}
      />
    </div>
  );
}
