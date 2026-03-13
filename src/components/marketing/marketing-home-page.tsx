import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const featureCards = [
  {
    icon: "calendar_month",
    title: "Smart workshop diary scheduling",
    description: "Book jobs into a clear day view and keep technician time organised without the paper diary.",
  },
  {
    icon: "open_with",
    title: "Drag-and-drop job rescheduling",
    description: "Move bookings quickly when the day changes or a customer runs late.",
  },
  {
    icon: "history",
    title: "Customer and vehicle history",
    description: "Keep registrations, vehicles, and repeat customers organised in one place.",
  },
  {
    icon: "description",
    title: "Job cards and printable worksheets",
    description: "Capture the booking once, then open or print clear job sheets for the workshop.",
  },
];

const workflowSteps = [
  {
    number: "1",
    title: "Book the job",
    description: "Add the customer, find the vehicle, and place the work into the workshop diary.",
  },
  {
    number: "2",
    title: "Run the day",
    description: "Reschedule jobs quickly, track arrivals, and keep technician capacity visible.",
  },
  {
    number: "3",
    title: "Complete and collect",
    description: "Update the job card, print worksheets if needed, and keep customer history organised.",
  },
];

const showcaseScreens = [
  {
    name: "Dashboard",
    caption: "Live workshop overview and queue status.",
    accent: "rgba(39,76,119,0.12)",
    imageSrc: "/screenshots/dashboard-queue.png",
    imageAlt: "Workshop Buddy dashboard queue screenshot",
  },
  {
    name: "Day Diary",
    caption: "The daily booking view for reception.",
    accent: "rgba(96,150,186,0.18)",
    imageSrc: "/screenshots/day-diary.png",
    imageAlt: "Workshop Buddy day diary screenshot",
  },
  {
    name: "Job Card",
    caption: "Notes, status, and print-ready job sheets.",
    accent: "rgba(163,206,241,0.28)",
    imageSrc: "/screenshots/job-card.png",
    imageAlt: "Workshop Buddy job card screenshot",
  },
  {
    name: "Customers",
    caption: "People, vehicles, and workshop history.",
    accent: "rgba(139,140,137,0.2)",
    imageSrc: "/screenshots/customers.png",
    imageAlt: "Workshop Buddy customers screenshot",
  },
];

const pricingPlans = [
  {
    name: "Monthly",
    price: "£49",
    cadence: "per workshop / month",
    points: [
      "Workshop diary and bookings",
      "Customer and vehicle history",
      "Job cards and printable worksheets",
    ],
    reassurance: "Cancel anytime.",
    featured: false,
  },
  {
    name: "Yearly",
    price: "£490",
    cadence: "per workshop / year",
    priceNote: "£41/month billed yearly",
    points: [
      "Everything in Monthly",
      "Save two months with annual billing",
      "Free trial before billing",
    ],
    reassurance: "Cancel anytime.",
    featured: true,
  },
];

