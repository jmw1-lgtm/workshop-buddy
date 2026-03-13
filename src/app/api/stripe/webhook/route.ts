import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import {
  syncSubscriptionFromCheckoutSession,
  syncSubscriptionFromStripeSubscription,
} from "@/services/subscriptions";
import { getStripe } from "@/services/stripe";

export async function POST(request: Request) {
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 400 },
    );
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to verify webhook.",
      },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      await syncSubscriptionFromCheckoutSession(
        event.data.object as Stripe.Checkout.Session,
      );
      break;
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscriptionFromStripeSubscription(
        event.data.object as Stripe.Subscription,
      );
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true, type: event.type });
}
