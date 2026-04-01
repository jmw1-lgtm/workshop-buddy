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
        intro="Workshop Buddy helps independent garages schedule work clearly, see available time, and keep the day moving when bookings change."
        supportingText="The focus is practical workshop scheduling: booking jobs into the diary, moving them when needed, and keeping customer and vehicle details attached to the work so the front desk stays in control."
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
        whoItsFor={[
          "Independent garages that want a clearer way to book and reschedule work throughout the day.",
          "Reception teams that need to see available time quickly before promising jobs to customers.",
          "Vehicle workshops replacing a paper diary with something easier to keep accurate when plans shift.",
        ]}
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
      />
      <SiteFooter />
    </div>
  );
}
