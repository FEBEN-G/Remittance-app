import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock3,
  Globe2,
  Headset,
  Mail,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const services = [
  {
    title: "30+ Ethiopian Banks",
    description:
      "Direct deposits to major banks including CBE, Awash, Dashen, and more.",
    icon: Building2,
  },
  {
    title: "Instant Transfers",
    description: "Real-time transaction flow with delivery in minutes.",
    icon: Zap,
  },
  {
    title: "Licensed and Secure",
    description:
      "Compliance-first operations with secure payment infrastructure.",
    icon: ShieldCheck,
  },
  {
    title: "24/7 Support",
    description: "Dedicated help team available by phone, email, and chat.",
    icon: Headset,
  },
];

const faqs = [
  {
    q: "How fast is transfer delivery?",
    a: "Most transfers are delivered within minutes depending on bank processing windows and verification status.",
  },
  {
    q: "Is White Label Pay licensed?",
    a: "Yes. White Label Pay operates under required regulatory and compliance standards for money services.",
  },
  {
    q: "Can I send from outside the US?",
    a: "Yes. You can start transfers from supported regions and deliver directly to Ethiopia.",
  },
  {
    q: "How can I contact support?",
    a: "You can contact us by phone, email, or through in-app support any time.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 flex justify-center">
        <div
          className="absolute top-[-20%] h-[50rem] w-[50rem] rounded-full bg-primary/10 blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute right-[-10%] top-[40%] h-[30rem] w-[30rem] rounded-full bg-secondary/10 blur-[100px] animate-pulse"
          style={{ animationDuration: "6s" }}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-2xl transition-all">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-primary/40">
              WL
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight">
                White Label Pay
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Global to Ethiopia
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {["Services", "About Us", "Contact Us", "FAQ"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="relative text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-medium hover:text-primary transition-colors sm:block"
            >
              Log in
            </Link>
            <Button
              asChild
              size="lg"
              className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              <Link href="/login">Send Money</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 py-20 md:px-6">
          <div className="absolute inset-0 -z-10 opacity-30">
            <div
              className="absolute top-[20%] left-[10%] h-[40vw] w-[40vw] rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 blur-[100px] animate-pulse"
              style={{ animationDuration: "4s" }}
            />
          </div>

          <div className="mx-auto max-w-7xl text-center z-10">
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
                Send Money{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Faster.
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl leading-relaxed">
                White Label Pay delivers dependable cross-border payments with
                instant delivery to 30+ Ethiopian banks. Built for speed,
                secured by trust.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <Button
                  asChild
                  size="lg"
                  className="h-14 rounded-full px-8 text-base shadow-xl shadow-primary/25 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  <Link href="/login" className="gap-2">
                    Send Money Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 rounded-full px-8 text-base border-border/60 hover:bg-muted/50 backdrop-blur-md w-full sm:w-auto transition-colors"
                >
                  <Link href="#services">Explore Features</Link>
                </Button>
              </div>

              <div className="mt-16 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:max-w-6xl">
                {[
                  {
                    icon: Globe2,
                    label: "Global Reach",
                    sub: "Send from anywhere",
                  },
                  {
                    icon: Clock3,
                    label: "Real-Time",
                    sub: "Instant processing",
                  },
                  {
                    icon: Building2,
                    label: "30+ Banks",
                    sub: "Direct deposits",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-white/5 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20"
                  >
                    <stat.icon className="mb-4 h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-semibold">{stat.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1 text-center">
                      {stat.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="relative py-32 px-4 md:px-6 before:absolute before:inset-0 before:-z-10 before:bg-muted/30"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Our Services
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A modern remittance platform designed specifically for the
                Ethiopian diaspora, engineered for reliability.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {services.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                    style={{
                      animationDelay: `${i * 150}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <Card className="group relative h-full overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 rounded-3xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <CardContent className="relative p-8">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-3 shadow-sm">
                          <Icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3">
                          {item.title}
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="about" className="py-32 px-4 md:px-6">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-background to-muted/50 rounded-[2.5rem] shadow-xl">
              <CardContent className="grid gap-12 p-8 md:grid-cols-2 md:p-16 items-center">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                    About Us
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    White Label Pay connects families across borders with fast,
                    secure, and reliable transfers to Ethiopia. We focus on
                    transparent delivery, strong compliance, and cutting-edge
                    technology built for real-world reliability.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {[
                      "No hidden fees",
                      "Bank-level encryption",
                      "Dedicated support",
                    ].map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors duration-300"
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "99.9%", label: "Platform Uptime" },
                    { value: "1M+", label: "Transactions" },
                    { value: "55K+", label: "Customers" },
                    { value: "24/7", label: "Support Team" },
                  ].map((stat, i) => (
                    <Card
                      key={i}
                      className="border-border/40 bg-background/40 backdrop-blur-md rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                    >
                      <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold text-foreground mb-2">
                          {stat.value}
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="contact"
          className="py-32 px-4 md:px-6 relative before:absolute before:inset-0 before:-z-10 before:bg-muted/30"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Get in Touch
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We're here to help. Reach out to our dedicated support team
                anywhere, anytime.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: PhoneCall,
                  title: "Phone",
                  lines: ["+1 (301) 200-7090", "+251 995499844"],
                },
                {
                  icon: Mail,
                  title: "Email",
                  lines: [
                    "support@whitelabelpay.com",
                    "info@whitelabelpay.com",
                  ],
                },
                {
                  icon: Smartphone,
                  title: "Mobile App",
                  lines: ["Get the app for faster transfers"],
                  link: "Sign on mobile app",
                },
              ].map((contact, i) => (
                <div
                  key={i}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{
                    animationDelay: `${i * 150}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <Card className="group h-full border-border/40 bg-background/50 backdrop-blur-sm rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:border-primary/30">
                    <CardContent className="flex flex-col items-center text-center p-8">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                        <contact.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4">
                        {contact.title}
                      </h3>
                      {contact.lines.map((line, j) => (
                        <p key={j} className="text-muted-foreground">
                          {line}
                        </p>
                      ))}
                      {contact.link && (
                        <Link
                          href="#"
                          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          {contact.link}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-32 px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                Answers to common questions about transfers, security, and
                support.
              </p>

              <Accordion
                type="single"
                collapsible
                className="w-full text-left space-y-4"
              >
                {faqs.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="border border-border/40 rounded-2xl px-6 bg-card/40 backdrop-blur-sm data-[state=open]:bg-card/80 transition-colors duration-300 hover:border-primary/30"
                  >
                    <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 group">
                      <span className="group-hover:text-primary transition-colors">
                        {item.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-zinc-950 text-zinc-400 dark:bg-background pt-20 pb-10">
        <div className="container mx-auto grid gap-12 px-4 md:grid-cols-4 md:px-8 mb-16 text-sm">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
                WL
              </div>
              <span className="text-lg font-bold text-zinc-100 dark:text-foreground">
                White Label Pay
              </span>
            </Link>
            <p className="max-w-xs leading-relaxed">
              Licensed money services platform delivering secure and reliable
              transfers to Ethiopia with unmatched speed.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-100 dark:text-foreground mb-6">
              Quick Links
            </h4>
            <div className="grid gap-4">
              {["Services", "About Us", "Contact Us", "FAQ"].map((link) => (
                <Link
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  className="hover:text-primary transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-100 dark:text-foreground mb-6">
              Compliance & Legal
            </h4>
            <div className="grid gap-4">
              <p>NMLS ID: 2327896</p>
              <p>FinCEN ID: 31000249115048</p>
              <p>Maryland OFR Licensed</p>
              <p>NBE Authorized</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-8">
          <div className="border-t border-white/10 pt-8 text-center text-xs">
            © {new Date().getFullYear()} White Label Pay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
