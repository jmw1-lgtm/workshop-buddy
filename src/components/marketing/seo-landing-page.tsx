import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingLandingPages } from "@/lib/marketing-pages";

type IconName = string;

type LandingPoint = {
  title: string;
  description: string;
  icon: IconName;
};

type LandingFaq = {
  question: string;
  answer: string;
};

type LandingStep = {
  title: string;
  description: string;
};

type LandingScreen = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

type SeoLandingPageProps = {
  pageTitle: string;
  eyebrow: string;
  intro: string;
  supportingText: string;
  benefits: LandingPoint[];
  features: LandingPoint[];
  whoItsFor: string[];
  workflowSteps: LandingStep[];
  screens: LandingScreen[];
  faqs: LandingFaq[];
  primaryCtaLabel?: string;
};

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
      <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-3xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function ScreenPreview({ title, description, imageSrc, imageAlt }: LandingScreen) {
  return (
    <div className="rounded-[2rem] border border-[var(--primary-pale)]/70 bg-[rgba(231,236,239,0.9)] p-4.5 shadow-[0_18px_40px_rgba(39,76,119,0.08)] sm:p-5">
      <p className="text-xl font-semibold leading-7 text-[var(--foreground)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={1600}
        height={1040}
        className="mt-4 h-auto w-full rounded-[1rem] border border-[var(--surface-border)]/70 shadow-[0_10px_24px_rgba(39,76,119,0.06)]"
      />
    </div>
  );
}

