import { LegalPage } from "@/components/legal/legal-page";
import { businessDetails } from "@/lib/site-config";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy policy"
      summary="This policy explains how Workshop Buddy processes personal data when users access and use the platform."
    >
      <h2>1. Introduction</h2>
      <p>
        This privacy policy explains how Workshop Buddy handles personal data when you
        access, use, or administer the Workshop Buddy platform. It is intended to give
        workshop owners and users a clear overview of how data is processed in connection
        with the service.
      </p>

      <h2>2. Data controller</h2>
      <p>
        {businessDetails.legalEntityName} is the data controller for account, service
        administration, and billing information processed in connection with Workshop Buddy.
        If you have questions about this policy or want to exercise your data rights,
        contact {businessDetails.contactEmail}. Our registered business address is{" "}
        {businessDetails.registeredAddress}.
      </p>

      <h2>3. Data we collect</h2>
      <ul>
        <li>Account information such as names, email addresses, and workshop details</li>
        <li>
          Workshop operational data entered by users, including customer details, vehicle
          records, bookings, and job notes
        </li>
        <li>Billing information and payment-related details handled through Stripe</li>
        <li>Technical and usage data needed to operate, secure, and support the platform</li>
      </ul>

      <h2>4. How data is used</h2>
      <p>
        We use personal data to provide and operate Workshop Buddy, manage subscriptions
        and billing, provide customer support, and maintain the reliability, availability,
        and security of the platform.
      </p>

      <h2>5. Data roles</h2>
      <p>
        Workshops using Workshop Buddy act as the data controller for the customer,
        vehicle, and job information they choose to store in the platform. In relation to
        that workshop operational data, Workshop Buddy acts as a data processor on behalf
        of the workshop. For account administration and billing information about our own
        customers, Workshop Buddy acts as data controller.
      </p>

      <h2>6. Third-party processors</h2>
      <p>
        Workshop Buddy uses a small number of trusted service providers to help deliver
        the service. These include Clerk for authentication, Supabase for database
        hosting, and Stripe for payment processing. These providers may process personal
        data on our behalf as part of providing their services.
      </p>

      <h2>7. Data retention</h2>
      <p>
        We retain personal data for as long as necessary to provide the service, manage
        subscriptions, comply with legal obligations, resolve disputes, and enforce our
        agreements. Retention periods may vary depending on the type of data and the legal
        or operational purpose involved.
      </p>

      <h2>8. Security</h2>
      <p>
        We use reasonable technical and organisational measures designed to help protect
        personal data against unauthorised access, loss, misuse, or disclosure. No system
        can be guaranteed completely secure, but protecting customer data is an important
        part of how we operate the platform.
      </p>

      <h2>9. User rights</h2>
      <p>
        Depending on the circumstances, individuals may have rights under UK GDPR,
        including the right to access, correct, delete, or restrict the processing of
        personal data. Requests can be sent to {businessDetails.contactEmail}.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this privacy policy from time to time. The latest version will
        always be published on the website, and continued use of the service after an
        update means the revised policy will apply.
      </p>
    </LegalPage>
  );
}
