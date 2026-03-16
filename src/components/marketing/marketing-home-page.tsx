import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const featureCards = [
  {
    icon: "calendar_month",
    title: "Smart workshop diary",
    description: "Book jobs into a clear day view and keep the front desk organised without the paper diary.",
  },
  {
    icon: "open_with",
    title: "Easy job rescheduling",
    description: "Move bookings quickly when the day changes or a customer runs late.",
  },
  {
    icon: "history",
    title: "Customer and vehicle records",
    description: "Keep registrations, vehicles, and repeat customers organised in one place.",
  },
  {
    icon: "description",
    title: "Job cards and worksheets",
    description: "Create job cards, capture work details, and keep workshop paperwork organised.",
  },
];

const workflowSteps = [
  {
    number: "1",
    title: "Book the job",
    description: "Add the customer, vehicle, and job details, then place the work into the diary.",
  },
  {
    number: "2",
    title: "Run the day",
    description: "Adjust bookings quickly, keep arrivals visible, and stay on top of workshop capacity.",
  },
  {
    number: "3",
    title: "Complete and collect",
    description: "Update the job card, print worksheets if needed, and keep customer history organised.",
  },
];

const showcaseScreens = [
  {
    name: "Next available slot",
    caption: "See the next available slot and book new work faster.",
    imageSrc: "/screenshots/next-available.png",
    imageAlt: "Workshop Buddy next available slot screenshot",
  },
  {
    name: "Upcoming workload",
    caption: "Stay ahead of the day with a clear view of upcoming jobs and workshop capacity.",
    imageSrc: "/screenshots/upcoming.png",
    imageAlt: "Workshop Buddy upcoming workload screenshot",
  },
  {
    name: "Job Card",
    caption: "Capture job details, notes, and work completed with clear job cards.",
    imageSrc: "/screenshots/job-card2.png",
    imageAlt: "Workshop Buddy job card screenshot",
  },
  {
    name: "Customer records",
    caption: "Keep customer details, vehicles, and service history organised in one place.",
    imageSrc: "/screenshots/customers2.png",
    imageAlt: "Workshop Buddy customer records screenshot",
  },
];

const pricingPlans = [
  {
    name: "Monthly",
    price: "£49",
    cadence: "per workshop / month",
    points: [
      "Workshop diary and booking calendar",
      "Customer and vehicle records",
      "Job cards and printable worksheets",
    ],
    reassurance: ["No credit card required", "Cancel anytime"],
    featured: false,
  },
  {
    name: "Yearly",
    price: "£490",
    cadence: "per workshop / year",
    priceNote: "Equivalent to £41 per month",
    points: [
      "Everything in Monthly",
      "Save two months compared with paying monthly",
      "Free trial before billing",
    ],
    reassurance: ["No credit card required", "Cancel anytime"],
    featured: true,
  },
];

const faqs = [
  {
    question: "Who is Workshop Buddy for?",
    answer: "Workshop Buddy is designed for independent garages and small workshops with busy reception desks and small teams.",
  },
  {
    question: "Does it replace a paper diary?",
    answer: "Yes. Workshop Buddy replaces the traditional paper diary with a clear digital workshop schedule that is easier to update and manage during the day.",
  },
  {
    question: "Can we still print job cards?",
    answer: "Yes. Printable worksheets remain part of the workflow so technicians can still work from printed job sheets if needed.",
  },
  {
    question: "Do I need a credit card to start the trial?",
    answer: "No. You can start the 14-day free trial without entering any payment details.",
  },
  {
    question: "How long does setup take?",
    answer: "Most workshops can start using Workshop Buddy in just a few minutes. There is no complicated setup or training required.",
  },
  {
    question: "Can we use Workshop Buddy on a tablet?",
    answer: "Yes. Workshop Buddy works in any modern web browser, so it can be used on desktop computers, laptops, and tablets at the reception desk or around the workshop.",
  },
  {
    question: "Is the price per user?",
    answer: "No. Pricing is per workshop, so your whole team can use the system.",
  },
];

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2.5">
      <Badge className="bg-[var(--primary-pale)]/75 text-[var(--primary)]">{eyebrow}</Badge>
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function PreviewShell({
  title,
  caption,
  imageSrc,
  imageAlt,
}: {
  title: string;
  caption: string;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[var(--primary-pale)]/70 bg-[rgba(231,236,239,0.9)] p-4.5 shadow-[0_18px_40px_rgba(39,76,119,0.08)] sm:p-5">
      <p className="text-xl font-semibold leading-7 text-[var(--foreground)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{caption}</p>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt ?? title}
          width={1600}
          height={1040}
          className="mt-4 h-auto w-full max-w-full rounded-[1rem] border border-[var(--surface-border)]/70 shadow-[0_10px_24px_rgba(39,76,119,0.06)]"
          priority
        />
      ) : null}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-[860px] lg:-mr-6">
      <div className="absolute inset-x-10 top-6 h-28 rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(163,206,241,0.24),rgba(231,236,239,0))] blur-3xl" />
      <Image
        src="/screenshots/diary-main-week-tab.png"
        alt="Workshop Buddy diary view screenshot"
        width={1600}
        height={1040}
        priority
        className="relative h-auto w-full"
      />
    </div>
  );
}

