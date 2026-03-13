import { IN_APP_ACCOUNT_PATH } from "@/lib/paths";

const baseNavigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "space_dashboard",
    description: "Daily workshop overview",
  },
  {
    href: "/diary",
    label: "Diary",
    icon: "calendar_month",
    description: "Schedule and move jobs",
  },
  {
    href: "/customers",
    label: "Customers",
    icon: "groups",
    description: "Search people and vehicles",
  },
  {
    href: IN_APP_ACCOUNT_PATH,
    label: "Account",
    icon: "credit_card",
    description: "Plans and subscription",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "settings",
    description: "Workshop preferences",
  },
] as const;

export function getAppNavigation(options?: { includeAdmin?: boolean }) {
  if (!options?.includeAdmin) {
    return baseNavigation;
  }

  return [
    ...baseNavigation,
    {
      href: "/admin",
      label: "Admin",
      icon: "shield_person",
      description: "Internal account view",
    },
  ] as const;
}
