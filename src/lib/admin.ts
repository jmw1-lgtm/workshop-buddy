import { redirect } from "next/navigation";

import { getCurrentClerkUser } from "@/lib/workshop";
import { isEmailInAdminAllowlist } from "@/lib/admin-permissions";

const configuredAdminEmails =
  process.env.ADMIN_EMAIL_ALLOWLIST?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean) ?? [];

export const adminEmailAllowlist = configuredAdminEmails;

export function isAdminEmail(emailAddress?: string | null) {
  return isEmailInAdminAllowlist(emailAddress, adminEmailAllowlist);
}

export async function requireAdminUser() {
  const user = await getCurrentClerkUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!isAdminEmail(user.emailAddress)) {
    redirect("/dashboard");
  }

  return user;
}
