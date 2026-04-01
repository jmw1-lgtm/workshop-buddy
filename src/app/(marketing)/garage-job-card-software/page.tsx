import { SiteFooter } from "@/components/marketing/site-footer";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { SiteHeader } from "@/components/marketing/site-header";
import { createMarketingMetadata } from "@/lib/marketing-metadata";

export const metadata = createMarketingMetadata({
  path: "/garage-job-card-software",
  title: "Garage Job Card Software",
  description:
    "Garage job card software for independent garages that need clear printable job cards, linked customer and vehicle details, and a simple way to keep workshop jobs organised.",
  keywords: [
    "garage job card software",
    "workshop job card software",
    "printable garage job cards",
    "garage worksheet software",
  ],
});

export default function GarageJobCardSoftwarePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <SeoLandingPage
        pageTitle="Garage job card software"
        eyebrow="Job card software for workshop teams"
        intro="Garage job card software should keep the job details clear for both reception and the workshop. Workshop Buddy helps independent garages create printable job cards that stay linked to the booking, customer, and vehicle record."
        supportingText="This page focuses on job organisation and workshop paperwork: keeping the work details in one place, printing when needed, and avoiding separate handwritten sheets that get lost or duplicated."
        heroImageSrc="/screenshots/job-card2.png"
        heroImageAlt="Workshop Buddy garage job card software screenshot"
        heroBulletPoints={[
          "Create clear printable job cards",
          "Keep customer and vehicle details with each job",
          "Add notes and track the job through the workflow",
          "Open the job card directly from the diary",
        ]}
        benefits={[
          {
            title: "Keep jobs clear",
            description: "Give the workshop a consistent job card for every booking.",
            icon: "description",
          },
          {
            title: "Print when needed",
            description: "Use printable worksheets for technicians who still prefer paper.",
            icon: "print",
          },
          {
            title: "Reduce missing details",
            description: "Keep customer and vehicle information attached to the card.",
            icon: "fact_check",
          },
          {
            title: "Stay organised",
            description: "Manage jobs in one system instead of separate notes and files.",
            icon: "folder_managed",
          },
        ]}
        benefitsIntro="This page is about job cards specifically: clearer paperwork, fewer missing details, and a smoother link between reception and the workshop floor."
        features={[
          {
            title: "Printable job cards",
            description: "Create job cards that can be printed for technicians while keeping the same job details available digitally at the front desk.",
            icon: "print_add",
          },
          {
            title: "Linked customer and vehicle records",
            description: "Each job card stays connected to the relevant customer and vehicle details, reducing the need to copy the same information multiple times.",
            icon: "badge",
          },
          {
            title: "Status-friendly workflow",
            description: "Keep the job moving with a simple workflow that follows the booking from arrival through completion.",
            icon: "task_alt",
          },
          {
            title: "Notes kept with the job",
            description: "Workshop notes stay on the job card so the team can keep important details in one place.",
            icon: "sticky_note_2",
          },
        ]}
        workflowEyebrow="Job card workflow"
        workflowTitle="Capture the job once, then keep it organised"
        workflowDescription="The booking and the job card stay part of the same workflow, which reduces rekeying and keeps the paperwork consistent."
        workflowSteps={[
          {
            title: "Create the booking",
            description: "Start with the diary booking and capture the customer, vehicle, and work details once.",
          },
          {
            title: "Open and update the job card",
            description: "Use the job card to hold the important job information and keep the workshop team aligned.",
          },
          {
            title: "Print if the workshop needs paper",
            description: "Produce a printable worksheet while keeping the same job card available digitally for reception.",
          },
        ]}
        screensEyebrow="Job card view"
        screensTitle="The parts of Workshop Buddy that keep workshop paperwork tidy"
        screensDescription="These screens are the most relevant ones for garages comparing printable job card software."
        screens={[
          {
            title: "Job card view",
            description: "Keep the core information for each job in one place instead of spreading it across paper sheets and notes.",
            imageSrc: "/screenshots/job-card2.png",
            imageAlt: "Workshop Buddy job card screenshot",
          },
          {
            title: "Customer records behind each job",
            description: "Customer history and vehicle details remain easy to find while the job card is being managed.",
            imageSrc: "/screenshots/customers2.png",
            imageAlt: "Workshop Buddy customer records screenshot",
          },
        ]}
        whoItsForTitle="Useful for workshops that still rely on paper job sheets"
        whoItsForDescription="This page is most relevant for garages that want printable job cards but also want the front desk to stay organised digitally."
        whoItsFor={[
          "Independent garages that still rely on printed worksheets but want the front desk to stay digital and organised.",
          "Workshops that want job cards tied directly to the booking, customer, and vehicle details.",
          "Garage teams looking for a simpler, more practical alternative to loose paper job sheets and handwritten notes.",
        ]}
        faqTitle="Questions about garage job card software"
        faqDescription="These answers focus on printable job cards, linked records, and how the job card fits into the existing Workshop Buddy workflow."
        faqs={[
          {
            question: "Can Workshop Buddy print job cards?",
            answer:
              "Yes. Printable job cards are part of the workflow, so workshops can still use paper where it suits the team.",
          },
          {
            question: "Do job cards include customer and vehicle information?",
            answer:
              "Yes. Job cards are linked to the customer and vehicle records, helping the workshop keep the correct details with the job.",
          },
          {
            question: "Is this suitable for small garages?",
            answer:
              "Yes. The product is aimed at small independent garages that want a straightforward job-card workflow rather than a complex dealership system.",
          },
          {
            question: "Does the job card work with the diary?",
            answer:
              "Yes. The diary and job card are part of the same workflow, so reception can open the job directly from the booking.",
          },
        ]}
        ctaTitle="Start a free trial and tidy up workshop job paperwork"
        ctaDescription="Give reception and technicians a clearer job-card workflow without losing the option to print worksheets."
        ctaSecondaryLabel="See the diary workflow"
        ctaSecondaryHref="/garage-booking-diary-software"
        primaryCtaLabel="Start free job card software trial"
        relatedPagesTitle="Related pages for job card and diary workflows"
        relatedPagesDescription="If you are comparing job-card tools with scheduling and diary tools, these pages show how the pieces fit together."
        relatedPages={[
          {
            href: "/garage-booking-diary-software",
            title: "Garage booking diary software",
            description: "See the diary side of the workflow that feeds jobs directly into the job card.",
            ctaLabel: "Read booking diary page",
          },
          {
            href: "/workshop-scheduling-software",
            title: "Workshop scheduling software",
            description: "See how bookings are scheduled and rescheduled before the job card is worked on.",
            ctaLabel: "Read scheduling page",
          },
          {
            href: "/garage-management-software",
            title: "Garage management software",
            description: "Return to the broader garage software page covering records, diary management, and job cards together.",
            ctaLabel: "Read garage software page",
          },
        ]}
        homepageCardTitle="See the full Workshop Buddy overview"
        homepageCardDescription="Go back to the main marketing page for the wider product view, pricing, and screenshots."
        homepageCardCtaLabel="Visit homepage"
      />
      <SiteFooter />
    </div>
  );
}
