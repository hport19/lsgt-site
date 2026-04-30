"use client";

import { useState } from "react";
import { trackAnalyticsEvent } from "@/src/components/analytics/analytics-provider";

const inputClass =
  "w-full rounded-xl border border-white/14 bg-black/24 px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/38 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-500/15";

export default function ProviderApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const resume = fd.get("resume");

    setError(null);
    setSuccess(null);

    if (!(resume instanceof File) || resume.size === 0) {
      setError("Please upload your resume before submitting.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        body: fd,
      });

      let data: { error?: string } = {};
      try {
        data = (await res.json()) as { error?: string };
      } catch {}

      if (!res.ok) throw new Error(data.error || "Unable to submit right now.");

      trackAnalyticsEvent({ eventType: "form_submit", elementId: "provider-application-form", section: "careers-application" });
      setSuccess("Application received. We will review it and follow up when there is a fit.");
      form.reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to submit right now.";
      trackAnalyticsEvent({ eventType: "form_error", elementId: "provider-application-form", metadata: { message } });
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      data-form-id="provider-application-form"
      data-analytics-section="careers-application"
      className="rounded-3xl border border-white/12 bg-white/6 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur md:p-6"
    >
      <input type="hidden" name="type" value="provider" />
      <input name="website" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />

      <div>
        <h2 className="text-2xl font-semibold tracking-[0.01em]">Provider application</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/68">
          This is for independent providers and contract-based opportunities. Resume upload is required.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-white/72">
            Full name
            <input name="name" required className={inputClass} autoComplete="name" maxLength={120} />
          </label>
          <label className="grid gap-2 text-sm text-white/72">
            Email
            <input name="email" required type="email" className={inputClass} autoComplete="email" maxLength={180} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-white/72">
            Phone
            <input name="phone" required type="tel" className={inputClass} autoComplete="tel" maxLength={80} />
          </label>
          <label className="grid gap-2 text-sm text-white/72">
            City / State
            <input name="cityState" required className={inputClass} placeholder="Amarillo, TX" maxLength={160} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-white/72">
            Availability
            <select name="availability" required className={inputClass}>
              <option value="">Select one</option>
              <option>Weekdays</option>
              <option>Evenings</option>
              <option>Weekends</option>
              <option>Flexible / varies</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm text-white/72">
            Experience level
            <select name="experienceLevel" required className={inputClass}>
              <option value="">Select one</option>
              <option>IT student</option>
              <option>Entry-level technician</option>
              <option>1-3 years field experience</option>
              <option>3+ years field experience</option>
              <option>Independent provider</option>
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm text-white/72">
          Areas of experience
          <textarea name="areasExperience" required className={`${inputClass} min-h-[96px] resize-y`} placeholder="Networking, Windows, cabling, cameras, printers, helpdesk, M365..." maxLength={1200} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-white/72">
            Transportation availability
            <select name="transportation" required className={inputClass}>
              <option value="">Select one</option>
              <option>Reliable personal transportation</option>
              <option>Shared transportation</option>
              <option>Limited transportation</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm text-white/72">
            Tools / equipment available
            <input name="tools" required className={inputClass} placeholder="Laptop, hand tools, tester, ladder, etc." maxLength={600} />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-white/72">
          Certifications, if any
          <input name="certifications" className={inputClass} placeholder="CompTIA, Microsoft, Cisco, OSHA, none yet..." maxLength={600} />
        </label>

        <label className="grid gap-2 text-sm text-white/72">
          Short message
          <textarea name="message" required className={`${inputClass} min-h-[110px] resize-y`} placeholder="Tell us what kind of field work you want to learn or support." maxLength={1400} />
        </label>

        <label className="grid gap-2 text-sm text-white/72">
          Resume upload (required)
          <input
            name="resume"
            required
            type="file"
            accept=".pdf,.doc,.docx"
            className="w-full rounded-xl border border-white/14 bg-black/24 px-3.5 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
          />
          <span className="text-xs text-white/48">PDF, DOC, or DOCX. Maximum 5 MB.</span>
        </label>
      </div>

      {error ? <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div> : null}
      {success ? (
        <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{success}</div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        data-analytics-id="provider-application-submit"
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit provider application"}
      </button>
    </form>
  );
}
