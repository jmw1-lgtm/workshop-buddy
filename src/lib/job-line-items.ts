import { JobLineItemType } from "@prisma/client";

export type JobLineItemSeed = {
  description: string;
  itemType: JobLineItemType;
  quantity: number;
  unitPrice: number;
};

export function buildPrimaryJobLineItem(input: {
  jobTypeName?: string | null;
  notes?: string | null;
}): JobLineItemSeed {
  const jobTypeName = input.jobTypeName?.trim() ?? "";
  const notes = input.notes?.trim() ?? "";

  return {
    description: derivePrimaryLineItemDescription(jobTypeName, notes),
    itemType: "LABOUR",
    quantity: 1,
    unitPrice: 0,
  };
}

export function ensurePrimaryJobLineItems<T>(lineItems: T[], fallback: T) {
  return lineItems.length > 0 ? lineItems : [fallback];
}

function derivePrimaryLineItemDescription(jobTypeName: string, notes: string) {
  if (jobTypeName && jobTypeName.toLowerCase() !== "other") {
    return jobTypeName;
  }

  if (notes) {
    return notes.length > 80 ? `${notes.slice(0, 77).trimEnd()}...` : notes;
  }

  if (jobTypeName) {
    return jobTypeName;
  }

  return "Workshop work";
}
