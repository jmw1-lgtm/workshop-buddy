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
        intro="Workshop Buddy gives independent garages a straightforward way to manage daily bookings, customer records, vehicle records, and job cards in one place."
        supportingText="If your workshop is still juggling a paper diary, loose worksheets, and scattered customer details, Workshop Buddy keeps the essentials together without adding heavy admin."
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
        whoItsFor={[
          "Independent garages that want one simple system for bookings, customers, vehicles, and job cards.",
          "Small vehicle workshops with 1 to 10 staff that need the receptionist workflow to stay fast and easy to follow.",
          "Garages moving away from a paper diary or whiteboard but not looking for a full dealership management system.",
        ]}
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
      />
      <SiteFooter />
    </div>
  );
}
