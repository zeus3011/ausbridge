import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Calendar,
  Check,
  ClipboardList,
  DollarSign,
  Eye,
  Facebook,
  FileText,
  Handshake,
  Instagram,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  PlayCircle,
  Quote,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHomepage } from "@/hooks/useSanityData";
import { getImageUrl } from "@/imageUtils";
import { PageLoader, PageError } from "@/components/SanityLoadingStates";
import { ConsultationModal } from "@/components/ConsultationModal";

const trustIconMap = {
  badgecheck: BadgeCheck,
  clipboardlist: ClipboardList,
  eye: Eye,
  award: Award,
  mararegistered: BadgeCheck,
  structuredcasemanagement: ClipboardList,
  transparentprocess: Eye,
  yearsexperience: Award,
};
const howWeWorkFallbackIcons = [ShieldCheck, FileText, Layers, DollarSign, Handshake];
const insightIconMap = { Calendar, BookOpen, PlayCircle };
const socialIconMap = { linkedin: Linkedin, facebook: Facebook, instagram: Instagram };

const normalizeIconKey = (value?: string) => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export default function Index() {
  const [open, setOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const { data: homepage, isLoading, isError } = useHomepage();

  const shouldOpenConsultationModal = (openInModal?: boolean, link?: string) =>
    Boolean(openInModal || link === "#consultation" || link === "#consultation-modal");

  useEffect(() => {
    const slides = homepage?.hero?.slides || [];
    if (!slides.length) return;

    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [homepage?.hero?.slides]);

  if (isError) return <PageError />;
  if (isLoading && !homepage) return <PageLoader />;

  const navLinks = homepage?.header?.navLinks || [
    { label: "About", link: "#about" },
    { label: "Services", link: "#services" },
    { label: "Success Stories", link: "#success-stories" },
    { label: "Insights", link: "#insights" },
    { label: "Contact", link: "#contact" },
  ];

  const phone = homepage?.header?.phone || "1300 123 AUS";
  const ctaText = homepage?.header?.ctaText || "Book Consultation";
  const ctaLink = homepage?.header?.ctaLink || "#cta";
  const headerLogo = homepage?.header?.logo?.asset?.url;

  const slides = homepage?.hero?.slides || [];
  const currentSlide = slides[slideIndex] || {};
  const heroButtons = [...(currentSlide.buttons || []), ...(currentSlide.button2 || [])];

  const trustItems = homepage?.trustStrip?.trustItems || [];
  const steps = homepage?.howWeWork?.steps || [];
  const servicesSection = homepage?.services?.[0];
  const services = servicesSection?.steps || [];
  const testimonials = homepage?.outcomes?.testimonials || [];
  const about = homepage?.about;
  const aboutImage = about?.image?.asset?.url ? getImageUrl(about.image) : null;
  const insights = homepage?.insights;
  const articles = insights?.articles || [];
  const cta = homepage?.cta;
  const footer = homepage?.footer;
  const footerLogo = footer?.logo?.asset?.url ? getImageUrl(footer.logo) : null;

  return (
    <div className="min-h-screen bg-background">
      {homepage?.header ? (
        <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-sm">
          <div className="container mx-auto flex items-center justify-between py-4 sm:py-5 px-4 gap-2">
            <a href="#" className="flex items-center gap-2 sm:gap-3 min-w-0">
              {headerLogo ? (
                <img src={headerLogo} alt="AusBridge Group" className="h-10 sm:h-12 w-auto object-contain bg-background/95 rounded-sm p-1 flex-shrink-0" />
              ) : (
                <div className="h-10 sm:h-12 w-12 bg-background/95 rounded-sm animate-pulse" />
              )}
              <span className="hidden md:inline text-[11px] font-medium tracking-[0.2em] text-gold whitespace-nowrap">YOUR BRIDGE TO AUSTRALIA</span>
            </a>

            <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
              {navLinks.map((link) => (
                <a key={link.label} href={link.link} className="text-sm font-medium text-primary-foreground/90 hover:text-gold transition-colors whitespace-nowrap">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3 xl:gap-5">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-primary-foreground/90 whitespace-nowrap">
                <Phone className="h-4 w-4 flex-shrink-0" /> {phone}
              </a>
              {shouldOpenConsultationModal(homepage?.header?.ctaOpenInModal, ctaLink) ? (
                <Button variant="hero" size="sm" className="whitespace-nowrap" onClick={() => setConsultationOpen(true)}>
                  {ctaText}
                </Button>
              ) : (
                <Button asChild variant="hero" size="sm" className="whitespace-nowrap">
                  <a href={ctaLink}>{ctaText}</a>
                </Button>
              )}
            </div>

            <button onClick={() => setOpen(!open)} className="lg:hidden text-primary-foreground" aria-label="Menu">
              {open ? <X /> : <Menu />}
            </button>
          </div>

          {open ? (
            <div className="lg:hidden bg-primary text-primary-foreground px-6 pb-6 space-y-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.link} className="block text-sm font-medium hover:text-gold transition-colors" onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ))}
              {shouldOpenConsultationModal(homepage?.header?.ctaOpenInModal, ctaLink) ? (
                <Button variant="hero" size="sm" className="w-full" onClick={() => setConsultationOpen(true)}>
                  {ctaText}
                </Button>
              ) : (
                <Button asChild variant="hero" size="sm" className="w-full">
                  <a href={ctaLink}>{ctaText}</a>
                </Button>
              )}
            </div>
          ) : null}
        </header>
      ) : null}

      {slides.length ? (
        <section id="hero" className="relative min-h-[640px] md:h-[680px] overflow-hidden bg-primary">
          {slides.map((slide, idx) => {
            const image = slide?.backgroundImage?.asset?.url ? getImageUrl(slide.backgroundImage, { width: 1920, height: 1080 }) : null;
            return (
              <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${slideIndex === idx ? "opacity-100" : "opacity-0"}`}>
                {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-primary/70" />}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/30" />
              </div>
            );
          })}

          <div className="container mx-auto relative z-10 h-full flex items-center pt-24 px-4">
            <div className="max-w-2xl text-primary-foreground w-full">
              <p className="text-[10px] xs:text-[11px] tracking-[0.25em] xs:tracking-[0.3em] text-gold mb-4 sm:mb-5">- YOUR BRIDGE TO AUSTRALIA</p>
              <h1 className="font-serif font-bold text-3xl xs:text-4xl md:text-6xl leading-[1.1] md:leading-[1.05] mb-5 sm:mb-6 break-words">{currentSlide.heading}</h1>
              {currentSlide?.subheading ? <p className="text-sm xs:text-base md:text-lg font-light text-primary-foreground/85 max-w-xl mb-6 sm:mb-8">{currentSlide.subheading}</p> : null}
              <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
                {heroButtons.map((btn, idx) => (
                  shouldOpenConsultationModal(btn.openInModal, btn.link) ? (
                    <Button key={idx} variant={idx === 0 ? "hero" : "outlineLight"} size="lg" className="w-full xs:w-auto" onClick={() => setConsultationOpen(true)}>
                      {btn.text}
                      {idx === 0 ? <ArrowRight className="ml-1 h-4 w-4" /> : null}
                    </Button>
                  ) : (
                    <Button key={idx} asChild variant={idx === 0 ? "hero" : "outlineLight"} size="lg" className="w-full xs:w-auto">
                      <a href={btn.link}>
                        {btn.text}
                        {idx === 0 ? <ArrowRight className="ml-1 h-4 w-4" /> : null}
                      </a>
                    </Button>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setSlideIndex(idx)} aria-label={`Slide ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${slideIndex === idx ? "w-8 bg-gold" : "w-4 bg-primary-foreground/40"}`} />
            ))}
          </div>
        </section>
      ) : null}

      {trustItems.length ? (
        <section className="bg-surface py-10">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustItems.map((item, idx) => {
              const iconKey = normalizeIconKey(item.icon);
              const Icon = trustIconMap[iconKey as keyof typeof trustIconMap] || Star;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <p className="font-semibold text-sm text-primary">{item.title}</p>
                  <p className="text-xs text-muted-foreground font-light mt-1">{item.subtitle}</p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {homepage?.howWeWork ? (
        <section id="about" className="bg-background py-20">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              {homepage.howWeWork.tagline ? <p className="text-[11px] tracking-[0.3em] text-gold mb-3">- {homepage.howWeWork.tagline} -</p> : null}
              {homepage.howWeWork.heading ? <h2 className="font-serif font-semibold text-3xl md:text-4xl text-primary mb-4">{homepage.howWeWork.heading}</h2> : null}
              {homepage.howWeWork.subheading ? <p className="text-muted-foreground font-light">{homepage.howWeWork.subheading}</p> : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {steps.map((step, idx) => {
                const icon = step?.icon?.asset?.url ? getImageUrl(step.icon) : null;
                const StepFallbackIcon = howWeWorkFallbackIcons[idx % howWeWorkFallbackIcons.length];
                return (
                  <div key={idx} className="bg-surface rounded-lg p-6 border border-border/50">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mb-5 overflow-hidden">
                      {icon ? <img src={icon} alt={step.title} className="h-5 w-5 object-contain" /> : <StepFallbackIcon className="h-5 w-5 text-gold" />}
                    </div>
                    <h3 className="font-semibold text-primary text-[15px] leading-tight mb-3">{step.title}</h3>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col xs:flex-row items-center justify-center gap-4 mt-12 max-w-xs xs:max-w-none mx-auto">
              {homepage.howWeWork.primaryCTA ? (
                shouldOpenConsultationModal(homepage.howWeWork.primaryCTA.openInModal, homepage.howWeWork.primaryCTA.link) ? (
                  <Button variant="hero" className="w-full xs:w-auto" onClick={() => setConsultationOpen(true)}>
                    {homepage.howWeWork.primaryCTA.text} <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button asChild variant="hero" className="w-full xs:w-auto">
                    <a href={homepage.howWeWork.primaryCTA.link}>
                      {homepage.howWeWork.primaryCTA.text} <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                )
              ) : null}
              {homepage.howWeWork.secondaryCTA ? (
                shouldOpenConsultationModal(homepage.howWeWork.secondaryCTA.openInModal, homepage.howWeWork.secondaryCTA.link) ? (
                  <Button variant="outlinePrimary" className="w-full xs:w-auto" onClick={() => setConsultationOpen(true)}>
                    {homepage.howWeWork.secondaryCTA.text}
                  </Button>
                ) : (
                  <Button asChild variant="outlinePrimary" className="w-full xs:w-auto">
                    <a href={homepage.howWeWork.secondaryCTA.link}>{homepage.howWeWork.secondaryCTA.text}</a>
                  </Button>
                )
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {servicesSection ? (
        <section id="services" className="bg-surface py-20">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              {servicesSection.tagline ? <p className="text-[11px] tracking-[0.3em] text-gold mb-3">- {servicesSection.tagline} -</p> : null}
              {servicesSection.heading ? <h2 className="font-serif font-semibold text-3xl md:text-5xl text-primary mb-4">{servicesSection.heading}</h2> : null}
              {servicesSection.subheading ? <p className="text-muted-foreground font-light">{servicesSection.subheading}</p> : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, idx) => {
                const image = service?.image?.asset?.url ? getImageUrl(service.image) : null;
                return (
                  <article key={idx} className="bg-card rounded-lg overflow-hidden shadow-card border border-border/50 flex flex-col">
                    <div className="relative h-72 overflow-hidden">
                      {image ? <img src={image} alt={service.title} loading="lazy" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-muted" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
                      <h3 className="absolute bottom-4 left-5 text-primary-foreground font-semibold text-lg">{service.title}</h3>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      {service.badge ? <p className="text-[10px] tracking-[0.15em] text-gold font-medium mb-3 pb-3 border-b border-border">{service.badge}</p> : null}
                      {service.items?.length ? (
                        <ul className="space-y-2 flex-1">
                          {service.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex gap-2 text-sm text-muted-foreground font-light">
                              <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <a href={service.link || "#"} className="mt-4 text-sm font-medium text-primary inline-flex items-center gap-1 hover:text-accent">
                        Learn more <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {(servicesSection.primaryCTA || servicesSection.secondaryCTA) ? (
              <div className="flex flex-col xs:flex-row items-center justify-center gap-4 mt-12">
                {servicesSection.primaryCTA ? (
                  shouldOpenConsultationModal(servicesSection.primaryCTA.openInModal, servicesSection.primaryCTA.link) ? (
                    <Button variant="hero" className="w-full xs:w-auto" onClick={() => setConsultationOpen(true)}>
                      {servicesSection.primaryCTA.text} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button asChild variant="hero" className="w-full xs:w-auto">
                      <a href={servicesSection.primaryCTA.link}>
                        {servicesSection.primaryCTA.text} <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                  )
                ) : null}
                {servicesSection.secondaryCTA ? (
                  shouldOpenConsultationModal(servicesSection.secondaryCTA.openInModal, servicesSection.secondaryCTA.link) ? (
                    <Button variant="outlinePrimary" className="w-full xs:w-auto" onClick={() => setConsultationOpen(true)}>
                      {servicesSection.secondaryCTA.text}
                    </Button>
                  ) : (
                    <Button asChild variant="outlinePrimary" className="w-full xs:w-auto">
                      <a href={servicesSection.secondaryCTA.link}>{servicesSection.secondaryCTA.text}</a>
                    </Button>
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {testimonials.length ? (
        <section id="success-stories" className="bg-background py-20">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              {homepage?.outcomes?.tagline ? <p className="text-[11px] tracking-[0.3em] text-gold mb-3">- {homepage.outcomes.tagline} -</p> : null}
              {homepage?.outcomes?.heading ? <h2 className="font-serif font-semibold text-3xl md:text-4xl text-primary">{homepage.outcomes.heading}</h2> : null}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((item, idx) => (
                <div key={idx} className="bg-surface rounded-lg p-7 border border-border/50">
                  <Quote className="h-6 w-6 text-gold mb-5" />
                  <p className="text-sm text-primary/80 font-light leading-relaxed mb-6">"{item.quote}"</p>
                  <div className="pt-5 border-t border-border">
                    <p className="font-semibold text-sm text-primary">{item.clientName}</p>
                    <p className="text-xs text-muted-foreground font-light mt-1">{item.visaCategory}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {about ? (
        <section className="bg-surface py-20">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:pl-16 xl:pl-24">
              <p className="text-[11px] tracking-[0.3em] text-gold mb-4">- ABOUT AUSBRIDGE CONSULTANTS</p>
              <h2 className="font-serif font-semibold text-3xl md:text-4xl text-primary leading-tight mb-6">{about.title}</h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-8">{about.description}</p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium">
                Learn More About Us <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="relative flex justify-center">
              {aboutImage ? <img src={aboutImage} alt={about.title} loading="lazy" className="rounded-md shadow-elevated w-full max-w-md object-contain" /> : <div className="rounded-md bg-muted w-full max-w-md h-[420px]" />}
            </div>
          </div>
        </section>
      ) : null}

      {insights ? (
        <section id="insights" className="bg-background py-20">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
              <div>
                {insights.tagline ? <p className="text-[11px] tracking-[0.3em] text-gold mb-3 flex items-center gap-2"><span className="h-px w-6 bg-gold" /> {insights.tagline}</p> : null}
                {insights.heading ? <h2 className="font-serif font-semibold text-3xl md:text-4xl text-primary leading-tight">{insights.heading}</h2> : null}
              </div>
              {insights.viewAllLink ? <a href={insights.viewAllLink} className="text-sm font-medium text-primary inline-flex items-center gap-2 hover:text-accent">View All Insights <ArrowRight className="h-4 w-4" /></a> : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article, idx) => {
                const Icon = insightIconMap[article.icon as keyof typeof insightIconMap] || Newspaper;
                return (
                  <article key={idx} className="bg-card rounded-lg p-6 border border-border/60 flex flex-col">
                    <span className="inline-flex items-center gap-2 self-start bg-muted text-primary text-xs font-medium px-3 py-1 rounded-full mb-6">
                      <Icon className="h-3.5 w-3.5 text-accent" />
                      {article.tag}
                    </span>
                    <h3 className="font-semibold text-primary text-lg leading-snug mb-4">{article.title}</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6 flex-1">{article.description}</p>
                    <a href={article.link} className="text-sm font-medium text-primary inline-flex items-center gap-2 hover:text-accent">Read more <ArrowRight className="h-3.5 w-3.5" /></a>
                  </article>
                );
              })}
            </div>

            {insights.viewAllLink ? (
              <div className="text-center mt-8">
                <Button asChild variant="outline">
                  <a href={insights.viewAllLink}>View All Articles</a>
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {cta ? (
        <section className="bg-primary py-20 text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--gold)/0.15),transparent_60%)]" />
          <div className="container mx-auto relative">
            {cta.tagline ? <p className="text-[11px] tracking-[0.3em] text-gold mb-4">- {cta.tagline} -</p> : null}
            {cta.heading ? <h2 className="font-serif font-bold text-3xl md:text-5xl mb-6 leading-tight">{cta.heading}</h2> : null}
            {cta.description ? <p className="text-primary-foreground/80 font-light max-w-xl mx-auto mb-8">{cta.description}</p> : null}
            {(cta.buttonText || cta.buttonLink) ? (
              shouldOpenConsultationModal(cta.openInModal, cta.buttonLink) ? (
                <Button variant="hero" size="lg" onClick={() => setConsultationOpen(true)}>
                  {cta.buttonText || "Book Consultation"} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button asChild variant="hero" size="lg">
                  <a href={cta.buttonLink || "#contact"}>
                    {cta.buttonText || "Book Consultation"} <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              )
            ) : null}
          </div>
        </section>
      ) : null}

      {footer ? (
        <footer id="contact" className="bg-primary text-primary-foreground py-14 border-t border-primary-foreground/10">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              {footerLogo ? <img src={footerLogo} alt="AusBridge Group" className="h-14 w-auto object-fit rounded bg-background/95 p-1 mb-4" /> : null}
              {footer.tagline ? <p className="text-[10px] tracking-[0.25em] text-gold font-medium mb-3">{footer.tagline}</p> : null}
              {footer.description ? <p className="text-xs text-primary-foreground/70 font-light leading-relaxed">{footer.description}</p> : null}
            </div>

            <div>
              <p className="text-[11px] tracking-[0.2em] font-semibold mb-5">CONTACT</p>
              <ul className="space-y-3 text-sm font-light text-primary-foreground/80">
                {footer.contact?.phone ? <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> {footer.contact.phone}</li> : null}
                {footer.contact?.email ? <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> {footer.contact.email}</li> : null}
                {footer.contact?.address ? <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" /><span>{footer.contact.address}</span></li> : null}
              </ul>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.2em] font-semibold mb-5">QUICK LINKS</p>
              <ul className="space-y-3 text-sm font-light text-primary-foreground/80">
                {(footer.quickLinks || []).map((link, idx) => (
                  <li key={idx}><a href={link.link} className="hover:text-gold">{link.label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.2em] font-semibold mb-5">COMPLIANCE</p>
              <ul className="space-y-3 text-sm font-light text-primary-foreground/80">
                {footer.compliance?.marn ? <li>MARN: {footer.compliance.marn}</li> : null}
                {(footer.compliance?.details || []).map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
              <div className="flex gap-3 mt-5">
                {(footer.socialLinks || []).map((social, idx) => {
                  const Icon = socialIconMap[social.platform?.toLowerCase() as keyof typeof socialIconMap] || Linkedin;
                  return (
                    <a key={idx} href={social.url} aria-label={social.platform} className="h-8 w-8 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between text-xs font-light text-primary-foreground/60">
            <p>{footer.copyright}</p>
            {footer.compliance?.marn ? <p>Registered Migration Agent | MARN {footer.compliance.marn}</p> : null}
          </div>
        </footer>
      ) : null}

      <ConsultationModal
        open={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        content={homepage?.consultationModal}
      />
    </div>
  );
}
