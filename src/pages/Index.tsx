import { useEffect, useState, createContext, useContext } from "react";
import {
  ShieldCheck,
  ClipboardList,
  Eye,
  Award,
  BadgeCheck,
  ScrollText,
  Layers,
  DollarSign,
  HeartHandshake,
  ArrowRight,
  Check,
  Quote,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Facebook,
  Instagram,
  Menu,
  X,
  Calendar,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import heroSydney from "@/assets/hero-sydney.png";
import heroMelbourne from "@/assets/hero-melbourne.jpg";
import serviceSkilled from "@/assets/service-skilled.jpg";
import serviceEmployer from "@/assets/service-employer.jpg";
import serviceFamily from "@/assets/service-family.jpg";
import serviceComplex from "@/assets/service-complex.jpg";
import aboutAdvisor from "@/assets/about-advisor.jpg";
import { ConsultationModal } from "@/components/ConsultationModal";

const ConsultationCtx = createContext<() => void>(() => {});
const useOpenConsultation = () => useContext(ConsultationCtx);

/* ---------- HEADER ---------- */
const Header = () => {
  const [open, setOpen] = useState(false);
  const openConsult = useOpenConsultation();
  const links = ["About", "Services", "Success Stories", "Insights", "Contact"];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 sm:py-5 px-4 gap-2">
        <a href="#" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src={logo} alt="AusBridge Consultants" className="h-8 sm:h-9 w-auto rounded-sm bg-background/90 p-1 flex-shrink-0" />
          <span className="hidden md:inline text-[11px] font-medium tracking-[0.2em] text-gold whitespace-nowrap">
            YOUR BRIDGE TO AUSTRALIA
          </span>
        </a>
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="text-sm font-medium text-primary-foreground/90 hover:text-gold transition-colors whitespace-nowrap">
              {l}
            </a>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3 xl:gap-5">
          <a href="tel:1300123287" className="flex items-center gap-2 text-sm text-primary-foreground/90 whitespace-nowrap">
            <Phone className="h-4 w-4 flex-shrink-0" /> 1300 123 AUS
          </a>
          <Button variant="hero" size="sm" onClick={openConsult} className="whitespace-nowrap">Book Consultation</Button>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden text-primary-foreground" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-primary text-primary-foreground px-6 pb-6 space-y-4">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} className="block text-sm font-medium">
              {l}
            </a>
          ))}
          <Button variant="hero" size="sm" className="w-full" onClick={openConsult}>Book Consultation</Button>
        </div>
      )}
    </header>
  );
};

/* ---------- HERO ---------- */
const heroSlides = [
  {
    image: heroSydney,
    eyebrow: "YOUR BRIDGE TO AUSTRALIA",
    title: ["Your Trusted Guide,", "Every Step to Australia"],
    sub: "Expert mentorship and responsible advice — from first consultation to your new life Down Under.",
  },
  {
    image: heroMelbourne,
    eyebrow: "YOUR BRIDGE TO AUSTRALIA",
    title: ["Your Trusted Guide,", "Every Step to Australia"],
    sub: "Expert mentorship and responsible advice — from first consultation to your new life Down Under.",
  },
];

const Hero = () => {
  const [i, setI] = useState(0);
  const openConsult = useOpenConsultation();
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative h-[640px] md:h-[680px] overflow-hidden bg-primary">
      {heroSlides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/30" />
        </div>
      ))}
      <Header />
      <div className="container mx-auto relative z-10 h-full flex items-center pt-24">
        <div className="max-w-2xl text-primary-foreground">
          <p className="text-[11px] tracking-[0.3em] text-gold mb-5">
            — {heroSlides[i].eyebrow}
          </p>
          <h1 className="font-serif font-bold text-4xl md:text-6xl leading-[1.05] mb-6">
            {heroSlides[i].title[0]}
            <br />
            {heroSlides[i].title[1]}
          </h1>
          <p className="text-base md:text-lg font-light text-primary-foreground/85 max-w-xl mb-8">
            {heroSlides[i].sub}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" onClick={openConsult}>
              Start Your Free Consultation <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="outlineLight" size="lg">
              View Pathways
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gold" : "w-4 bg-primary-foreground/40"}`}
          />
        ))}
      </div>
    </section>
  );
};

