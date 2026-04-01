import { SiteFooter } from "@/components/marketing/site-footer";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { SiteHeader } from "@/components/marketing/site-header";
import { createMarketingMetadata } from "@/lib/marketing-metadata";

export const metadata = createMarketingMetadata({
  path: "/workshop-scheduling-software",
  title: "Workshop Scheduling Software",
  description:
    "Workshop scheduling software for independent garages that need to book jobs clearly, manage workshop time, and keep the front desk organised throughout the day.",
  keywords: [
    "workshop scheduling software",
    "garage scheduling software",
    "workshop booking software",
    "garage diary software",
  ],
});

export default function WorkshopSchedulingSoftwarePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <SeoLandingPage
        pageTitle="Workshop scheduling software"
        eyebrow="Scheduling software for busy workshops"
        intro="Workshop scheduling software should help the front desk see what is booked, what can still fit in, and where the day is likely to become overloaded. Workshop Buddy gives independent garages a clearer way to schedule work without relying on a paper diary."
        supportingText="The focus here is scheduling: booking jobs into the diary, seeing upcoming workload, and moving work quickly when customers are late or plans change."
        heroImageSrc="/screenshots/next-available.png"
        heroImageAlt="Workshop Buddy workshop scheduling software screenshot"
        heroBulletPoints={[
          "Book jobs into a clear day view",
          "See upcoming workload and available time",
          "Move bookings when the day changes",
          "Keep each booking linked to the job card",
        ]}
        benefits={[
          {
            title: "Book faster",
            description: "Add work into the diary without the back-and-forth of paper notes.",
            icon: "event_available",
          },
          {
            title: "See capacity clearly",
            description: "Spot space in the day before overbooking the workshop.",
            icon: "visibility",
          },
          {
            title: "Reschedule quickly",
            description: "Move work when customers are late or plans change.",
            icon: "open_with",
          },
          {
            title: "Keep context attached",
            description: "Scheduling stays tied to the customer, vehicle, and job card.",
            icon: "link",
          },
        ]}
        benefitsIntro="This page is focused on the scheduling problem: capacity, visibility, and quick changes at the reception desk."
        features={[
          {
            title: "Day-view workshop diary",
            description: "See the workshop day in a clear schedule so reception can understand capacity and upcoming jobs at a glance.",
            icon: "calendar_month",
          },
          {
            title: "Next available slot visibility",
            description: "See the next available space and book enquiries more confidently without guessing where work can fit.",
            icon: "schedule",
          },
          {
            title: "Simple job movement",
            description: "Reschedule jobs quickly when the workshop day changes, instead of rubbing out and rewriting a paper diary.",
            icon: "swap_horiz",
          },
          {
            title: "Linked job details",
            description: "Each scheduled booking stays connected to the customer, vehicle, and job card, so the schedule is not floating separately from the work.",
            icon: "assignment",
          },
        ]}
        workflowEyebrow="Scheduling flow"
        workflowTitle="From enquiry to booked slot in a simple workflow"
        workflowDescription="The front desk can place work into the diary, keep it accurate through the day, and open the related job details without switching tools."
        workflowSteps={[
          {
            title: "Take the booking",
            description: "Add the customer, vehicle, and job details, then place the work into the diary where it fits best.",
          },
          {
            title: "Adjust the schedule as the day moves",
            description: "Shift bookings when a job overruns or a customer changes plans, keeping the diary accurate throughout the day.",
          },
          {
            title: "Keep the job moving",
            description: "Open the job card from the scheduled booking so reception and the workshop stay aligned on the same job details.",
          },
        ]}
        screensEyebrow="Scheduling screens"
        screensTitle="The views that help reception manage workshop time"
        screensDescription="These screens are the most relevant ones for garages looking specifically for workshop scheduling software."
        screens={[
          {
            title: "Next available slot",
            description: "Reception can see where there is room to book more work without scanning a paper diary line by line.",
            imageSrc: "/screenshots/next-available.png",
            imageAlt: "Workshop Buddy next available slot screenshot",
          },
          {
            title: "Upcoming workload",
            description: "A clear view of the upcoming jobs helps the front desk see what is booked and what is coming next.",
            imageSrc: "/screenshots/upcoming.png",
            imageAlt: "Workshop Buddy upcoming workload screenshot",
          },
        ]}
        whoItsForTitle="A good fit for garages that need clearer workshop capacity"
        whoItsForDescription="This page is most relevant for workshops where the main problem is fitting jobs into the day and keeping the schedule accurate."
        whoItsFor={[
          "Independent garages that want a clearer way to book and reschedule work throughout the day.",
          "Reception teams that need to see available time quickly before promising jobs to customers.",
          "Vehicle workshops replacing a paper diary with something easier to keep accurate when plans shift.",
        ]}
        faqTitle="Questions about workshop scheduling software"
        faqDescription="These answers focus on how Workshop Buddy handles booking visibility, rescheduling, and linked job information."
        faqs={[
          {
            question: "Does Workshop Buddy help with workshop scheduling?",
            answer:
              "Yes. The diary is built to help workshops book jobs, see the day clearly, and move bookings when plans change.",
          },
          {
            question: "Is it more like a diary or a full workshop management system?",
            answer:
              "It is a lightweight workshop management system with a strong focus on the diary, scheduling, and the front-desk workflow for independent garages.",
          },
          {
            question: "Can I see available time before booking another job?",
            answer:
              "Yes. Workshop Buddy includes visibility into upcoming workload and next available booking space so reception can schedule work more clearly.",
          },
          {
            question: "Does scheduling stay linked to the actual job?",
            answer:
              "Yes. Scheduled work remains tied to the customer, vehicle, and job card rather than sitting in a separate calendar tool.",
          },
        ]}
        ctaTitle="Start a free trial and give reception a clearer booking schedule"
        ctaDescription="Book jobs faster, see available time more clearly, and keep workshop scheduling tied to the rest of the job workflow."
        ctaSecondaryLabel="See the main product overview"
        ctaSecondaryHref="/"
        primaryCtaLabel="Start free scheduling software trial"
        relatedPagesTitle="Related pages for workshop scheduling research"
        relatedPagesDescription="If you are comparing diary tools and job organisation tools, these pages cover the connected parts of the workflow."
        relatedPages={[
          {
            href: "/garage-booking-diary-software",
            title: "Garage booking diary software",
            description: "A more diary-specific page for workshops moving away from a paper booking book.",
            ctaLabel: "Read booking diary page",
          },
          {
            href: "/garage-management-software",
            title: "Garage management software",
            description: "See the broader overview covering scheduling, records, and job cards together.",
            ctaLabel: "Read garage management page",
          },
          {
            href: "/garage-job-card-software",
            title: "Garage job card software",
            description: "See how scheduled jobs connect directly to printable job cards and workshop notes.",
            ctaLabel: "Read job card page",
          },
        ]}
        homepageCardTitle="See the full Workshop Buddy product page"
        homepageCardDescription="Return to the homepage for the main pricing, screenshots, and overall product summary."
        homepageCardCtaLabel="Visit main product page"
      />
      <SiteFooter />
    </div>
  );
}
