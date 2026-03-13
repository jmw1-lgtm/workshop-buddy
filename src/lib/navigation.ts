import { IN_APP_ACCOUNT_PATH } from "@/lib/paths";

export const appNavigation = [
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