/* ---------- TRUST STRIP ---------- */
const trust = [
  { icon: BadgeCheck, title: "MARA Registered", sub: "Licensed migration agent" },
  { icon: ClipboardList, title: "Structured Case Management", sub: "Clear process & timeline" },
  { icon: Eye, title: "Transparent Process", sub: "No hidden fees or surprises" },
  { icon: Award, title: "15+ Years Experience", sub: "Trusted since 2009" },
];
const TrustStrip = () => (
  <section className="bg-surface py-10">
    <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {trust.map((t) => (
        <div key={t.title} className="flex flex-col items-center text-center">
          <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center mb-3">
            <t.icon className="h-5 w-5 text-accent" />
          </div>
          <p className="font-semibold text-sm text-primary">{t.title}</p>
          <p className="text-xs text-muted-foreground font-light mt-1">{t.sub}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ---------- HOW WE WORK ---------- */
const principles = [
  { icon: ShieldCheck, title: "Registered Migration Agent", text: "MARA-registered advisors representing you with full accountability." },
  { icon: ScrollText, title: "Code of Conduct", text: "Aligned to the MARA Code of Conduct in every engagement." },
  { icon: Layers, title: "Structured Process", text: "Clear stages from eligibility to lodgement and decision." },
  { icon: DollarSign, title: "Transparent Fees", text: "Fixed-scope quotes. No surprises. No hidden charges." },
  { icon: HeartHandshake, title: "Dedicated Support", text: "A single point of contact through your entire matter." },
];
const HowWeWork = () => {
  const openConsult = useOpenConsultation();
  return (
  <section id="about" className="bg-background py-20">
    <div className="container mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-[11px] tracking-[0.3em] text-gold mb-3">— HOW WE WORK —</p>
        <h2 className="font-serif font-semibold text-3xl md:text-4xl text-primary mb-4">
          An advisory-grade approach to migration
        </h2>
        <p className="text-muted-foreground font-light">
          Five principles that shape every matter we take on — built to give you clarity at every stage.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {principles.map((p) => (
          <div key={p.title} className="bg-surface rounded-lg p-6 border border-border/50">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mb-5">
              <p.icon className="h-5 w-5 text-gold" />
            </div>
            <h3 className="font-semibold text-primary text-[15px] leading-tight mb-3">{p.title}</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-12">
        <Button variant="hero">Explore All Services <ArrowRight className="ml-1 h-4 w-4" /></Button>
        <Button variant="outlinePrimary" onClick={openConsult}>Book Consultation</Button>
      </div>
    </div>
  </section>
);
};

/* ---------- SERVICES ---------- */
const services = [
  {
    img: serviceSkilled,
    title: "Skilled Migration",
    badge: "189 / 190 / 491 VISA APPROVED",
    items: ["Skills assessment guidance", "EOI strategy & ranking review"],
  },
  {
    img: serviceEmployer,
    title: "Employer Sponsored",
    badge: "482 / 186 / 494 PATHWAYS",
    items: ["Sponsor accreditation support", "Nomination & visa lodgement"],
  },
  {
    img: serviceFamily,
    title: "Partner & Family",
    badge: "PARTNER & PARENT VISA APPROVED",
    items: ["Relationship evidence strategy", "Sponsorship & combined applications"],
  },
  {
    img: serviceComplex,
    title: "Complex Cases",
    badge: "REFUSALS · AAT · MINISTERIAL",
    items: ["Refusal & cancellation review", "AAT and judicial appeals"],
  },
];
const Services = () => {
  const openConsult = useOpenConsultation();
  return (
  <section id="services" className="bg-surface py-20">
    <div className="container mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-[11px] tracking-[0.3em] text-gold mb-3">— OUR SERVICES —</p>
        <h2 className="font-serif font-semibold text-3xl md:text-4xl text-primary mb-4">
          Visa pathways, expertly managed
        </h2>
        <p className="text-muted-foreground font-light">
          From skilled independent migration to complex appeals — a tailored strategy for every case.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s) => (
          <article key={s.title} className="bg-card rounded-lg overflow-hidden shadow-card border border-border/50 flex flex-col">
            <div className="relative h-72 overflow-hidden">
              <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
              <h3 className="absolute bottom-4 left-5 text-primary-foreground font-semibold text-lg">{s.title}</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-[10px] tracking-[0.15em] text-gold font-medium mb-3 pb-3 border-b border-border">
                {s.badge}
              </p>
              <ul className="space-y-2 flex-1">
                {s.items.map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-muted-foreground font-light">
                    <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className="mt-4 text-sm font-medium text-primary inline-flex items-center gap-1 hover:text-accent">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-12">
        <Button variant="hero">Explore All Services <ArrowRight className="ml-1 h-4 w-4" /></Button>
        <Button variant="outlinePrimary" onClick={openConsult}>Book Consultation</Button>
      </div>
    </div>
  </section>
);
};

/* ---------- CLIENT OUTCOMES ---------- */
const outcomes = [
  {
    quote: "AusBridge gave us a clear, staged plan from day one. Every fee was disclosed upfront — we always knew where we stood.",
    name: "Priya & Arjun S.",
    sub: "Subclass 189 — Software Engineer",
  },
  {
    quote: "Their structured approach to our 482 nomination saved months. The advisor was responsive, precise and genuinely invested.",
    name: "Marcus L.",
    sub: "Subclass 482 — Hospitality",
  },
  {
    quote: "After a refusal elsewhere, AusBridge rebuilt our partner application from the ground up. Approved on first reassessment.",
    name: "Elena & James R.",
    sub: "Subclass 820/801 — Partner",
  },
];
const Outcomes = () => (
  <section id="success-stories" className="bg-background py-20">
    <div className="container mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-[11px] tracking-[0.3em] text-gold mb-3">— CLIENT OUTCOMES —</p>
        <h2 className="font-serif font-semibold text-3xl md:text-4xl text-primary">
          Trusted by professionals and families
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outcomes.map((o) => (
          <div key={o.name} className="bg-surface rounded-lg p-7 border border-border/50">
            <Quote className="h-6 w-6 text-gold mb-5" />
            <p className="text-sm text-primary/80 font-light leading-relaxed mb-6">"{o.quote}"</p>
            <div className="pt-5 border-t border-border">
              <p className="font-semibold text-sm text-primary">{o.name}</p>
              <p className="text-xs text-muted-foreground font-light mt-1">{o.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- ABOUT ---------- */
const About = () => (
  <section className="bg-surface py-20">
    <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <div className="lg:pl-16 xl:pl-24">
        <p className="text-[11px] tracking-[0.3em] text-gold mb-4">— ABOUT AUSBRIDGE CONSULTANTS</p>
        <h2 className="font-serif font-semibold text-3xl md:text-4xl text-primary leading-tight mb-6">
          Migration advice, delivered with care and rigour
        </h2>
        <p className="text-muted-foreground font-light leading-relaxed mb-4">
          For over 15 years, AusBridge Consultants has helped skilled professionals, families and employers navigate Australia's migration framework with clarity. We combine deep regulatory knowledge with a structured case-management process — every matter is led by a registered advisor and supported by a dedicated team.
        </p>
        <p className="text-muted-foreground font-light leading-relaxed mb-8">
          Our practice is built on three commitments: transparent fees, principled advice, and a single point of contact through every stage of your case.
        </p>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium">
          Learn More About Us <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="relative flex justify-center">
        <img
          src={aboutAdvisor}
          alt="AusBridge senior migration advisor"
          loading="lazy"
          className="rounded-md shadow-elevated w-full max-w-md"
        />
      </div>
    </div>
  </section>
);

/* ---------- INSIGHTS ---------- */
const insights = [
  {
    icon: Calendar,
    tag: "Update",
    title: "2025 Skilled Occupation List: What Changed",
    text: "A breakdown of the new Core Skills Occupation List and what it means for prospective applicants.",
  },
  {
    icon: BookOpen,
    tag: "Guide",
    title: "Subclass 482: A Step-by-Step Lodgement Guide",
    text: "From sponsor accreditation through nomination to the visa application — practical guidance for employers.",
  },
  {
    icon: PlayCircle,
    tag: "Video",
    title: "Partner Visa Evidence: What Case Officers Look For",
    text: "A short walk-through of the four pillars of relationship evidence and how to document them properly.",
  },
];
const Insights = () => (
  <section id="insights" className="bg-background py-20">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
        <div>
          <p className="text-[11px] tracking-[0.3em] text-gold mb-3 flex items-center gap-2">
            <span className="h-px w-6 bg-gold" /> INSIGHTS
          </p>
          <h2 className="font-serif font-semibold text-3xl md:text-4xl text-primary leading-tight">
            Updates, guides and<br />analysis
          </h2>
        </div>
        <a href="#" className="text-sm font-medium text-primary inline-flex items-center gap-2 hover:text-accent">
          View All Insights <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((it) => (
          <article key={it.title} className="bg-card rounded-lg p-6 border border-border/60 flex flex-col">
            <span className="inline-flex items-center gap-2 self-start bg-muted text-primary text-xs font-medium px-3 py-1 rounded-full mb-6">
              <it.icon className="h-3.5 w-3.5 text-accent" />
              {it.tag}
            </span>
            <h3 className="font-semibold text-primary text-lg leading-snug mb-4">{it.title}</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6 flex-1">{it.text}</p>
            <a href="#" className="text-sm font-medium text-primary inline-flex items-center gap-2 hover:text-accent">
              Read more <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- CTA ---------- */
const CTA = () => {
  const openConsult = useOpenConsultation();
  return (
  <section className="bg-primary py-20 text-primary-foreground text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--gold)/0.15),transparent_60%)]" />
    <div className="container mx-auto relative">
      <p className="text-[11px] tracking-[0.3em] text-gold mb-4">— BEGIN YOUR JOURNEY —</p>
      <h2 className="font-serif font-bold text-3xl md:text-5xl mb-6 leading-tight">
        Ready to Move Forward<br />with Clarity?
      </h2>
      <p className="text-primary-foreground/80 font-light max-w-xl mx-auto mb-8">
        Book a complimentary 30-minute consultation with a MARA-registered AusBridge advisor. No obligation, no fees — just a clear next step.
      </p>
      <Button variant="hero" size="lg" onClick={openConsult}>
        Book Your Free Consultation <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  </section>
);
};

/* ---------- FOOTER ---------- */
const Footer = () => (
  <footer id="contact" className="bg-primary text-primary-foreground py-14 border-t border-primary-foreground/10">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <img src={logo} alt="AusBridge" className="h-10 w-auto rounded bg-background/95 p-1 mb-4" />
        <p className="text-[10px] tracking-[0.25em] text-gold font-medium mb-3">YOUR BRIDGE TO AUSTRALIA</p>
        <p className="text-xs text-primary-foreground/70 font-light leading-relaxed">
          AusBridge Consultants — registered migration advisory delivering structured, transparent pathways to Australia.
        </p>
      </div>
      <div>
        <p className="text-[11px] tracking-[0.2em] font-semibold mb-5">CONTACT</p>
        <ul className="space-y-3 text-sm font-light text-primary-foreground/80">
          <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> 1300 123 AUS</li>
          <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> hello@ausbridgeconsultants.com.au</li>
          <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>Level 12, 367 Collins Street<br />Melbourne VIC 3000</span></li>
        </ul>
      </div>
      <div>
        <p className="text-[11px] tracking-[0.2em] font-semibold mb-5">QUICK LINKS</p>
        <ul className="space-y-3 text-sm font-light text-primary-foreground/80">
          <li><a href="#about" className="hover:text-gold">About Us</a></li>
          <li><a href="#services" className="hover:text-gold">Services</a></li>
          <li><a href="#success-stories" className="hover:text-gold">Success Stories</a></li>
          <li><a href="#" className="hover:text-gold">Insights</a></li>
          <li><a href="#" className="hover:text-gold">Book Consultation</a></li>
        </ul>
      </div>
      <div>
        <p className="text-[11px] tracking-[0.2em] font-semibold mb-5">COMPLIANCE</p>
        <ul className="space-y-3 text-sm font-light text-primary-foreground/80">
          <li>MARN: 2218006</li>
          <li>MARA Registered Agent</li>
          <li>Code of Conduct Aligned</li>
        </ul>
        <div className="flex gap-3 mt-5">
          {[Linkedin, Facebook, Instagram].map((Ic, i) => (
            <a key={i} href="#" aria-label="social" className="h-8 w-8 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <Ic className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="container mx-auto mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between text-xs font-light text-primary-foreground/60">
      <p>© 2026 AusBridge Consultants. All rights reserved.</p>
      <p>Registered Migration Agent · MARN 2218006</p>
    </div>
  </footer>
);

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <ConsultationCtx.Provider value={() => setModalOpen(true)}>
      <main>
        <Hero />
        <TrustStrip />
        <HowWeWork />
        <Services />
        <Outcomes />
        <About />
        <Insights />
        <CTA />
        <Footer />
      </main>
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </ConsultationCtx.Provider>
  );
};

export default Index;