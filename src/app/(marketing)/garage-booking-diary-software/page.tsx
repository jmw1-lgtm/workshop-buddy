import { SiteFooter } from "@/components/marketing/site-footer";
import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { SiteHeader } from "@/components/marketing/site-header";
import { createMarketingMetadata } from "@/lib/marketing-metadata";

export const metadata = createMarketingMetadata({
  path: "/garage-booking-diary-software",
  title: "Garage Booking Diary Software",
  description:
    "Garage booking diary software for independent garages that want to replace the paper diary with a clear digital workshop schedule linked to jobs, customers, and vehicles.",
  keywords: [
    "garage booking diary software",
    "garage diary software",
    "workshop booking diary",
    "digital garage diary",
  ],
});

export default function GarageBookingDiarySoftwarePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <SeoLandingPage
        pageTitle="Garage booking diary software"
        eyebrow="Digital diary software for garages"
        intro="Garage booking diary software should make it easier to see the day, fit work into the workshop, and keep bookings accurate as things move around. Workshop Buddy replaces the paper diary with a digital booking view built for independent garages."
        supportingText="This page focuses on the diary itself: clearer daily visibility, easier updates, and a booking view that stays connected to the rest of the job information."
        heroImageSrc="/screenshots/diary-main-week-tab2.png"
        heroImageAlt="Workshop Buddy garage booking diary software screenshot"
        heroBulletPoints={[
          "Replace the handwritten workshop diary",
          "See scheduled jobs in a clear digital view",
          "Update bookings without crossed-out notes",
          "Open customer, vehicle, and job details from the diary",
        ]}
        benefits={[
          {
            title: "Replace the paper diary",
            description: "Move away from handwritten bookings and constant rewrites.",
            icon: "edit_calendar",
          },
          {
            title: "See the day clearly",
            description: "View scheduled jobs and workload in one place.",
            icon: "view_day",
          },
          {
            title: "Track changes easily",
            description: "Update bookings without messy crossed-out pages.",
            icon: "sync_alt",
          },
          {
            title: "Keep job context nearby",
            description: "Open customer, vehicle, and job details from the diary.",
            icon: "touch_app",
          },
        ]}
        benefitsIntro="This page is focused on the diary experience: a cleaner way to book and track the workshop day than a paper diary or wall planner."
        features={[
          {
            title: "Clear workshop diary view",
            description: "The diary shows booked jobs in a simple format that helps reception understand the day without scanning handwritten notes.",
            icon: "date_range",
          },
          {
            title: "Simple booking flow",
            description: "Add jobs into the diary quickly so the receptionist can capture the booking and move on without extra admin.",
            icon: "playlist_add",
          },
          {
            title: "Fast rescheduling",
            description: "When a customer is late or the workshop day changes, bookings can be moved more easily than on paper.",
            icon: "drive_file_move",
          },
          {
            title: "Connected records",
            description: "Open the linked customer, vehicle, and job details from the booking instead of maintaining separate notes.",
            icon: "hub",
          },
        ]}
        workflowEyebrow="Diary workflow"
        workflowTitle="Book it, update it, and keep the day accurate"
        workflowDescription="The diary is built to stay usable under real workshop conditions, where bookings move and reception needs fast answers."
        workflowSteps={[
          {
            title: "Book the job into the diary",
            description: "Add the job details and place it in the workshop diary instead of writing it by hand in a paper planner.",
          },
          {
            title: "Keep the diary accurate",
            description: "Update or move bookings during the day so reception always has a clearer view of what is happening.",
          },
          {
            title: "Open the related job details",
            description: "Move from the booking diary to the job card, customer record, or vehicle record without hunting through separate systems.",
          },
        ]}
        screensEyebrow="Diary screens"
        screensTitle="Views that replace the traditional garage booking diary"
        screensDescription="These screens are the most relevant ones for workshops researching digital diary software rather than broader management software."
        screens={[
          {
            title: "Digital booking diary",
            description: "The diary view gives independent garages a cleaner, more flexible replacement for the paper booking book.",
            imageSrc: "/screenshots/diary-main-week-tab2.png",
            imageAlt: "Workshop Buddy weekly diary screenshot",
          },
          {
            title: "Day view for daily planning",
            description: "Reception can see the day's workshop activity more clearly and react faster when bookings change.",
            imageSrc: "/screenshots/diary-main-tab2.png",
            imageAlt: "Workshop Buddy daily diary screenshot",
          },
        ]}
        whoItsForTitle="Best for garages moving away from a handwritten booking book"
        whoItsForDescription="This page is most relevant for workshops where the diary is still the centre of daily organisation and needs a cleaner digital replacement."
        whoItsFor={[
          "Independent garages that still book work in a paper diary and want a digital replacement that stays simple.",
          "Reception teams that need a clearer view of daily bookings, arrivals, and changes during a busy workshop day.",
          "Vehicle workshops that want the diary connected to customer, vehicle, and job-card information rather than sitting on its own.",
        ]}
        faqTitle="Questions about garage booking diary software"
        faqDescription="These answers focus on replacing the paper diary while keeping the booking linked to the rest of the workshop workflow."
        faqs={[
          {
            question: "Does Workshop Buddy replace a paper workshop diary?",
            answer:
              "Yes. Workshop Buddy is designed to replace the paper diary with a digital workshop booking view that is easier to update during the day.",
          },
          {
            question: "Can I move bookings when plans change?",
            answer:
              "Yes. The diary is built to handle workshop changes more cleanly than a handwritten diary, helping reception stay organised.",
          },
          {
            question: "Is the diary linked to the rest of the job information?",
            answer:
              "Yes. Each booking connects to the job card as well as the customer and vehicle details, so the diary is part of the full workflow.",
          },
          {
            question: "Who is this diary software aimed at?",
            answer:
              "It is aimed at small independent garages and vehicle workshops that want a straightforward booking diary and daily operations system.",
          },
        ]}
        ctaTitle="Start a free trial and replace the paper booking diary"
        ctaDescription="Give reception a clearer digital diary for daily workshop bookings, changes, and linked job information."
        ctaSecondaryLabel="Compare scheduling software"
        ctaSecondaryHref="/workshop-scheduling-software"
        primaryCtaLabel="Start free booking diary trial"
        relatedPagesTitle="Related pages for diary and scheduling software"
        relatedPagesDescription="If you are comparing a digital booking diary with broader scheduling and job-card tools, these pages cover the connected workflows."
        relatedPages={[
          {
            href: "/workshop-scheduling-software",
            title: "Workshop scheduling software",
            description: "See the scheduling-focused page for capacity, rescheduling, and booking visibility.",
            ctaLabel: "Read scheduling software page",
          },
          {
            href: "/garage-job-card-software",
            title: "Garage job card software",
            description: "See how bookings in the diary connect directly to printable job cards and workshop notes.",
            ctaLabel: "Read job card software page",
          },
          {
            href: "/garage-management-software",
            title: "Garage management software",
            description: "Return to the broader product page covering diary bookings, records, and job cards together.",
            ctaLabel: "Read garage software page",
          },
        ]}
        homepageCardTitle="See the main Workshop Buddy product page"
        homepageCardDescription="Return to the homepage for the broader product overview, pricing, and screenshots."
        homepageCardCtaLabel="Visit main page"
      />
      <SiteFooter />
    </div>
  );
}
