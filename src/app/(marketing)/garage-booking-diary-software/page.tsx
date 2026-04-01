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
        intro="Workshop Buddy replaces the paper booking diary with a digital workshop view that helps independent garages see booked work clearly and keep the day under control."
        supportingText="Instead of relying on handwritten slots, rubbed-out notes, or separate customer files, the diary keeps each booking connected to the customer, vehicle, and job card so the workflow stays tidy."
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
        whoItsFor={[
          "Independent garages that still book work in a paper diary and want a digital replacement that stays simple.",
          "Reception teams that need a clearer view of daily bookings, arrivals, and changes during a busy workshop day.",
          "Vehicle workshops that want the diary connected to customer, vehicle, and job-card information rather than sitting on its own.",
        ]}
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
      />
      <SiteFooter />
    </div>
  );
}
