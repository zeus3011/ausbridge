import { useEffect, useMemo, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Phone number is required")
    .max(20, "Phone number too long")
    .regex(/^\+?[0-9\s\-()]+$/, "Use digits, spaces, +, -, ()"),
  interest: z.string().trim().min(1, "Please select an interest"),
  agree: z.literal(true, {
    errorMap: () => ({ message: "You must agree to continue" }),
  }),
});

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  interest: string;
  agree: boolean;
};

interface ModalContent {
  tagline?: string;
  heading?: string;
  subheading?: string;
  fullNameLabel?: string;
  fullNamePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  defaultPhonePrefix?: string;
  interestLabel?: string;
  interestPlaceholder?: string;
  interestOptions?: string[];
  consentPrefix?: string;
  termsLabel?: string;
  termsLink?: string;
  privacyLabel?: string;
  privacyLink?: string;
  submitButtonText?: string;
  submittingButtonText?: string;
  successHeading?: string;
  successMessage?: string;
  successCloseText?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  content?: ModalContent;
}

export const ConsultationModal = ({ open, onClose, content }: Props) => {
  const defaults = useMemo(
    () => ({
      tagline: content?.tagline || "FREE CONSULTATION",
      heading: content?.heading || "Book Your Free Consultation",
      subheading: content?.subheading || "Share a few details and an advisor will be in touch.",
      fullNameLabel: content?.fullNameLabel || "Full Name",
      fullNamePlaceholder: content?.fullNamePlaceholder || "Jane Smith",
      emailLabel: content?.emailLabel || "Email",
      emailPlaceholder: content?.emailPlaceholder || "you@example.com",
      phoneLabel: content?.phoneLabel || "Phone Number",
      phonePlaceholder: content?.phonePlaceholder || "+61 400 000 000",
      defaultPhonePrefix: content?.defaultPhonePrefix || "+61 ",
      interestLabel: content?.interestLabel || "Interest",
      interestPlaceholder: content?.interestPlaceholder || "Select an option",
      interestOptions: content?.interestOptions?.length ? content.interestOptions : ["Study", "Work", "PR", "Business", "General"],
      consentPrefix: content?.consentPrefix || "I agree to the",
      termsLabel: content?.termsLabel || "Terms",
      termsLink: content?.termsLink || "#",
      privacyLabel: content?.privacyLabel || "Privacy Policy",
      privacyLink: content?.privacyLink || "#",
      submitButtonText: content?.submitButtonText || "Book My Consultation",
      submittingButtonText: content?.submittingButtonText || "Submitting...",
      successHeading: content?.successHeading || "Thank you!",
      successMessage:
        content?.successMessage ||
        "Your consultation request has been received. A MARA-registered advisor will reach out within 1 business day.",
      successCloseText: content?.successCloseText || "Close",
    }),
    [content]
  );

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: defaults.defaultPhonePrefix,
    interest: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setForm((prev) => ({ ...prev, phone: prev.phone.trim() ? prev.phone : defaults.defaultPhonePrefix }));
  }, [open, defaults.defaultPhonePrefix]);

  if (!open) return null;

  const validateField = (name: keyof FormState, value: string | boolean) => {
    const next = { ...form, [name]: value };
    const result = schema.safeParse(next);
    if (result.success) {
      setErrors((e) => {
        const { [name]: _, ...rest } = e;
        return rest;
      });
    } else {
      const fieldErr = result.error.issues.find((i) => i.path[0] === name);
      setErrors((e) => ({ ...e, [name]: fieldErr ? fieldErr.message : "" }));
      if (!fieldErr) {
        setErrors((e) => {
          const { [name]: _, ...rest } = e;
          return rest;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0] as string;
        if (!errs[k]) errs[k] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("consultation_requests").insert({
      full_name: result.data.fullName,
      email: result.data.email,
      phone: result.data.phone,
      interest: result.data.interest,
    });
    setSubmitting(false);
    if (error) {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setForm({
        fullName: "",
        email: "",
        phone: defaults.defaultPhonePrefix,
        interest: "",
        agree: false,
      });
      setErrors({});
      setSubmitted(false);
    }, 200);
  };

  const inputBase =
    "w-full rounded-[12px] border bg-white px-4 py-3 text-sm font-normal text-primary placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 transition";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-3 sm:px-4 py-4 sm:py-6 bg-primary/40 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-[#F6F2EB] shadow-elevated animate-scale-in"
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 h-9 w-9 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="px-5 sm:px-8 py-10 sm:py-12 text-center">
            <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-2xl text-primary mb-3">{defaults.successHeading}</h3>
            <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6">{defaults.successMessage}</p>
            <Button
              onClick={handleClose}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              size="lg"
            >
              {defaults.successCloseText}
            </Button>
          </div>
        ) : (
          <div className="px-5 py-6 xs:px-7 xs:py-8 sm:px-8">
            <p className="text-[11px] tracking-[0.3em] text-gold mb-3">- {defaults.tagline} -</p>
            <h3 className="font-semibold text-2xl text-primary mb-2 leading-tight">{defaults.heading}</h3>
            <p className="text-sm font-light text-muted-foreground mb-6">{defaults.subheading}</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">
                  {defaults.fullNameLabel} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value });
                    validateField("fullName", e.target.value);
                  }}
                  className={`${inputBase} ${errors.fullName ? "border-destructive" : "border-border"}`}
                  placeholder={defaults.fullNamePlaceholder}
                />
                {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">
                  {defaults.emailLabel} <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    validateField("email", e.target.value);
                  }}
                  className={`${inputBase} ${errors.email ? "border-destructive" : "border-border"}`}
                  placeholder={defaults.emailPlaceholder}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">
                  {defaults.phoneLabel} <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    validateField("phone", e.target.value);
                  }}
                  className={`${inputBase} ${errors.phone ? "border-destructive" : "border-border"}`}
                  placeholder={defaults.phonePlaceholder}
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">
                  {defaults.interestLabel} <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.interest}
                  onChange={(e) => {
                    setForm({ ...form, interest: e.target.value });
                    validateField("interest", e.target.value);
                  }}
                  className={`${inputBase} ${errors.interest ? "border-destructive" : "border-border"}`}
                >
                  <option value="" disabled>
                    {defaults.interestPlaceholder}
                  </option>
                  {defaults.interestOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.interest && <p className="text-xs text-destructive mt-1">{errors.interest}</p>}
              </div>

              <label className="flex items-start gap-3 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => {
                    setForm({ ...form, agree: e.target.checked });
                    validateField("agree", e.target.checked);
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-border accent-[hsl(var(--primary))]"
                />
                <span className="text-xs text-muted-foreground font-light leading-relaxed">
                  {defaults.consentPrefix}{" "}
                  <a href={defaults.termsLink} className="text-primary font-medium underline-offset-2 hover:underline">
                    {defaults.termsLabel}
                  </a>{" "}
                  &{" "}
                  <a href={defaults.privacyLink} className="text-primary font-medium underline-offset-2 hover:underline">
                    {defaults.privacyLabel}
                  </a>
                  <span className="text-destructive"> *</span>
                </span>
              </label>
              {errors.agree && <p className="text-xs text-destructive -mt-2">{errors.agree}</p>}

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium mt-2"
              >
                {submitting ? defaults.submittingButtonText : defaults.submitButtonText}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
