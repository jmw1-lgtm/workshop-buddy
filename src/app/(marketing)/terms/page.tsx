import { LegalPage } from "@/components/legal/legal-page";
import { billingCopy, businessDetails } from "@/lib/site-config";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of service"
      summary="These terms explain how independent workshops may access and use Workshop Buddy as a subscription software service."
    >
      <h2>1. Who we are</h2>
      <p>
        Workshop Buddy is operated by {businessDetails.legalEntityName}. If you need
        to contact us about these terms or the service, please email{" "}
        {businessDetails.contactEmail}. Our registered business address is{" "}
        {businessDetails.registeredAddress}.
      </p>

      <h2>2. Service description</h2>
      <p>
        Workshop Buddy is a cloud-based workshop management platform designed for
        independent garages and vehicle workshops. The service helps workshops manage
        bookings, customers, vehicles, diary scheduling, and job records through a web
        application.
      </p>

      <h2>3. Accounts and access</h2>
      <p>
        You must provide accurate and up-to-date information when creating or using a
        Workshop Buddy account. You are responsible for access to your workshop account,
        including keeping login credentials secure and ensuring that only authorised
        people use the service on behalf of your business.
      </p>

      <h2>4. Subscription and billing</h2>
      <p>
        Workshop Buddy is provided on a subscription basis. Subscriptions renew
        automatically unless cancelled. Payments are processed through Stripe. Where
        available, customers can manage their subscription through the Stripe billing
        portal, including updating payment details and reviewing billing history.
        Cancellation takes effect at the end of the current billing period unless stated
        otherwise at the point of purchase.
      </p>
      <ul>
        <li>{billingCopy.renewalNotice}</li>
        <li>{billingCopy.portalNotice}</li>
        <li>{billingCopy.cancellationNotice}</li>
        <li>{billingCopy.refundNotice}</li>
      </ul>

      <h2>5. Free trials</h2>
      <p>
        We may offer a free trial for a limited period. During or after the trial,
        access to parts of the service may be restricted until a paid subscription is
        started. We may change or withdraw trial offers at any time.
      </p>

      <h2>6. Customer data</h2>
      <p>
        Your workshop remains responsible for the accuracy, quality, and legality of the
        customer, vehicle, and job information stored in Workshop Buddy. You must ensure
        that you have the right to store and use that information and that your use of
        the service complies with applicable data protection and privacy laws.
      </p>

      <h2>7. Acceptable use</h2>
      <p>
        You must not misuse the service. This includes attempting to disrupt, damage, or
        interfere with Workshop Buddy, trying to gain unauthorised access, using the
        service for unlawful purposes, or uploading content that is unlawful, harmful, or
        fraudulent.
      </p>

      <h2>8. Service availability</h2>
      <p>
        We aim to provide a reliable service and may improve, maintain, or update
        Workshop Buddy from time to time. However, the service is provided on an
        ongoing SaaS basis and we do not guarantee that it will always be available,
        uninterrupted, or free from errors.
      </p>

      <h2>9. Intellectual property</h2>
      <p>
        All rights in the Workshop Buddy software, platform functionality, branding,
        design, and related materials remain the property of {businessDetails.legalEntityName}
        or its licensors. These terms do not transfer ownership of the service or any
        related intellectual property to you.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        Workshop Buddy is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
        To the fullest extent permitted by law, we exclude liability for indirect,
        incidental, or consequential loss. Our total liability arising out of or in
        connection with the service will be limited to the amount paid by you for the
        service in the 12 months before the event giving rise to the claim.
      </p>

      <h2>11. Termination</h2>
      <p>
        We may suspend or terminate access to the service if you breach these terms, fail
        to pay amounts due, or use the service in a way that creates risk for us, other
        users, or the platform. You may stop using the service at any time, and may cancel
        your subscription in line with your billing terms.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These terms are governed by the laws of {businessDetails.jurisdiction}.
      </p>

      <h2>13. Updates to these terms</h2>
      <p>
        We may update these terms from time to time. If we do, the updated version will
        apply from the date it is published on our website or otherwise notified to you.
        Continued use of Workshop Buddy after an update takes effect means you accept the
        revised terms.
      </p>
    </LegalPage>
  );
}
