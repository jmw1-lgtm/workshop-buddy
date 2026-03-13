import { prisma } from "@/db/prisma";

const DEFAULT_JOB_TYPES = [
  { name: "Service", color: "#0F766E" },
  { name: "MOT", color: "#2563EB" },
  { name: "Repair", color: "#F97316" },
  { name: "Diagnostics", color: "#7C3AED" },
  { name: "Other", color: "#64748B" },
] as const;

const TRIAL_LENGTH_DAYS = 14;

function slugifyWorkshopName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

async function createUniqueWorkshopSlug(name: string) {
  const baseSlug = slugifyWorkshopName(name) || "workshop";
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.workshop.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}

export type CreateWorkshopInput = {
  clerkUserId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  slotLength: 30 | 60;
};

export async function createWorkshopWithOwner(input: CreateWorkshopInput) {
  const slug = await createUniqueWorkshopSlug(input.name);
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_LENGTH_DAYS);

  return prisma.$transaction(async (tx) => {
    const workshop = await tx.workshop.create({
      data: {
        name: input.name,
        slug,
        address: input.address,
        phone: input.phone,
        email: input.email,
        slotLength: input.slotLength,
        workingDayStartMins: 8 * 60,
        workingDayEndMins: 18 * 60,
      },
    });

    const subscription = await tx.subscription.create({
      data: {
        workshopId: workshop.id,
        status: "TRIAL",
        trialEndsAt,
      },
    });

    const membership = await tx.membership.create({
      data: {
        clerkUserId: input.clerkUserId,
        workshopId: workshop.id,
        role: "OWNER",
      },
    });

    await tx.jobType.createMany({
      data: DEFAULT_JOB_TYPES.map((jobType) => ({
        workshopId: workshop.id,
        name: jobType.name,
        color: jobType.color,
      })),
    });

    return {
      workshop,
      membership,
      subscription,
    };
  });
}
