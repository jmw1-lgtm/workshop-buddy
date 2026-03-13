import { LegalPage } from "@/components/legal/legal-page";
import { billingCopy, businessDetails } from "@/lib/site-config";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of service"
      summary="These terms explain how workshops may access and use Workshop Buddy. Replace placeholder company details before launch."
    >
      <h2>1. Who we are</h2>
      <p>
        Workshop Buddy is provided by {businessDetails.legalEntityName}. Contact us at{" "}
        {businessDetails.contactEmail}. Registered address: {businessDetails.registeredAddress}.
      </p>

      <h2>2. Service access</h2>
      <p>
        Workshop Buddy is a subscription software service for independent workshops.
        Access is provided to authorised users linked to a workshop account.
      </p>

      <h2>3. Subscriptions and billing</h2>
      <ul>
        <li>{billingCopy.renewalNotice}</li>
        <li>{billingCopy.portalNotice}</li>
        <li>{billingCopy.cancellationNotice}</li>
        <li>{billingCopy.refundNotice}</li>
      </ul>

      <h2>4. Customer data</h2>
      <p>
        You are responsible for the accuracy of the customer, vehicle, and job data
        entered into your workshop account and for using the service lawfully.
      </p>

      <h2>5. Availability and changes</h2>
      <p>
        We may improve, maintain, or update the service from time to time. We will act
        reasonably to minimise disruption, but uninterrupted availability is not guaranteed.
      </p>

      <h2>6. Governing law</h2>
      <p>
        These terms are governed by the laws of {businessDetails.jurisdiction}.
      </p>
    </LegalPage>
  );
}
