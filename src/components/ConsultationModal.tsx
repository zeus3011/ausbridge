import { useEffect, useState } from "react";
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
  interest: z.enum(["Study", "Work", "PR", "Business", "General"], {
    errorMap: () => ({ message: "Please select an interest" }),
  }),
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

const initial: FormState = {
  fullName: "",
  email: "",
  phone: "+61 ",
  interest: "",
  agree: false,
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ConsultationModal = ({ open, onClose }: Props) => {
  const [form, setForm] = useState<FormState>(initial);
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

  if (!open) return null;

  const validateField = (name: keyof FormState, value: any) => {
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
      setForm(initial);
      setErrors({});
      setSubmitted(false);
    }, 200);
  };

  const inputBase =
    "w-full rounded-[12px] border bg-white px-4 py-3 text-sm font-normal text-primary placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 transition";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-primary/40 backdrop-blur-md animate-fade-in"
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
          <div className="px-8 py-12 text-center">
            <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-2xl text-primary mb-3">Thank you!</h3>
            <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6">
              Your consultation request has been received. A MARA-registered advisor will reach out within 1 business day.
            </p>
            <Button
              onClick={handleClose}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              size="lg"
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="px-7 py-8 sm:px-8">
            <p className="text-[11px] tracking-[0.3em] text-gold mb-3">— FREE CONSULTATION —</p>
            <h3 className="font-semibold text-2xl text-primary mb-2 leading-tight">
              Book Your Free Consultation
            </h3>
            <p className="text-sm font-light text-muted-foreground mb-6">
              Share a few details and an advisor will be in touch.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value });
                    validateField("fullName", e.target.value);
                  }}
                  className={`${inputBase} ${errors.fullName ? "border-destructive" : "border-border"}`}
                  placeholder="Jane Smith"
                />
                {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    validateField("email", e.target.value);
                  }}
                  className={`${inputBase} ${errors.email ? "border-destructive" : "border-border"}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    validateField("phone", e.target.value);
                  }}
                  className={`${inputBase} ${errors.phone ? "border-destructive" : "border-border"}`}
                  placeholder="+61 400 000 000"
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-primary mb-1.5">
                  Interest <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.interest}
                  onChange={(e) => {
                    setForm({ ...form, interest: e.target.value });
                    validateField("interest", e.target.value);
                  }}
                  className={`${inputBase} ${errors.interest ? "border-destructive" : "border-border"}`}
                >
                  <option value="" disabled>Select an option</option>
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="PR">PR</option>
                  <option value="Business">Business</option>
                  <option value="General">General</option>
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
                  I agree to the{" "}
                  <a href="#" className="text-primary font-medium underline-offset-2 hover:underline">Terms</a>{" "}
                  &{" "}
                  <a href="#" className="text-primary font-medium underline-offset-2 hover:underline">Privacy Policy</a>
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
                {submitting ? "Submitting..." : "Book My Consultation"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};