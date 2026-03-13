export {
  getCurrentMembership,
  getCurrentWorkshopId,
  requireCurrentWorkshop as requireTenantContext,
} from "@/lib/workshop";

import { requireCurrentWorkshop } from "@/lib/workshop";
import { requireWorkshopSubscription } from "@/services/subscriptions";

export async function requireActiveTenantContext() {
  const tenant = await requireCurrentWorkshop();

  await requireWorkshopSubscription(tenant.workshopId);

  return tenant;
}
