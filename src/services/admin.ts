import { clerkClient } from "@clerk/nextjs/server";
import { SubscriptionStatus } from "@prisma/client";

import { prisma } from "@/db/prisma";
import { getStripeSubscriptionSummary, getTrialDaysRemaining } from "@/services/subscriptions";

type AdminFilter = "all" | "trial" | "subscribed" | "inactive";

export type AdminAccountRow = {
  workshopId: string;
  workshopName: string;
  ownerEmail: string | null;
  createdAt: Date;
  jobsCreatedCount: number;
  trialLabel: string;
  trialEndsAt: Date | null;
  subscriptionStatus: string;
  currentPlan: string | null;
  stripeCustomerId: string | null;
  normalizedFilter: Exclude<AdminFilter, "all"> | "all";
};

export type AdminDashboardData = {
  summary: {
    totalAccounts: number;
    activeTrials: number;
    activeSubscriptions: number;
    inactiveCancelled: number;
  };
  rows: AdminAccountRow[];
};

function normalizeFilter(value?: string): AdminFilter {
  switch (value) {
    case "trial":
    case "subscribed":
    case "inactive":
      return value;
    default:
      return "all";
  }
}

function getRowFilterState(subscription: {
  status: SubscriptionStatus;
  trialEndsAt: Date;
} | null): AdminAccountRow["normalizedFilter"] {
  if (!subscription) {
    return "inactive";
  }

  if (subscription.status === "ACTIVE") {
    return "subscribed";
  }

  if (subscription.status === "TRIAL" && subscription.trialEndsAt > new Date()) {
    return "trial";
  }

  return "inactive";
}

function getTrialLabel(subscription: {
  status: SubscriptionStatus;
  trialEndsAt: Date;
} | null) {
  if (!subscription) {
    return "No subscription";
  }

  if (subscription.status === "TRIAL") {
    const daysRemaining = getTrialDaysRemaining(subscription.trialEndsAt);

    return daysRemaining > 0
      ? `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`
      : "Expired";
  }

  return "Ended";
}

function getSubscriptionStatusLabel(subscription: {
  status: SubscriptionStatus;
} | null) {
  if (!subscription) {
    return "Missing";
  }

  switch (subscription.status) {
    case "ACTIVE":
      return "Active";
    case "TRIAL":
      return "Trial";
    case "PAST_DUE":
      return "Past due";
    case "CANCELLED":
      return "Cancelled";
    default:
      return subscription.status;
  }
}

export async function getAdminDashboardData(input?: {
  search?: string;
  filter?: string;
}) {
  const search = input?.search?.trim().toLowerCase() ?? "";
  const filter = normalizeFilter(input?.filter);

  const workshops = await prisma.workshop.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      memberships: {
        orderBy: {
          createdAt: "asc",
        },
      },
      subscription: true,
      _count: {
        select: {
          jobs: true,
        },
      },
    },
  });

  const clerkUserIds = Array.from(
    new Set(
      workshops
        .flatMap((workshop) => workshop.memberships.map((membership) => membership.clerkUserId))
        .filter(Boolean),
    ),
  );

  const clerk = await clerkClient();
  const users = clerkUserIds.length
    ? await clerk.users.getUserList({ userId: clerkUserIds })
    : { data: [] as Array<{ id: string; primaryEmailAddress?: { emailAddress?: string | null } | null; emailAddresses: Array<{ emailAddress?: string | null }> }> };
  const userEmailMap = new Map(
    users.data.map((user) => [
      user.id,
      (user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0]?.emailAddress ??
        null) as string | null,
    ]),
  );

  const activeStripeSubscriptionIds = workshops
    .map((workshop) => workshop.subscription?.stripeSubscriptionId ?? null)
    .filter((value): value is string => Boolean(value));

  const stripeSummaryMap = new Map(
    await Promise.all(
      activeStripeSubscriptionIds.map(async (subscriptionId) => {
        const summary = await getStripeSubscriptionSummary(subscriptionId).catch(() => null);
        return [subscriptionId, summary] as const;
      }),
    ),
  );

  const allRows: AdminAccountRow[] = workshops.map((workshop) => {
    const ownerMembership =
      workshop.memberships.find((membership) => membership.role === "OWNER") ??
      workshop.memberships[0] ??
      null;
    const ownerEmail = ownerMembership
      ? userEmailMap.get(ownerMembership.clerkUserId) ?? null
      : null;
    const filterState = getRowFilterState(workshop.subscription);
    const stripeSummary = workshop.subscription?.stripeSubscriptionId
      ? stripeSummaryMap.get(workshop.subscription.stripeSubscriptionId) ?? null
      : null;

    return {
      workshopId: workshop.id,
      workshopName: workshop.name,
      ownerEmail,
      createdAt: workshop.createdAt,
      jobsCreatedCount: workshop._count.jobs,
      trialLabel: getTrialLabel(workshop.subscription),
      trialEndsAt: workshop.subscription?.trialEndsAt ?? null,
      subscriptionStatus: getSubscriptionStatusLabel(workshop.subscription),
      currentPlan: stripeSummary?.planLabel ?? null,
      stripeCustomerId: workshop.subscription?.stripeCustomerId ?? null,
      normalizedFilter: filterState,
    };
  });

  const rows = allRows.filter((row) => {
    const matchesFilter = filter === "all" ? true : row.normalizedFilter === filter;
    const matchesSearch =
      !search ||
      row.workshopName.toLowerCase().includes(search) ||
      (row.ownerEmail?.toLowerCase().includes(search) ?? false);

    return matchesFilter && matchesSearch;
  });

  return {
    summary: {
      totalAccounts: allRows.length,
      activeTrials: allRows.filter((row) => row.normalizedFilter === "trial").length,
      activeSubscriptions: allRows.filter((row) => row.normalizedFilter === "subscribed")
        .length,
      inactiveCancelled: allRows.filter((row) => row.normalizedFilter === "inactive").length,
    },
    rows,
  } satisfies AdminDashboardData;
}
