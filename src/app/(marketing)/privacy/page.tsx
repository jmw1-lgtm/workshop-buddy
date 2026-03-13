import { LegalPage } from "@/components/legal/legal-page";
import { businessDetails } from "@/lib/site-config";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy policy"
      summary="This page explains the personal data Workshop Buddy processes. Replace placeholder company details before launch."
    >
      <h2>1. Controller details</h2>
      <p>
        {businessDetails.legalEntityName} is the controller for the data described in
        this policy. Contact: {businessDetails.contactEmail}. Registered address:{" "}
        {businessDetails.registeredAddress}.
      </p>

      <h2>2. Data we process</h2>
      <ul>
        <li>Account and workshop profile details</li>
        <li>Customer contact details entered by your workshop</li>
        <li>Vehicle and booking information entered into the service</li>
        <li>Billing details processed by Stripe</li>
      </ul>

      <h2>3. Why we process it</h2>
      <p>
        We process data to provide the workshop diary, customer records, job cards,
        subscription billing, and support for your account.
      </p>

      <h2>4. Processors</h2>
      <p>
        Workshop Buddy uses service providers including Clerk for authentication,
        Supabase for database hosting, and Stripe for payment processing.
      </p>

      <h2>5. Retention</h2>
      <p>
        We retain data for as long as needed to provide the service, meet legal
        obligations, and resolve disputes. Update this section with your final retention
        periods before launch.
      </p>

      <h2>6. Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete, or
        restrict the use of personal data. Contact {businessDetails.contactEmail} for requests.
      </p>
    </LegalPage>
  );
}
