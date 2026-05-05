"use client";

import { useEffect, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/src/components/analytics/analytics-provider";

type LeadFormProps = {
  formId: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  source: string;
  className?: string;
  showMessage?: boolean;
  microcopy?: string;
  autoFocusFirstInput?: boolean;
};

const inputClass =
  "w-full rounded-xl border border-white/14 bg-black/24 px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/38 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-500/15";

export function LeadForm({
  formId,
  title = "Get a quick IT plan",
  description = "Share the basics. A real technician will follow up with a practical next step.",
  submitLabel = "Send my request",
  source,
  className = "",
  showMessage = false,
  microcopy = "No pressure. We use this to follow up with the right person and a practical next step.",
  autoFocusFirstInput = false,
}: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const didAutoFocusRef = useRef(false);

  useEffect(() => {
    if (!autoFocusFirstInput || didAutoFocusRef.current || !formRef.current || !firstInputRef.current) return;

    const focusFirstInput = () => {
      const active = document.activeElement;
      if (active && active !== document.body && active !== document.documentElement) {
        didAutoFocusRef.current = true;
        return;
      }

      firstInputRef.current?.focus({ preventScroll: true });
      didAutoFocusRef.current = true;
    };

    if (!("IntersectionObserver" in window)) {
      focusFirstInput();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || didAutoFocusRef.current) return;
        focusFirstInput();
        observer.disconnect();
      },
      { threshold: 0.55 }
    );

    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, [autoFocusFirstInput]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      type: "msp",
      name: String(fd.get("name") || "").trim(),
      company: String(fd.get("company") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      message:
        String(fd.get("message") || "").trim() ||
        `MSP lead from ${source}. Please follow up with a quick IT plan or consultation.`,
      leadSource: source,
      website: String(fd.get("website") || "").trim(),
    };

    setError(null);
    setSuccess(null);

    if (!payload.name || !payload.company || !payload.email || !payload.phone) {
      setError("Please add your name, company, email, and phone.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: { error?: string } = {};
      try {
        data = (await res.json()) as { error?: string };
      } catch {}

      if (!res.ok) throw new Error(data.error || "Unable to send right now.");

      trackAnalyticsEvent({
        eventType: "form_submit",
        elementId: formId,
        section: form.getAttribute("data-analytics-section") || undefined,
        metadata: { source },
      });
      setSuccess("Thanks. We received it and will follow up soon.");
      form.reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to send right now.";
      trackAnalyticsEvent({ eventType: "form_error", elementId: formId, metadata: { source, message } });
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      data-form-id={formId}
      data-analytics-section={source}
      className={`rounded-2xl border border-white/12 bg-white/6 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur ${className}`}
    >
      <input name="website" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />
      <div>
        <h2 className="text-xl font-semibold tracking-[0.01em] text-white">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/68">{description}</p>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input ref={firstInputRef} name="name" required className={inputClass} placeholder="Name" maxLength={120} autoComplete="name" />
          <input name="company" required className={inputClass} placeholder="Company" maxLength={140} autoComplete="organization" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="email" required className={inputClass} placeholder="Email" type="email" maxLength={180} autoComplete="email" />
          <input name="phone" required className={inputClass} placeholder="Phone" type="tel" maxLength={80} autoComplete="tel" />
        </div>
        {showMessage ? (
          <textarea
            name="message"
            className={`${inputClass} min-h-[110px] resize-y`}
            placeholder="What is the main IT issue you want help with?"
            maxLength={1200}
          />
        ) : null}
      </div>

      {error ? <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div> : null}
      {success ? (
        <div className="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{success}</div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        data-analytics-id={`${formId}-submit`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : submitLabel}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-white/48">{microcopy}</p>
    </form>
  );
}
