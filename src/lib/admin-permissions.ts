export function isEmailInAdminAllowlist(
  emailAddress: string | null | undefined,
  allowlist: readonly string[],
) {
  if (!emailAddress) {
    return false;
  }

  return allowlist.includes(emailAddress.toLowerCase());
}