const faqs = [
  {
    question: "Who is Workshop Buddy for?",
    answer: "Independent garages and workshops with small teams and busy reception desks.",
  },
  {
    question: "Can we still print job cards?",
    answer: "Yes. Printable worksheets remain part of the core workflow for the workshop floor.",
  },
  {
    question: "Does it replace a paper diary?",
    answer: "That is the main goal. It gives reception a faster and clearer way to run the day.",
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
    <div className="space-y-3">
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
  accent,
  compact = false,
  imageSrc,
  imageAlt,
}: {
  title: string;
  caption: string;
  accent: string;
  compact?: boolean;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--primary-pale)]/70 bg-[var(--background)] shadow-[0_22px_60px_rgba(39,76,119,0.1)]">
      <div
        className="border-b border-[var(--surface-border)] px-5 py-4"
        style={{ background: `linear-gradient(135deg, ${accent}, rgba(231,236,239,0.92))` }}
      >
        <p className="text-base font-semibold text-[var(--foreground)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{caption}</p>
      </div>

      <div className="p-5">
        <div className="rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-muted)] p-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[var(--primary)]" />
            <span className="size-2.5 rounded-full bg-[var(--primary-soft)]" />
            <span className="size-2.5 rounded-full bg-[var(--primary-pale)]" />
          </div>

          {imageSrc ? (
            <div className="mt-4 rounded-[1.25rem] border border-[var(--surface-border)] bg-[var(--background)] p-3 shadow-[0_14px_34px_rgba(39,76,119,0.1)]">
              <div className="relative overflow-hidden rounded-[1rem] border border-[var(--surface-border)] bg-[var(--background)]">
                <Image
                  src={imageSrc}
                  alt={imageAlt ?? title}
                  width={1600}
                  height={1040}
                  className="h-auto w-full"
                  priority={!compact}
                />
              </div>
            </div>
          ) : compact ? (
            <div className="mt-4 grid gap-3">
              <div className="h-5 w-2/5 rounded-full bg-[var(--background)]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-24 rounded-[1rem] bg-[var(--background)]" />
                <div className="h-24 rounded-[1rem] bg-[var(--background)]" />
              </div>
              <div className="h-20 rounded-[1rem] bg-[var(--background)]" />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.2rem] bg-[var(--background)] p-4">
                <div className="h-5 w-32 rounded-full bg-[var(--surface-muted)]" />
                <div className="mt-4 space-y-3">
                  <div className="h-12 rounded-2xl bg-[rgba(96,150,186,0.18)]" />
                  <div className="h-12 rounded-2xl bg-[rgba(39,76,119,0.14)]" />
                  <div className="h-12 rounded-2xl bg-[rgba(163,206,241,0.24)]" />
                  <div className="h-12 rounded-2xl bg-[rgba(139,140,137,0.18)]" />
                </div>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[1.2rem] bg-[var(--background)] p-4">
                  <div className="h-4 w-20 rounded-full bg-[var(--surface-muted)]" />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="h-14 rounded-xl bg-[var(--surface-muted)]" />
                    <div className="h-14 rounded-xl bg-[var(--surface-muted)]" />
                    <div className="h-14 rounded-xl bg-[var(--surface-muted)]" />
                    <div className="h-14 rounded-xl bg-[var(--surface-muted)]" />
                  </div>
                </div>
                <div className="rounded-[1.2rem] bg-[linear-gradient(135deg,rgba(39,76,119,1),rgba(96,150,186,0.92))] p-4 text-[var(--background)]">
                  <div className="h-4 w-24 rounded-full bg-[var(--background)]/30" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 rounded-full bg-[var(--background)]/25" />
                    <div className="h-3 rounded-full bg-[var(--background)]/25" />
                    <div className="h-3 w-4/5 rounded-full bg-[var(--background)]/25" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-[780px]">
      <div className="absolute inset-x-8 top-4 h-24 rounded-[2rem] bg-[linear-gradient(180deg,rgba(163,206,241,0.26),rgba(231,236,239,0))] blur-2xl" />
      <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--primary-pale)]/70 bg-[var(--background)] shadow-[0_34px_90px_rgba(39,76,119,0.2)]">
        <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[linear-gradient(180deg,rgba(231,236,239,0.98),rgba(163,206,241,0.18))] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Workshop Buddy
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
              Live diary view
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[var(--primary)]" />
            <span className="size-2.5 rounded-full bg-[var(--primary-soft)]" />
            <span className="size-2.5 rounded-full bg-[var(--primary-pale)]" />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="relative overflow-hidden rounded-[1.6rem] border border-[var(--surface-border)] bg-[var(--background)] shadow-[0_18px_44px_rgba(39,76,119,0.12)]">
            <Image
              src="/screenshots/diary-main-week.png"
              alt="Workshop Buddy diary view screenshot"
              width={1600}
              height={1040}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MarketingHomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative" aria-labelledby="marketing-hero-title">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_16%_18%,rgba(163,206,241,0.38),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(96,150,186,0.18),transparent_26%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:pt-20">
          <header className="relative z-10 space-y-8">
            <div className="space-y-5">
              <Badge className="bg-[var(--background)]/88 text-[var(--primary)] shadow-sm">
                Garage management software for independent workshops
              </Badge>
              <div className="space-y-4">
                <h1
                  id="marketing-hero-title"
                  className="max-w-[11ch] text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-[4.35rem]"
                >
                  Replace your workshop diary
                </h1>
                <p
                  id="marketing-hero-description"
                  className="max-w-[31rem] text-base leading-7 text-[var(--muted-foreground)] sm:text-lg sm:leading-8"
                >
                  Workshop Buddy helps reception staff manage bookings, job cards and
                  technician availability in one simple digital diary.
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
                No credit card required
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

      <section id="product-preview" className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <SectionIntro
          eyebrow="Product preview"
          title="A clear diary view built for the front desk."
          description="The diary is the core screen. It keeps today visible and makes booking work faster than paper."
        />

        <div className="mt-10">
          <PreviewShell
            title="Diary view"
            caption="The main reception diary view for booking and rescheduling work."
            accent="rgba(96,150,186,0.18)"
            imageSrc="/screenshots/day-diary.png"
            imageAlt="Workshop Buddy day diary screen"
          />
        </div>
      </section>

      <section id="features" className="bg-[linear-gradient(180deg,rgba(231,236,239,0.6),rgba(163,206,241,0.12))]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <SectionIntro
            eyebrow="Features"
            title="Core tools for running a busy workshop"
            description="Four essential tools to manage bookings, jobs, and customers without the paper diary."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[2rem] border bg-white p-6 shadow-[0_18px_40px_rgba(39,76,119,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(39,76,119,0.12)]"
                style={{ borderColor: "rgba(163,206,241,0.65)" }}
              >
                <div
                  className="flex size-13 items-center justify-center rounded-[1.15rem]"
                  style={{ backgroundColor: "rgba(163,206,241,0.4)" }}
                >
                  <MaterialIcon name={feature.icon} className="text-[24px] text-[var(--primary)]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[var(--foreground)]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <SectionIntro
          eyebrow="Workflow"
          title="From booking to collection in three simple steps"
          description="Designed around how a small independent garage actually runs."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < workflowSteps.length - 1 ? (
                <div className="absolute left-[5.2rem] right-[-1rem] top-8 hidden h-px bg-[linear-gradient(90deg,rgba(39,76,119,0.35),rgba(163,206,241,0.14))] lg:block" />
              ) : null}
              <div className="rounded-[2rem] border border-[var(--primary-pale)]/70 bg-[var(--background)]/90 p-6 shadow-[0_18px_46px_rgba(39,76,119,0.08)]">
                <div className="flex size-16 items-center justify-center rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(39,76,119,1),rgba(96,150,186,0.92))] text-lg font-semibold text-[var(--background)]">
                  {step.number}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[var(--foreground)]">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--muted-foreground)]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="screens" className="bg-[linear-gradient(180deg,rgba(39,76,119,0.05),rgba(231,236,239,0.55))]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <SectionIntro
            eyebrow="Screen showcase"
            title="Preview the key screens across the workflow."
            description="These framed areas are ready for real screenshots of the dashboard, diary, job card, and customers views."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {showcaseScreens.map((screen) => (
              <PreviewShell
                key={screen.name}
                title={screen.name}
                caption={screen.caption}
                accent={screen.accent}
                imageSrc={screen.imageSrc}
                imageAlt={screen.imageAlt}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionIntro
          eyebrow="Pricing"
          title="Simple pricing for independent garages"
          description="Start with a free trial. Choose monthly or yearly when you're ready."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
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

              <div className="mt-6 text-4xl font-semibold tracking-tight">{plan.price}</div>
              {"priceNote" in plan ? (
                <p className="mt-2 text-sm" style={{ color: "rgba(231,236,239,0.78)" }}>
                  {plan.priceNote}
                </p>
              ) : null}

              <div className="mt-6 space-y-3">
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

              <div className="mt-7">
                <Button
                  size="lg"
                  variant={plan.featured ? "secondary" : "default"}
                  className={plan.featured ? "bg-[var(--background)] text-[var(--primary)] hover:bg-[var(--primary-pale)]" : ""}
                  asChild
                >
                  <Link href="/sign-up">Start free trial</Link>
                </Button>
                <p
                  className="mt-3 text-sm"
                  style={{
                    color: plan.featured ? "rgba(231,236,239,0.78)" : "var(--muted-foreground)",
                  }}
                >
                  {plan.reassurance}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-[var(--background)]/60">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <SectionIntro
            eyebrow="FAQ"
            title="Short answers to the first questions workshops ask."
            description="Keep the buying journey simple with quick answers and a clear next step."
          />

          <div className="mt-10 grid gap-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="border-[var(--primary-pale)]/70 bg-[var(--background)]/92">
                <CardHeader className="gap-3">
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

      <footer className="border-t border-[var(--primary-pale)]/60 bg-[var(--background)]/88">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Workshop Buddy</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              A simple workshop control system for independent garages.
            </p>
          </div>
          <div className="flex items-center gap-5 text-sm font-medium text-[var(--muted-foreground)]">
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="/sign-in">Sign in</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
