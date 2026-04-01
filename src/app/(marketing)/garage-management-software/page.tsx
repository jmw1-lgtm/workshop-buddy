import { SiteFooter } from "@/components/marketing/site-footer";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { SiteHeader } from "@/components/marketing/site-header";
import { createMarketingMetadata } from "@/lib/marketing-metadata";

export const metadata = createMarketingMetadata({
  path: "/garage-management-software",
  title: "Garage Management Software",
  description:
    "Garage management software for independent garages that need a simple workshop diary, job cards, customer records, and vehicle records without dealership-level complexity.",
  keywords: [
    "garage management software",
    "independent garage software",
    "workshop management software",
    "garage software uk",
  ],
});

export default function GarageManagementSoftwarePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <SeoLandingPage
        pageTitle="Garage management software"
        eyebrow="Software for independent garages"
        intro="Garage management software for independent garages should make the working day easier to organise, not add more admin. Workshop Buddy keeps the workshop diary, customer records, vehicle records, and job cards together in one clear workflow."
        supportingText="If your reception desk is still juggling a paper diary, handwritten worksheets, and separate customer notes, Workshop Buddy gives you a simpler system to run the day without dealership-level complexity."
        heroImageSrc="/screenshots/diary-main-tab2.png"
        heroImageAlt="Workshop Buddy garage management software diary screenshot"
        heroBulletPoints={[
          "Workshop diary for daily bookings and arrivals",
          "Customer and vehicle records kept with each job",
          "Printable job cards for workshop paperwork",
          "14-day free trial with no card required",
        ]}
        benefits={[
          {
            title: "Run the day clearly",
            description: "Keep bookings, arrivals, and workload visible for reception.",
            icon: "calendar_month",
          },
          {
            title: "Keep records together",
            description: "Store customers, vehicles, and job details in the same workflow.",
            icon: "contacts",
          },
          {
            title: "Stay practical",
            description: "Use printable job cards when technicians still want paper.",
            icon: "print",
          },
          {
            title: "Move quickly",
            description: "Book jobs faster than updating a paper diary by hand.",
            icon: "bolt",
          },
        ]}
        benefitsIntro="This page is about the overall system: the diary, records, and job cards working together so a small workshop can stay organised."
        features={[
          {
            title: "Workshop diary",
            description: "See booked jobs in a clear day view so the front desk can organise the workshop without relying on a whiteboard or paper planner.",
            icon: "calendar_view_day",
          },
          {
            title: "Customer records",
            description: "Keep repeat customers, contact details, and past work connected to the jobs your team is already handling.",
            icon: "person_search",
          },
          {
            title: "Vehicle records",
            description: "Store registrations and vehicle details with the customer record so jobs are easier to book and track accurately.",
            icon: "directions_car",
          },
          {
            title: "Job cards",
            description: "Create job cards for the workshop team and keep notes, status changes, and printable paperwork tied to the same job.",
            icon: "description",
          },
        ]}
        workflowEyebrow="How it works"
        workflowTitle="A simple workflow from booking through completion"
        workflowDescription="The system is designed around the daily reception workflow: book the work, keep the day organised, and keep records tidy as jobs move through the workshop."
        workflowSteps={[
          {
            title: "Book work into the diary",
            description: "Add the customer, vehicle, and job details, then place the booking into the workshop diary in a few steps.",
          },
          {
            title: "Manage the working day",
            description: "Move jobs when plans change, keep arrivals visible, and give reception a clear view of the day ahead.",
          },
          {
            title: "Keep the paperwork organised",
            description: "Open the job card, update progress, and print a worksheet when the workshop needs paper on the ramp.",
          },
        ]}
        screensEyebrow="Product view"
        screensTitle="A practical view of the daily garage workflow"
        screensDescription="These screens show how the product brings bookings, records, and workshop paperwork together for independent garages."
        screens={[
          {
            title: "Workshop diary overview",
            description: "The diary gives the front desk a simple overview of what is booked and where there is space for more work.",
            imageSrc: "/screenshots/diary-main-tab2.png",
            imageAlt: "Workshop Buddy workshop diary screenshot",
          },
          {
            title: "Customer records",
            description: "Customer and vehicle history stays accessible without digging through separate systems or paper files.",
            imageSrc: "/screenshots/customers2.png",
            imageAlt: "Workshop Buddy customer records screenshot",
          },
        ]}
        whoItsForTitle="Best suited to small garages that want less admin"
        whoItsForDescription="This is a good fit for workshops that want a straightforward operational system for reception and daily organisation."
        whoItsFor={[
          "Independent garages that want one simple system for bookings, customers, vehicles, and job cards.",
          "Small vehicle workshops with 1 to 10 staff that need the receptionist workflow to stay fast and easy to follow.",
          "Garages moving away from a paper diary or whiteboard but not looking for a full dealership management system.",
        ]}
        faqTitle="Questions about garage management software for small workshops"
        faqDescription="These answers focus on the current Workshop Buddy feature set and the type of garage it is built for."
        faqs={[
          {
            question: "Is Workshop Buddy built for independent garages?",
            answer:
              "Yes. Workshop Buddy is designed for small independent garages and vehicle workshops that need a clear daily system without dealership-level complexity.",
          },
          {
            question: "What does the software include?",
            answer:
              "The current core workflow includes a workshop diary, job cards, customer records, and vehicle records so reception can manage the day in one place.",
          },
          {
            question: "Can the workshop still use printed paperwork?",
            answer:
              "Yes. Job cards can still be printed, which is useful if technicians prefer working from paper on the workshop floor.",
          },
          {
            question: "How do workshops start using it?",
            answer:
              "You can start with a 14-day free trial and begin using the core workflow without entering card details first.",
          },
        ]}
        ctaTitle="Start a free trial and move the garage off the paper diary"
        ctaDescription="Use one straightforward system for the workshop diary, customer records, vehicle records, and job cards."
        ctaSecondaryLabel="See Workshop Buddy pricing"
        ctaSecondaryHref="/#pricing"
        primaryCtaLabel="Start free garage software trial"
        relatedPagesTitle="Compare related Workshop Buddy software pages"
        relatedPagesDescription="If you are researching a specific part of the workflow, these pages go deeper into scheduling, booking diaries, and job cards."
        relatedPages={[
          {
            href: "/workshop-scheduling-software",
            title: "Workshop scheduling software",
            description: "See how Workshop Buddy helps reception book work, manage capacity, and reschedule jobs during the day.",
            ctaLabel: "View scheduling software page",
          },
          {
            href: "/garage-job-card-software",
            title: "Garage job card software",
            description: "Read more about printable job cards, job notes, and keeping workshop paperwork tied to each booking.",
            ctaLabel: "View job card software page",
          },
          {
            href: "/garage-booking-diary-software",
            title: "Garage booking diary software",
            description: "Explore the diary-focused page for workshops replacing a handwritten booking diary.",
            ctaLabel: "View booking diary software page",
          },
        ]}
        homepageCardTitle="See the full Workshop Buddy overview"
        homepageCardDescription="Go back to the homepage for the broader product summary, screenshots, pricing, and signup route."
        homepageCardCtaLabel="Visit the homepage"
      />
      <SiteFooter />
    </div>
  );
}
