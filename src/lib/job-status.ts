import { JobStatus } from "@prisma/client";

export const quickJobStatusOptions: JobStatus[] = [
  "BOOKED",
  "ARRIVED",
  "IN_PROGRESS",
  "WAITING_PARTS",
  "WAITING_COLLECTION",
  "COMPLETED",
  "CANCELLED",
];

export const jobStatusLabels: Record<JobStatus, string> = {
  BOOKED: "Booked",
  ARRIVED: "Arrived",
  IN_PROGRESS: "In Progress",
  WAITING_PARTS: "Waiting Parts",
  WAITING_COLLECTION: "Waiting Collection",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
