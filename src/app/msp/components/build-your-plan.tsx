"use client";

import { useMemo, useState } from "react";
import { trackAnalyticsEvent } from "@/src/components/analytics/analytics-provider";

export type BuilderPlan = {
  id: "essential" | "professional" | "enterprise";
  name: string;
  price: number;
  includesAddOns: string[];
  shortLabel: string;
  recommended?: boolean;
  closeCopy?: string;
  bestFor?: string;
};

export type BuilderAddOn = {
  id: string;
  name: string;
  basis: "user" | "device" | "server" | "flat";
  rate: number;
  priceLabel: string;
  secondaryPriceLabel?: string;
  estimateMode?: "calculated" | "requires-user-input" | "scope-based";
};

function toPositiveInt(v: string) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

function usd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function basisLabel(basis: BuilderAddOn["basis"], qty: number) {
  if (basis === "flat") return "flat";
  if (qty === 1) return basis;
  return `${basis}s`;
}

type BuildYourPlanProps = {
  plans: BuilderPlan[];
  addOns: BuilderAddOn[];
};

export default function BuildYourPlan({ plans, addOns }: BuildYourPlanProps) {
  const [planId, setPlanId] = useState<BuilderPlan["id"]>("essential");
  const [users, setUsers] = useState("");
  const [devices, setDevices] = useState("");
  const [servers, setServers] = useState("");
  const [hasBusinessPremium, setHasBusinessPremium] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});
  const [showSendForm, setShowSendForm] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactNotes, setContactNotes] = useState("");
  const [sendingEstimate, setSendingEstimate] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendOk, setSendOk] = useState<string | null>(null);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === planId) ?? plans[0],
    [planId, plans]
  );
  const includedAddOns = useMemo(() => {
    return addOns.filter((addOn) => selectedPlan.includesAddOns.includes(addOn.id));
  }, [addOns, selectedPlan]);

  const visibleAddOns = useMemo(() => {
    return addOns.filter((addOn) => !selectedPlan.includesAddOns.includes(addOn.id));
  }, [addOns, selectedPlan]);

  const enteredUsers = toPositiveInt(users);
  const hasEnteredUsers = users.trim().length > 0 && enteredUsers > 0;
  const billableUsers = Math.max(5, enteredUsers);
  const deviceCount = toPositiveInt(devices);
  const serverCount = toPositiveInt(servers);

  const addOnRows = useMemo(() => {
    return visibleAddOns
      .filter((addOn) => selectedAddOns[addOn.id])
      .map((addOn) => {
        if (addOn.estimateMode === "scope-based") {
          return {
            id: addOn.id,
            name: addOn.name,
            monthly: null,
            qty: null,
            basis: addOn.basis,
            note: "Starting at $79/month",
          };
        }

        if (addOn.estimateMode === "requires-user-input" && !hasEnteredUsers) {
          return {
            id: addOn.id,
            name: addOn.name,
            monthly: null,
            qty: null,
            basis: addOn.basis,
            note: "Add a user count to estimate this service.",
          };
        }

        const qty =
          addOn.basis === "user"
            ? billableUsers
            : addOn.basis === "device"
            ? deviceCount
            : addOn.basis === "server"
            ? serverCount
            : 1;

        return {
          id: addOn.id,
          name: addOn.name,
          monthly: addOn.rate * qty,
          qty,
          basis: addOn.basis,
          note: undefined,
        };
      });
  }, [visibleAddOns, selectedAddOns, billableUsers, deviceCount, serverCount, hasEnteredUsers]);

  const baseMonthly = selectedPlan.price * billableUsers;
  const addOnMonthly = addOnRows.reduce((sum, row) => sum + (row.monthly ?? 0), 0);
  const totalMonthly = baseMonthly + addOnMonthly;
  const showScopeNote = addOnRows.some(
    (row) => row.id === "business-phone-system" || row.id === "security-cameras-managed"
  );

  const numericInputClass =
    "h-10 w-full rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60 focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";
  const contactInputClass =
    "w-full rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-300/60 focus:ring-0";

  function onPlanChange(nextId: BuilderPlan["id"]) {
    setPlanId(nextId);
    const nextPlan = plans.find((p) => p.id === nextId);
    if (!nextPlan) return;
    setSelectedAddOns((prev) => {
      const updated: Record<string, boolean> = {};
      for (const addOn of addOns) {
        if (nextPlan.includesAddOns.includes(addOn.id)) continue;
        if (prev[addOn.id]) updated[addOn.id] = true;
      }
      return updated;
    });
  }

  function toggleAddOn(addOnId: string) {
    setSelectedAddOns((prev) => ({ ...prev, [addOnId]: !prev[addOnId] }));
  }

  async function sendEstimateRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSendError(null);
    setSendOk(null);

    const name = contactName.trim();
    const email = contactEmail.trim();

    if (!name || !email) {
      setSendError("Name and email are required.");
      return;
    }

    const includedLines = includedAddOns.length
      ? includedAddOns.map((addOn) => `- ${addOn.name} (${addOn.priceLabel})`)
      : ["- None included by default"];

    const selectedLines = addOnRows.length
      ? addOnRows.map((row) => {
          if (row.monthly === null) {
            return `- ${row.name}: ${row.note}`;
          }
          return `- ${row.name}: ${usd(row.monthly)}/month`;
        })
      : ["- No optional add-ons selected"];

    const enteredUsersLabel = users.trim().length > 0 ? String(enteredUsers) : "Not provided";
    const enteredDevicesLabel = devices.trim().length > 0 ? String(deviceCount) : "Not provided";
    const enteredServersLabel = servers.trim().length > 0 ? String(serverCount) : "Not provided";
    const notes = contactNotes.trim();

    const message = [
      "MSP Estimate Submission (Build Your Plan)",
      "",
      `Plan: ${selectedPlan.name} ($${selectedPlan.price}/user/month)`,
      `Users entered: ${enteredUsersLabel}`,
      `Billable users (min 5 applied): ${billableUsers}`,
      `Devices entered: ${enteredDevicesLabel}`,
      `Servers entered: ${enteredServersLabel}`,
      `Has Microsoft 365 Business Premium: ${hasBusinessPremium ? "Yes" : "No"}`,
      "",
      "Included add-ons in selected plan:",
      ...includedLines,
      "",
      "Optional add-ons selected:",
      ...selectedLines,
      "",
      `Base monthly estimate: ${usd(baseMonthly)}`,
      `Add-ons monthly estimate: ${usd(addOnMonthly)}`,
      `Estimated total monthly: ${usd(totalMonthly)}`,
      "",
      notes ? `Customer notes:\n${notes}` : "Customer notes: None provided",
    ].join("\n");

    setSendingEstimate(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "msp",
          name,
          email,
          phone: contactPhone.trim(),
          company: contactCompany.trim(),
          message,
          website: "",
        }),
      });

      let data: { error?: string } = {};
      try {
        data = (await res.json()) as { error?: string };
      } catch {}

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      trackAnalyticsEvent({
        eventType: "form_submit",
        elementId: "msp-plan-builder-form",
        section: "msp-plan-builder",
        metadata: { plan: selectedPlan.id, estimatedMonthly: totalMonthly },
      });
      setSendOk("Estimate sent. Redirecting...");
      window.location.assign("/thank-you?type=msp");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unable to send estimate right now.";
      setSendError(msg);
    } finally {
      setSendingEstimate(false);
    }
  }

  return (
    <section
      id="build-plan"
      className="lsgt-reveal lsgt-delay-2 mt-10 scroll-mt-28 rounded-3xl border border-cyan-300/30 bg-white/6 p-5 backdrop-blur-xl md:scroll-mt-32 md:p-7 xl:p-6"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/85">Build Your Plan</p>
          <h2 className="mt-1 text-2xl font-semibold md:text-3xl">Estimate your monthly investment</h2>
          <p className="mt-2 text-sm text-white/72">Fast estimate for planning. Final pricing depends on scope and onboarding requirements.</p>
        </div>
        <div className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-xs text-white/75">
          Minimum 5 users is always applied
        </div>
      </div>

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[1.32fr_0.68fr]">
        <div className="space-y-4">
          <fieldset className="rounded-2xl border border-white/10 bg-black/15 p-3">
            <legend className="text-sm font-semibold text-white/85">1. Choose your plan</legend>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {plans.map((plan) => {
                const active = selectedPlan.id === plan.id;
                return (
                  <label
                    key={plan.id}
                    className={`cursor-pointer rounded-xl border p-3 transition ${
                      active
                        ? "border-cyan-300/50 bg-cyan-950/20 shadow-[0_0_0_1px_rgba(34,211,238,0.28)]"
                        : "border-white/10 bg-neutral-950/30 hover:border-white/20"
                    } min-h-[118px] xl:min-h-[110px]`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      className="sr-only"
                      checked={active}
                      onChange={() => onPlanChange(plan.id)}
                    />
                    <div className="text-[1.02rem] font-semibold leading-tight">{plan.name}</div>
                    {plan.recommended ? (
                      <div className="mt-1 inline-flex rounded-full border border-cyan-300/35 bg-cyan-950/25 px-2 py-0.5 text-[11px] font-semibold text-cyan-100">
                        Most Popular
                      </div>
                    ) : null}
                    <div className="mt-1 text-[2rem] font-semibold leading-none text-cyan-100">${plan.price}</div>
                    <div className="text-xs text-white/65">per user / month</div>
                    <div className="mt-1 text-[11px] leading-snug text-white/68">{plan.shortLabel}</div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-white/10 bg-black/15 p-3">
            <legend className="text-sm font-semibold text-white/85">2. Enter estimated counts</legend>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              <label className="grid gap-1 rounded-xl border border-white/10 bg-neutral-950/30 p-2.5">
                <span className="text-xs text-white/70">Users</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={users}
                  placeholder="5"
                  onChange={(e) => setUsers(e.currentTarget.value.replace(/[^\d]/g, ""))}
                  className={numericInputClass}
                />
              </label>
              <label className="grid gap-1 rounded-xl border border-white/10 bg-neutral-950/30 p-2.5">
                <span className="text-xs text-white/70">Devices</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={devices}
                  onChange={(e) => setDevices(e.currentTarget.value.replace(/[^\d]/g, ""))}
                  className={numericInputClass}
                />
              </label>
              <label className="grid gap-1 rounded-xl border border-white/10 bg-neutral-950/30 p-2.5">
                <span className="text-xs text-white/70">Servers</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={servers}
                  onChange={(e) => setServers(e.currentTarget.value.replace(/[^\d]/g, ""))}
                  className={numericInputClass}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-white/55">Only numbers. We automatically apply the 5-user minimum.</p>
          </fieldset>

          <fieldset className="rounded-2xl border border-white/10 bg-black/15 p-3">
            <legend className="text-sm font-semibold text-white/85">3. Add optional services</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-2">
              {visibleAddOns.map((addOn) => (
                <label
                  key={addOn.id}
                  className="flex min-h-[58px] cursor-pointer items-center justify-between gap-2 rounded-xl border border-white/10 bg-neutral-950/30 px-2.5 py-2 hover:border-white/20"
                >
                  <div>
                    <div className="text-[0.95rem] font-medium leading-tight text-white/90">{addOn.name}</div>
                    <div className="text-xs text-white/62">{addOn.priceLabel}</div>
                    {addOn.secondaryPriceLabel ? <div className="text-[11px] text-white/55">{addOn.secondaryPriceLabel}</div> : null}
                  </div>
                  <input
                    type="checkbox"
                    checked={!!selectedAddOns[addOn.id]}
                    onChange={() => toggleAddOn(addOn.id)}
                    className="h-4 w-4 accent-cyan-400"
                  />
                </label>
              ))}
            </div>
            {!visibleAddOns.length ? (
              <p className="mt-3 text-xs text-white/65">This plan already includes all currently configurable add-ons.</p>
            ) : null}
            {showScopeNote ? (
              <p className="mt-2 text-xs text-cyan-100/80">Final pricing depends on scope and hardware requirements.</p>
            ) : null}
          </fieldset>
        </div>

        <aside className="h-fit w-full max-w-[370px] justify-self-end self-start rounded-2xl border border-cyan-300/30 bg-cyan-950/20 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] xl:sticky xl:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/85">Decision Summary</p>
          <p className="mt-1 text-xs text-white/60">Monthly estimate before implementation scope details.</p>
          <div className="mt-2 text-5xl font-semibold leading-none text-cyan-100">{usd(totalMonthly)}</div>
          <p className="mt-1 text-xs text-white/72">Estimate only - final pricing depends on scope and onboarding requirements.</p>
          <p className="mt-2 rounded-lg border border-white/10 bg-black/20 px-2.5 py-2 text-xs text-white/68">
            Microsoft 365 licensing (starting at $22/user/month) is billed separately and not included in this estimate.
          </p>
          <p className="mt-1 text-xs text-white/62">Most clients invest between $900-$2,500/month depending on size and coverage.</p>
          <div className="mt-2 rounded-lg border border-white/15 bg-black/20 px-2.5 py-2">
            <label htmlFor="has-business-premium" className="flex cursor-pointer items-start gap-2 text-xs text-white/85">
              <input
                id="has-business-premium"
                type="checkbox"
                checked={hasBusinessPremium}
                onChange={(e) => setHasBusinessPremium(e.currentTarget.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
              />
              <span>We already have Microsoft 365 Business Premium</span>
            </label>
            {!hasBusinessPremium ? (
              <p className="mt-1 text-xs text-cyan-100/80">We&apos;ll include Microsoft licensing options in your proposal.</p>
            ) : null}
          </div>
          <p className="mt-2 text-xs font-medium text-white/78">Billable users: {billableUsers} (minimum 5 users applied).</p>

          <div className="mt-4 space-y-2 rounded-xl border border-white/15 bg-black/25 p-3 text-sm">
            <div className="flex items-center justify-between gap-3 text-white/85">
              <span>
                {selectedPlan.name} ({billableUsers} users)
              </span>
              <span>{usd(baseMonthly)}</span>
            </div>
            {addOnRows.map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-3 text-white/75">
                <span>
                  {row.qty ? `${row.name} (${row.qty} ${basisLabel(row.basis, row.qty)})` : row.name}
                </span>
                <span>{row.monthly === null ? row.note : usd(row.monthly)}</span>
              </div>
            ))}
            {!addOnRows.length ? <div className="text-xs text-white/55">No additional add-ons selected.</div> : null}
          </div>

          <div className="mt-4">
            <p className="text-xs text-white/68">Ready for exact pricing and rollout timeline?</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowSendForm((prev) => !prev)}
              className="inline-flex rounded-xl bg-cyan-500 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-cyan-400"
            >
              {showSendForm ? "Hide estimate form" : "Send this estimate"}
            </button>
            <a
              href="tel:8064849040"
              className="inline-flex rounded-xl border border-white/20 px-3.5 py-1.5 text-sm font-semibold text-white/90 hover:bg-white/5"
            >
              Call
            </a>
            <a
              href="mailto:info@lonestarglobaltech.com"
              className="inline-flex rounded-xl border border-white/20 px-3.5 py-1.5 text-sm font-semibold text-white/90 hover:bg-white/5"
            >
              Email
            </a>
          </div>

          {showSendForm ? (
            <form
              onSubmit={sendEstimateRequest}
              data-form-id="msp-plan-builder-form"
              data-analytics-section="msp-plan-builder"
              className="mt-3 space-y-2 rounded-xl border border-white/15 bg-black/25 p-3"
            >
              <p className="text-xs text-white/70">We&apos;ll send this estimate to our team and follow up with exact pricing + rollout steps.</p>

              <div className="grid gap-2">
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.currentTarget.value)}
                  className={contactInputClass}
                  placeholder="Name *"
                  maxLength={120}
                  required
                />
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.currentTarget.value)}
                  className={contactInputClass}
                  placeholder="Email *"
                  type="email"
                  maxLength={180}
                  required
                />
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.currentTarget.value)}
                  className={contactInputClass}
                  placeholder="Phone"
                  type="tel"
                  maxLength={80}
                />
                <input
                  value={contactCompany}
                  onChange={(e) => setContactCompany(e.currentTarget.value)}
                  className={contactInputClass}
                  placeholder="Company"
                  maxLength={140}
                />
                <textarea
                  value={contactNotes}
                  onChange={(e) => setContactNotes(e.currentTarget.value)}
                  className={`${contactInputClass} min-h-[84px] resize-y`}
                  placeholder="Anything we should know before follow-up? (optional)"
                  maxLength={900}
                />
              </div>

              {sendError ? <div className="rounded-lg border border-red-500/35 bg-red-500/10 px-2.5 py-2 text-xs text-red-100">{sendError}</div> : null}
              {sendOk ? <div className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-2 text-xs text-emerald-100">{sendOk}</div> : null}

              <button
                type="submit"
                disabled={sendingEstimate}
                className="inline-flex w-full items-center justify-center rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sendingEstimate ? "Sending..." : "Send estimate for follow-up"}
              </button>
            </form>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
