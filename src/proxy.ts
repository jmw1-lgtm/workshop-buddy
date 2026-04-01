import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { marketingLandingPages } from "@/lib/marketing-pages";

const publicPageRoutes = [
  "/",
  "/terms",
  "/privacy",
  ...marketingLandingPages.map((page) => page.href),
];

const isPublicRoute = createRouteMatcher([
  // Public marketing pages stay accessible without auth.
  ...publicPageRoutes,
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/stripe/webhook",
  "/api/webhooks/stripe",
  "/api/health",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