export function SeoLandingPage({
  pageTitle,
  eyebrow,
  intro,
  supportingText,
  benefits,
  features,
  whoItsFor,
  workflowSteps,
  screens,
  faqs,
  primaryCtaLabel = "Start free 14-day trial",
}: SeoLandingPageProps) {
  const relatedPages = marketingLandingPages.filter((page) => page.title !== pageTitle);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="relative" aria-labelledby="landing-page-title">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_16%_18%,rgba(163,206,241,0.38),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(96,150,186,0.18),transparent_26%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-18 pt-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-12 lg:pt-20">
          <header className="relative z-10 space-y-8">
            <div className="space-y-5">
              <Badge className="bg-[var(--background)]/88 text-[var(--primary)] shadow-sm">
                {eyebrow}
              </Badge>
              <div className="space-y-4">
                <h1
                  id="landing-page-title"
                  className="max-w-[11ch] text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl lg:text-[4.1rem]"
                >
                  {pageTitle}
                </h1>
                <p className="max-w-[34rem] text-base leading-7 text-[var(--muted-foreground)] sm:text-lg sm:leading-8">
                  {intro}
                </p>
                <p className="max-w-[34rem] text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                  {supportingText}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="min-w-[13.5rem] shadow-[0_16px_30px_rgba(39,76,119,0.18)]"
                  asChild
                >
                  <Link href="/sign-up">{primaryCtaLabel}</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-[var(--background)]/78 text-[var(--foreground)]"
                  asChild
                >
                  <Link href="/">View main homepage</Link>
                </Button>
              </div>
              <p className="pl-1 text-sm font-medium text-[var(--muted-foreground)]/90">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </header>

          <div className="relative z-10 rounded-[2rem] border border-[var(--primary-pale)]/70 bg-[rgba(231,236,239,0.86)] p-5 shadow-[0_20px_44px_rgba(39,76,119,0.08)] sm:p-6">
            <Image
              src="/screenshots/diary-main-week-tab2.png"
              alt="Workshop Buddy diary view screenshot"
              width={1600}
              height={1040}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--primary-pale)]/70 bg-[var(--background)]/66">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-center gap-3 rounded-[1.6rem] bg-[rgba(163,206,241,0.24)] px-5 py-4"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(163,206,241,0.42)] text-[var(--primary)]">
                <MaterialIcon name={benefit.icon} className="text-[18px]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--primary)]">{benefit.title}</p>
                <p className="text-sm leading-5 text-[var(--muted-foreground)]">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-[4.5rem] sm:py-20">
        <SectionIntro
          eyebrow="Benefits"
          title={`Why independent garages choose ${pageTitle.toLowerCase()}`}
          description="Keep the workflow practical, visible, and easy to manage for a busy reception desk."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
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
      </section>

      <section
        id="how-it-works"
        className="bg-[linear-gradient(180deg,rgba(231,236,239,0.6),rgba(163,206,241,0.12))]"
      >
        <div className="mx-auto max-w-7xl px-6 py-[4.5rem] sm:py-20">
          <SectionIntro
            eyebrow="Relevant features"
            title="Built around the way vehicle workshops run the day"
            description="The workflow stays simple: book the work, run the diary, and keep customer and vehicle details tied to each job."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="rounded-[2rem] border border-[var(--primary-pale)]/70 bg-[var(--background)]/90 p-5 shadow-[0_18px_46px_rgba(39,76,119,0.08)] sm:p-6">
                <div className="flex size-16 items-center justify-center rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(39,76,119,1),rgba(96,150,186,0.92))] text-lg font-semibold text-[var(--background)] shadow-[0_12px_24px_rgba(39,76,119,0.12)]">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-7 text-[var(--foreground)]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-[var(--muted-foreground)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-[4.5rem] sm:py-20">
        <SectionIntro
          eyebrow="Used every day"
          title="Screens that help the front desk stay organised"
          description="These are the parts of Workshop Buddy used most often by reception teams in independent garages."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {screens.map((screen) => (
            <ScreenPreview key={screen.title} {...screen} />
          ))}
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,rgba(39,76,119,0.05),rgba(231,236,239,0.55))]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-[4.5rem] sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionIntro
              eyebrow="Who it's for"
              title="A practical fit for small workshop teams"
              description="Workshop Buddy is designed for garages that want simpler daily organisation, not a heavyweight dealership system."
            />
          </div>

          <div className="grid gap-3">
            {whoItsFor.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[1.6rem] border border-[var(--primary-pale)]/70 bg-[var(--background)]/92 px-5 py-4 shadow-[0_12px_30px_rgba(39,76,119,0.06)]"
              >
                <div className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-[rgba(163,206,241,0.4)]">
                  <MaterialIcon name="check" className="text-[16px] text-[var(--primary)]" />
                </div>
                <p className="text-sm leading-6 text-[var(--foreground)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-6 py-[4.5rem] sm:py-20">
        <SectionIntro
          eyebrow="FAQ"
          title={`Common questions about ${pageTitle.toLowerCase()}`}
          description="Short, practical answers for workshops comparing options and looking for a simpler way to run the day."
        />

        <div className="mt-8 grid gap-3.5">
          {faqs.map((faq) => (
            <Card key={faq.question} className="border-[var(--primary-pale)]/70 bg-[var(--background)]/92">
              <CardHeader className="gap-2.5 p-5 sm:p-6">
                <CardTitle className="text-xl">{faq.question}</CardTitle>
                <CardDescription className="max-w-3xl">{faq.answer}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[2.5rem] border border-[var(--primary)]/20 bg-[linear-gradient(135deg,rgba(39,76,119,0.98),rgba(96,150,186,0.94))] px-8 py-10 text-[var(--background)] shadow-[0_24px_70px_rgba(39,76,119,0.24)] sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Start with a 14-day free trial and keep the workshop day clearer.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-[var(--background)]/78 sm:text-lg">
                Workshop Buddy keeps bookings, customers, vehicles, and job cards together in one simple workflow for independent garages.
              </p>
              <p className="text-sm font-medium text-[var(--background)]/78">
                Pricing starts at £49 per month or £490 per year per workshop.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-[var(--background)] text-[var(--primary)] hover:bg-[var(--primary-pale)]" asChild>
                <Link href="/sign-up">Start free trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/35 bg-transparent text-[var(--background)] hover:bg-white/10 hover:text-[var(--background)]"
                asChild
              >
                <Link href="/">See pricing on homepage</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--background)]/60">
        <div className="mx-auto max-w-7xl px-6 py-[4.5rem] sm:py-16">
          <SectionIntro
            eyebrow="Related pages"
            title="Explore more Workshop Buddy software pages"
            description="Use these pages to compare the diary, scheduling, and job card parts of the product in more detail."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="border-[var(--primary-pale)]/70 bg-[var(--background)]/92">
              <CardHeader className="p-6">
                <CardTitle className="text-xl">Workshop Buddy homepage</CardTitle>
                <CardDescription className="text-sm leading-6">
                  See the full overview, pricing, screenshots, and the main conversion path.
                </CardDescription>
                <div className="pt-2">
                  <Button variant="outline" asChild>
                    <Link href="/">Go to homepage</Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {relatedPages.map((page) => (
              <Card key={page.href} className="border-[var(--primary-pale)]/70 bg-[var(--background)]/92">
                <CardHeader className="p-6">
                  <CardTitle className="text-xl">{page.title}</CardTitle>
                  <CardDescription className="text-sm leading-6">
                    {page.description}
                  </CardDescription>
                  <div className="pt-2">
                    <Button variant="outline" asChild>
                      <Link href={page.href}>Read this page</Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
