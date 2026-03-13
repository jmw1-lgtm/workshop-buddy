import { SubscriptionStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import Stripe from "stripe";

import { prisma } from "@/db/prisma";
import { getStripe } from "@/services/stripe";

const ACTIVE_SUBSCRIPTION_STATUSES = new Set<SubscriptionStatus>([
  "ACTIVE",
  "TRIAL",
]);

export function isSubscriptionActiveForAccess(input: {
  status: SubscriptionStatus;
  trialEndsAt: Date;
  now?: Date;
}) {
  const now = input.now ?? new Date();

  if (input.status === "ACTIVE") {
    return true;
  }

  if (input.status === "TRIAL" && input.trialEndsAt > now) {
    return true;
  }

  return false;
}

export function getTrialDaysRemaining(trialEndsAt: Date, now = new Date()) {
  const remainingMs = trialEndsAt.getTime() - now.getTime();

  if (remainingMs <= 0) {
    return 0;
  }

  return Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
}

export function getTrialBadgeLabel(daysRemaining: number) {
  if (daysRemaining <= 1) {
    return "Trial ends today";
  }

  return `Trial · ${daysRemaining} days left`;
}

export function getTrialBadgeVariant(daysRemaining: number) {
  if (daysRemaining <= 5) {
    return "warning" as const;
  }

  return "default" as const;
}

export async function getWorkshopSubscription(workshopId: string) {
  return prisma.subscription.findUnique({
    where: {
      workshopId,
    },
  });
}

export async function requireWorkshopSubscription(workshopId: string) {
  const subscription = await getWorkshopSubscription(workshopId);

  if (!subscription) {
    redirect("/billing");
  }

  if (!isSubscriptionActiveForAccess(subscription)) {
    redirect("/billing");
  }

  return subscription;
}

export async function getStripeSubscriptionSummary(stripeSubscriptionId: string) {
  const stripeSubscription = await getStripe().subscriptions.retrieve(
    stripeSubscriptionId,
    {
      expand: ["items.data.price"],
    },
  );

  const primaryPrice = stripeSubscription.items.data[0]?.price;
  const recurringInterval = primaryPrice?.recurring?.interval ?? null;
  const currentPeriodEnd =
    (
      stripeSubscription as Stripe.Subscription & {
        current_period_end?: number;
      }
    ).current_period_end ?? null;

  return {
    planLabel:
      recurringInterval === "year"
        ? "Yearly"
        : recurringInterval === "month"
          ? "Monthly"
          : "Unknown",
    nextBillingDate: currentPeriodEnd
      ? new Date(currentPeriodEnd * 1000)
      : null,
  };
}

function getPriceId(plan: "monthly" | "yearly") {
  const priceId =
    plan === "monthly"
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_YEARLY_PRICE_ID;

  if (!priceId) {
    throw new Error(
      `Stripe price ID for the ${plan} plan is not configured.`,
    );
  }

  return priceId;
}

export async function createSubscriptionCheckoutSession(input: {
  workshopId: string;
  customerEmail?: string | null;
  plan: "monthly" | "yearly";
}) {
  const subscription = await prisma.subscription.findUnique({
    where: {
      workshopId: input.workshopId,
    },
  });

  if (!subscription) {
    throw new Error("Workshop subscription record was not found.");
  }

  if (subscription.status === "ACTIVE") {
    throw new Error("This workshop already has an active subscription.");
  }

  const stripe = getStripe();
  const priceId = getPriceId(input.plan);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
  }

  return stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${appUrl}/billing?checkout=success`,
    cancel_url: `${appUrl}/billing?checkout=cancelled`,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: subscription.stripeCustomerId ?? undefined,
    customer_email: subscription.stripeCustomerId
      ? undefined
      : input.customerEmail ?? undefined,
    metadata: {
      workshopId: input.workshopId,
      plan: input.plan,
    },
    subscription_data: {
      metadata: {
        workshopId: input.workshopId,
        plan: input.plan,
      },
    },
    client_reference_id: input.workshopId,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });
}

function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "TRIAL";
    case "active":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "canceled":
    case "incomplete_expired":
      return "CANCELLED";
    default:
      return "CANCELLED";
  }
}

export async function syncSubscriptionFromCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  const workshopId =
    session.metadata?.workshopId ?? session.client_reference_id ?? null;
  const stripeCustomerId =
    typeof session.customer === "string" ? session.customer : null;
  const stripeSubscriptionId =
    typeof session.subscription === "string" ? session.subscription : null;

  if (!workshopId || !stripeCustomerId || !stripeSubscriptionId) {
    return;
  }

  await prisma.subscription.update({
    where: {
      workshopId,
    },
    data: {
      status: "ACTIVE",
      stripeCustomerId,
      stripeSubscriptionId,
    },
  });
}

export async function syncSubscriptionFromStripeSubscription(
  stripeSubscription: Stripe.Subscription,
) {
  const workshopId = stripeSubscription.metadata.workshopId;

  if (!workshopId) {
    return;
  }

  await prisma.subscription.update({
    where: {
      workshopId,
    },
    data: {
      status: mapStripeSubscriptionStatus(stripeSubscription.status),
      stripeCustomerId:
        typeof stripeSubscription.customer === "string"
          ? stripeSubscription.customer
          : null,
      stripeSubscriptionId: stripeSubscription.id,
    },
  });
}

export function isProvisionedSubscriptionStatus(status: SubscriptionStatus) {
  return ACTIVE_SUBSCRIPTION_STATUSES.has(status);
}
