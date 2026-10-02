import { clerkClient } from "@clerk/nextjs/server";
import { SubscriptionStatus } from "@prisma/client";

import { prisma } from "@/db/prisma";
import { getReturnedStatus, isActivatedDuringTrial } from "@/lib/admin-analytics";
import { getStripeSubscriptionSummary, getTrialDaysRemaining } from "@/services/subscriptions";

type AdminFilter = "all" | "trial" | "subscribed" | "inactive";

export type AdminAccountRow = {
  workshopId: string;
  workshopName: string;
  ownerEmail: string | null;
  createdAt: Date;
  activityTrackingStartedAt: Date | null;
  lastLoginAt: Date | null;
  lastActivityAt: Date | null;
  activeDays: number | null;
  jobsCreatedCount: number;
  firstJobCreatedAt: Date | null;
  lastJobCreatedAt: Date | null;
  activated: boolean;
  returned: boolean | null;
  accountStatus: "Trialling" | "Expired" | "Subscribed" | "Inactive";
  trialLabel: string;
  trialStartedAt: Date | null;
  trialEndsAt: Date | null;
  subscriptionStatus: string;
  isPaidSubscriber: boolean;
  currentPlan: string | null;
  stripeCustomerId: string | null;
  normalizedFilter: Exclude<AdminFilter, "all"> | "all";
};

type SummaryMetric = {
  count: number;
  total: number;
};

export type AdminDashboardData = {
  summary: {
    totalTrials: number;
    activatedTrials: SummaryMetric;
    returnedTrials: SummaryMetric;
    convertedToPaid: SummaryMetric;
    currentlyActiveTrials: number;
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

function getAccountStatus(subscription: {
  status: SubscriptionStatus;
  trialEndsAt: Date;
} | null): AdminAccountRow["accountStatus"] {
  if (subscription?.status === "ACTIVE") {
    return "Subscribed";
  }

  if (subscription?.status === "TRIAL") {
    return subscription.trialEndsAt > new Date() ? "Trialling" : "Expired";
  }

  return "Inactive";
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

  const [workshops, jobAggregates] = await Promise.all([
    prisma.workshop.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        memberships: { orderBy: { createdAt: "asc" } },
        subscription: true,
        _count: { select: { activityDays: true } },
      },
    }),
    prisma.job.groupBy({
      by: ["workshopId"],
      _count: { _all: true },
      _min: { createdAt: true },
      _max: { createdAt: true },
    }),
  ]);

  const jobAggregateMap = new Map(
    jobAggregates.map((aggregate) => [aggregate.workshopId, aggregate]),
  );
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
    const jobAggregate = jobAggregateMap.get(workshop.id);
    const firstJobCreatedAt = jobAggregate?._min.createdAt ?? null;
    const lastJobCreatedAt = jobAggregate?._max.createdAt ?? null;
    const trialStartedAt = workshop.subscription?.createdAt ?? null;
    const trialEndsAt = workshop.subscription?.trialEndsAt ?? null;
    const activated = isActivatedDuringTrial({
      firstJobCreatedAt,
      trialStartedAt,
      trialEndsAt,
    });
    const activeDays = workshop.activityTrackingStartedAt
      ? workshop._count.activityDays
      : null;

    return {
      workshopId: workshop.id,
      workshopName: workshop.name,
      ownerEmail,
      createdAt: workshop.createdAt,
      activityTrackingStartedAt: workshop.activityTrackingStartedAt,
      lastLoginAt: workshop.lastLoginAt,
      lastActivityAt: workshop.lastActivityAt,
      activeDays,
      jobsCreatedCount: jobAggregate?._count._all ?? 0,
      firstJobCreatedAt,
      lastJobCreatedAt,
      activated,
      returned: getReturnedStatus(activeDays),
      accountStatus: getAccountStatus(workshop.subscription),
      trialLabel: getTrialLabel(workshop.subscription),
      trialStartedAt,
      trialEndsAt,
      subscriptionStatus: getSubscriptionStatusLabel(workshop.subscription),
      isPaidSubscriber: Boolean(
        workshop.subscription?.status === "ACTIVE" &&
          workshop.subscription.stripeSubscriptionId,
      ),
      currentPlan: stripeSummary?.planLabel ?? null,
      stripeCustomerId: workshop.subscription?.stripeCustomerId ?? null,
      normalizedFilter: filterState,
    };
  });

  const trialRows = allRows.filter((row) => row.trialStartedAt !== null);
  const totalTrials = trialRows.length;
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
      totalTrials,
      activatedTrials: {
        count: trialRows.filter((row) => row.activated).length,
        total: totalTrials,
      },
      returnedTrials: {
        count: trialRows.filter((row) => row.returned === true).length,
        total: totalTrials,
      },
      convertedToPaid: {
        count: trialRows.filter((row) => row.isPaidSubscriber).length,
        total: totalTrials,
      },
      currentlyActiveTrials: trialRows.filter((row) => row.accountStatus === "Trialling").length,
    },
    rows,
  } satisfies AdminDashboardData;
}