export function MarketingHomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative" aria-labelledby="marketing-hero-title">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_16%_18%,rgba(163,206,241,0.38),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(96,150,186,0.18),transparent_26%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-14 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-12 lg:pt-20">
          <header className="relative z-10 space-y-8">
            <div className="space-y-5">
              <Badge className="bg-[var(--background)]/88 text-[var(--primary)] shadow-sm">
                Garage software for independent workshops
              </Badge>
              <div className="space-y-4">
                <h1
                  id="marketing-hero-title"
                  className="max-w-[9ch] text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-[4.35rem]"
                >
                  Replace the paper diary
                </h1>
                <p
                  id="marketing-hero-description"
                  className="max-w-[30rem] text-base leading-7 text-[var(--muted-foreground)] sm:text-lg sm:leading-8"
                >
                  Workshop Buddy helps independent garages book work faster, manage
                  customers and vehicles, and keep the day organised.
                </p>
              </div>
            </div>

            <div className="space-y-5" aria-describedby="marketing-hero-description">
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="min-w-[13.5rem] shadow-[0_16px_30px_rgba(39,76,119,0.18)]"
                  asChild
                >
                  <Link href="/sign-up">Start free 14-day trial</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-[var(--background)]/78 text-[var(--foreground)]"
                  asChild
                >
                  <Link href="#product-preview">See the diary in action</Link>
                </Button>
              </div>
              <p className="pl-1 text-sm font-medium text-[var(--muted-foreground)]/90">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </header>

          <div className="relative z-10">
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--primary-pale)]/70 bg-[var(--background)]/66">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Built for independent garages", icon: "garage_home" },
            { label: "1-10 staff workshops", icon: "groups" },
            { label: "Reception-first workflow", icon: "support_agent" },
            { label: "Manage bookings", icon: "calendar_month" },
            { label: "Track job cards", icon: "description" },
            { label: "See technician availability", icon: "engineering" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-[1.6rem] bg-[rgba(163,206,241,0.24)] px-6 py-4 text-sm font-semibold text-[var(--primary)]"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-[rgba(163,206,241,0.42)] text-[var(--primary)]">
                <MaterialIcon name={item.icon} className="text-[18px]" />
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="product-preview" className="mx-auto max-w-7xl px-6 py-[4.5rem] sm:py-20">
        <SectionIntro
          eyebrow="Workshop diary"
          title="A simple diary built for busy workshops"
          description="See the day clearly, move jobs quickly, and keep the front desk organised."
        />

        <div className="mt-8">
          <Image
            src="/screenshots/diary-main-tab.png"
            alt="Workshop Buddy diary view screen"
            width={1600}
            height={1040}
            className="mx-auto h-auto w-full max-w-[900px] drop-shadow-[0_16px_32px_rgba(39,76,119,0.08)]"
            priority
          />
        </div>
      </section>

      <section id="features" className="bg-[linear-gradient(180deg,rgba(231,236,239,0.6),rgba(163,206,241,0.12))]">
        <div className="mx-auto max-w-7xl px-6 py-[4.5rem] sm:py-20">
          <SectionIntro
            eyebrow="Core features"
            title="Everything needed to run a busy workshop"
            description="Workshop Buddy gives independent garages the core tools needed to manage bookings, customers, vehicles, and daily workshop flow in one place."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[2rem] border bg-white p-5 shadow-[0_18px_40px_rgba(39,76,119,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(39,76,119,0.12)] sm:p-6"
                style={{ borderColor: "rgba(163,206,241,0.65)" }}
              >
                <div
                  className="flex size-13 items-center justify-center rounded-[1.15rem]"
                  style={{ backgroundColor: "rgba(163,206,241,0.4)" }}
                >
                  <MaterialIcon name={feature.icon} className="text-[24px] text-[var(--primary)]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-7 text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-[var(--muted-foreground)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-[4.5rem] sm:py-20">
        <SectionIntro
          eyebrow="How it works"
          title="From booking to collection in three simple steps"
          description="Built around the way independent garages actually manage the day."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {workflowSteps.map((step) => (
            <div key={step.number} className="relative">
              <div className="rounded-[2rem] border border-[var(--primary-pale)]/70 bg-[var(--background)]/90 p-5 shadow-[0_18px_46px_rgba(39,76,119,0.08)] sm:p-6">
                <div className="flex size-16 items-center justify-center rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(39,76,119,1),rgba(96,150,186,0.92))] text-lg font-semibold text-[var(--background)] shadow-[0_12px_24px_rgba(39,76,119,0.12)]">
                  {step.number}
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-7 text-[var(--foreground)]">
                  {step.title}
                </h3>
                <p className="mt-2.5 max-w-xs text-sm leading-6 text-[var(--muted-foreground)]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="screens" className="bg-[linear-gradient(180deg,rgba(39,76,119,0.05),rgba(231,236,239,0.55))]">
        <div className="mx-auto max-w-7xl px-6 py-[4.5rem] sm:py-20">
          <SectionIntro
            eyebrow="Screen showcase"
            title="Key screens used every day in the workshop"
            description="See the screens that help reception book work faster and keep the workshop organised."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {showcaseScreens.map((screen) => (
              <PreviewShell
                key={screen.name}
                title={screen.name}
                caption={screen.caption}
                imageSrc={screen.imageSrc}
                imageAlt={screen.imageAlt}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-[4.5rem] sm:py-20">
        <div className="space-y-3">
          <SectionIntro
            eyebrow="Pricing"
            title="Simple pricing for independent garages"
            description="Start with a free trial. Choose monthly or yearly when you're ready."
          />
          <p className="text-sm font-medium text-[var(--muted-foreground)]">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-[2rem] border p-7 shadow-[0_20px_50px_rgba(39,76,119,0.1)]"
              style={{
                background: plan.featured
                  ? "linear-gradient(145deg, rgba(39,76,119,0.98), rgba(96,150,186,0.94))"
                  : "rgba(231,236,239,0.92)",
                borderColor: plan.featured ? "rgba(39,76,119,0.2)" : "rgba(163,206,241,0.65)",
                color: plan.featured ? "var(--background)" : "var(--foreground)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{plan.name}</p>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{
                      color: plan.featured ? "rgba(231,236,239,0.78)" : "var(--muted-foreground)",
                    }}
                  >
                    {plan.cadence}
                  </p>
                </div>
                {plan.featured ? (
                  <Badge className="bg-[var(--background)] text-[var(--primary)]">Most popular</Badge>
                ) : null}
              </div>

              <div className="mt-5 text-4xl font-semibold tracking-tight">{plan.price}</div>
              {"priceNote" in plan ? (
                <p className="mt-2 text-sm" style={{ color: "rgba(231,236,239,0.78)" }}>
                  {plan.priceNote}
                </p>
              ) : null}

              <div className="mt-5 space-y-3">
                {plan.points.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div
                      className="mt-0.5 flex size-6 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: plan.featured ? "rgba(231,236,239,0.14)" : "rgba(163,206,241,0.4)",
                      }}
                    >
                      <MaterialIcon
                        name="check"
                        className={plan.featured ? "text-[16px] text-[var(--background)]" : "text-[16px] text-[var(--primary)]"}
                      />
                    </div>
                    <p
                      className="text-sm leading-6"
                      style={{
                        color: plan.featured ? "rgba(231,236,239,0.84)" : "var(--foreground)",
                      }}
                    >
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button
                  size="lg"
                  variant={plan.featured ? "secondary" : "default"}
                  className={plan.featured ? "bg-[var(--background)] text-[var(--primary)] hover:bg-[var(--primary-pale)]" : ""}
                  asChild
                >
                  <Link href="/sign-up">Start free trial</Link>
                </Button>
                <p
                  className="mt-3 space-y-1 text-sm"
                  style={{ color: plan.featured ? "rgba(231,236,239,0.78)" : "var(--muted-foreground)" }}
                >
                  {plan.reassurance.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-[var(--background)]/60">
        <div className="mx-auto max-w-6xl px-6 py-[4.5rem] sm:py-20">
          <SectionIntro
            eyebrow="FAQ"
            title="Common questions from independent garages"
            description="Keep the buying journey simple with quick answers and a clear next step."
          />

          <div className="mt-8 grid gap-3.5">
            {faqs.map((faq) => (
              <Card key={faq.question} className="border-[var(--primary-pale)]/70 bg-[var(--background)]/92">
                <CardHeader className="gap-2.5 p-5 sm:p-6">
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                  <CardDescription className="max-w-2xl">{faq.answer}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2.5rem] border border-[var(--primary)]/20 bg-[linear-gradient(135deg,rgba(39,76,119,0.98),rgba(96,150,186,0.94))] px-8 py-10 text-[var(--background)] shadow-[0_24px_70px_rgba(39,76,119,0.24)] sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Start the trial and give reception a faster way to run the day.
              </h2>
              <p className="max-w-xl text-base leading-7 text-[var(--background)]/78 sm:text-lg">
                Replace the paper diary and keep bookings, job cards, and customer history in one system.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-[var(--background)] text-[var(--primary)] hover:bg-[var(--primary-pale)]" asChild>
                <Link href="/sign-up">Start free trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[var(--primary-pale)]/30 bg-[var(--background)]/8 text-[var(--background)] hover:bg-[var(--background)]/14"
                asChild
              >
                <Link href="#pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
