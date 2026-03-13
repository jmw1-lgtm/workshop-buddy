import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";

export type CurrentWorkshopContext = {
  clerkUserId: string;
  emailAddress: string | null;
  workshopId: string;
  workshopName: string;
  workshopSlug: string;
  membershipId: string;
};

export async function getCurrentClerkUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  return {
    clerkUserId: userId,
    emailAddress: user?.primaryEmailAddress?.emailAddress ?? null,
  };
}

export async function getCurrentMembership() {
  const authUser = await getCurrentClerkUser();

  if (!authUser) {
    return null;
  }

  const membership = await prisma.membership.findUnique({
    where: {
      clerkUserId: authUser.clerkUserId,
    },
    include: {
      workshop: true,
    },
  });

  if (!membership) {
    return {
      ...authUser,
      membership: null,
    };
  }

  return {
    ...authUser,
    membership,
  };
}

export async function getCurrentWorkshopId() {
  const result = await getCurrentMembership();

  return result?.membership?.workshopId ?? null;
}

export async function requireCurrentWorkshop(): Promise<CurrentWorkshopContext> {
  const result = await getCurrentMembership();

  if (!result) {
    redirect("/sign-in");
  }

  if (!result.membership) {
    redirect("/onboarding");
  }

  return {
    clerkUserId: result.clerkUserId,
    emailAddress: result.emailAddress,
    membershipId: result.membership.id,
    workshopId: result.membership.workshop.id,
    workshopName: result.membership.workshop.name,
    workshopSlug: result.membership.workshop.slug,
  };
}
