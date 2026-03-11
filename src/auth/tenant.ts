import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type TenantContext = {
  clerkUserId: string;
  emailAddress: string | null;
  workshopId: string | null;
  workshopSlug: string | null;
};

type SessionClaims = {
  metadata?: {
    workshopId?: string;
    workshopSlug?: string;
  };
};

export async function requireTenantContext(): Promise<TenantContext> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const metadata = (sessionClaims as SessionClaims | null)?.metadata;

  return {
    clerkUserId: userId,
    emailAddress: user?.primaryEmailAddress?.emailAddress ?? null,
    workshopId: metadata?.workshopId ?? null,
    workshopSlug: metadata?.workshopSlug ?? null,
  };
}
