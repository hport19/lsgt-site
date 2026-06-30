"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";
import { trackAnalyticsEvent } from "@/src/components/analytics/analytics-provider";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const allowedResumeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const inputClass =
  "w-full rounded-xl border border-white/14 bg-black/24 px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/38 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-500/15";

function isAllowedResume(file: File) {
  return allowedResumeTypes.has(file.type) || /\.(pdf|doc|docx)$/i.test(file.name);
}

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProviderApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateResume(file: File) {
    if (!isAllowedResume(file)) return "Resume must be a PDF, DOC, or DOCX file.";
    if (file.size > MAX_RESUME_BYTES) return "Resume must be 10 MB or smaller.";
    return null;
  }

  function setResumeFile(file: File | null) {
    setError(null);
    if (!file) {
      setResume(null);
      return;
    }

    const resumeError = validateResume(file);
    if (resumeError) {
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setError(resumeError);
      return;
    }

    setResume(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setResumeFile(e.target.files?.[0] ?? null);
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragActive(false);
    setResumeFile(e.dataTransfer.files?.[0] ?? null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = String(fd.get("firstName") || "").trim();
    const lastName = String(fd.get("lastName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const position = String(fd.get("positionApplyingFor") || "").trim();
    const experience = String(fd.get("experience") || "").trim();

    setError(null);

    if (!firstName || !lastName || !email || !phone || !position || !experience) {
      setError("Please complete every required field.");
      return;
    }

    if (!resume) {
      setError("Please upload your resume before submitting.");
      return;
    }

    const resumeError = validateResume(resume);
    if (resumeError) {
      setError(resumeError);
      return;
    }

    fd.set("type", "provider");
    fd.set("name", `${firstName} ${lastName}`);
    fd.set("message", experience);
    fd.set("resume", resume, resume.name);

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

      trackAnalyticsEvent({
        eventType: "form_submit",
        elementId: "careers-application-form",
        section: "careers-application",
        metadata: { position },
      });
      setSuccess(true);
      form.reset();
      setResume(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to submit right now.";
      trackAnalyticsEvent({ eventType: "form_error", elementId: "careers-application-form", metadata: { message, position } });
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-300/24 bg-emerald-950/16 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur md:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/26 bg-emerald-400/14">
          <CheckCircle2 className="h-7 w-7 text-emerald-200" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-3xl font-semibold tracking-[0.01em]">Application received.</h2>
        <p className="mt-3 leading-relaxed text-white/72">
          We appreciate your interest in GlobalTech. Our team personally reviews every application. If there&apos;s a match,
          we&apos;ll contact you.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-2xl border border-white/14 px-5 py-3 text-sm font-semibold text-white/86 transition hover:bg-white/7"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      data-form-id="careers-application-form"
      data-analytics-section="careers-application"
      className="rounded-3xl border border-white/12 bg-white/6 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur md:p-6"
    >
      <input type="hidden" name="type" value="provider" />
      <input name="website" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />

      <div>
        <h2 className="text-2xl font-semibold tracking-[0.01em]">Apply to GlobalTech</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/68">
          Tell us how you work, what you&apos;ve built, and where you want to grow. A real person will review it.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-white/72">
            First name
            <input name="firstName" required className={inputClass} autoComplete="given-name" maxLength={80} />
          </label>
          <label className="grid gap-2 text-sm text-white/72">
            Last name
            <input name="lastName" required className={inputClass} autoComplete="family-name" maxLength={80} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-white/72">
            Email
            <input name="email" required type="email" className={inputClass} autoComplete="email" maxLength={180} />
          </label>
          <label className="grid gap-2 text-sm text-white/72">
            Phone
            <input name="phone" required type="tel" className={inputClass} autoComplete="tel" maxLength={80} />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-white/72">
          Position applying for
          <select name="positionApplyingFor" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option>Relationship Builder</option>
            <option>Field Technician</option>
            <option>Technical Support Agent</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-white/72">
          Experience
          <textarea
            name="experience"
            required
            className={`${inputClass} min-h-[140px] resize-y`}
            placeholder="Tell us what you've done, what you're learning, and how you like to work."
            maxLength={2400}
          />
        </label>

        <label
          className={`group cursor-pointer rounded-3xl border border-dashed p-5 transition ${
            dragActive
              ? "border-cyan-300/70 bg-cyan-400/10"
              : "border-white/18 bg-black/20 hover:border-cyan-300/36 hover:bg-white/[0.045]"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
        >
          <input
            ref={fileInputRef}
            name="resume"
            aria-required="true"
            type="file"
            accept=".pdf,.doc,.docx"
            className="sr-only"
            onChange={onFileChange}
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/7">
              {resume ? <FileText className="h-6 w-6 text-cyan-200" aria-hidden="true" /> : <UploadCloud className="h-6 w-6 text-cyan-200" aria-hidden="true" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Resume upload required</p>
              <p className="mt-1 text-sm text-white/56">
                {resume ? `${resume.name} (${formatSize(resume.size)})` : "Drag and drop your resume here, or click to browse."}
              </p>
              <p className="mt-1 text-xs text-white/42">PDF, DOC, or DOCX. Maximum 10 MB.</p>
            </div>
          </div>
        </label>
      </div>

      {error ? <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        data-analytics-id="careers-application-submit"
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
