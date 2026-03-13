export const businessDetails = {
  productName: "Workshop Buddy",
  legalEntityName: "Workshop Buddy Ltd",
  contactEmail: "support@workshopbuddy.co.uk",
  registeredAddress: "[Add registered business address]",
  jurisdiction: "England and Wales",
} as const;

export const billingCopy = {
  renewalNotice: "Subscriptions renew automatically until cancelled.",
  portalNotice: "Billing is managed through the Stripe Customer Portal.",
  cancellationNotice: "You can cancel your subscription from the billing portal.",
  refundNotice:
    "Refund requests are handled in line with our refund policy and applicable consumer law.",
} as const;

export const cookieConsentConfig = {
  hasNonEssentialCookies: false,
  bannerEnabled: false,
} as const;
