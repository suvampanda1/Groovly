import { useState, type ReactNode } from "react";
import {
  ArrowRight, BadgeCheck, Banknote, Check, CheckCircle2, ChevronLeft,
  ChevronRight, CircleAlert, CircleDollarSign, Clock3, CreditCard,
  FileCheck2, Globe2, IdCard, Landmark, LockKeyhole, MapPin, Phone,
  QrCode, ReceiptText, RefreshCcw, Server, ShieldCheck, Smartphone,
  UserRound, WalletCards, Zap,
} from "lucide-react";

type Currency = "INR" | "USD";
type HubTab = "flow" | "verification" | "wallet" | "safety";
type RecoveryState = "idle" | "checking" | "unknown" | "confirmed";

const NEON = "#00FFB2";
const VIOLET = "#6C63FF";
const GOLD = "#FFB800";
const PINK = "#FF2D55";
const PANEL = "#080810";
const INPUT = "#0E0E1A";
const MUTED = "#A5A5BA";

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "United Arab Emirates", "Singapore", "Germany", "France", "Spain",
  "Brazil", "Mexico", "Japan", "South Korea", "South Africa", "Nigeria", "Other",
];

const hubTabs: { id: HubTab; label: string; short: string; icon: typeof Zap }[] = [
  { id: "flow", label: "How payments work", short: "Payments", icon: ReceiptText },
  { id: "verification", label: "Teacher verification", short: "Verify", icon: BadgeCheck },
  { id: "wallet", label: "Groovly Wallet", short: "Wallet", icon: WalletCards },
  { id: "safety", label: "Payment safety", short: "Safety", icon: ShieldCheck },
];

function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl ${className}`} style={{ background: PANEL, border: "1px solid rgba(255,255,255,0.07)" }}>{children}</div>;
}

function Label({ children, color = NEON }: { children: ReactNode; color?: string }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.12em]" style={{ color, background: `${color}10`, border: `1px solid ${color}2D` }}>{children}</span>;
}

function PaymentFlow({ currency }: { currency: Currency }) {
  const liveSteps = [
    ["1", "Student pays", "Seat is reserved while the provider confirms payment."],
    ["2", "Payment held securely", "Funds stay pending through the class and issue window."],
    ["3", "Class completes", "Verified completion starts the release process."],
    ["4", "Teacher withdraws", "Available earnings move from Groovly Wallet to a verified payout method."],
  ];
  const methods = [
    { icon: CreditCard, title: "Card", copy: "Hosted fields and 3D Secure where required.", tag: "Global" },
    { icon: Globe2, title: "PayPal", copy: "Provider redirect with a resumable return flow.", tag: "Eligible regions" },
    { icon: Smartphone, title: "UPI app", copy: "Intent or deep link on supported Indian devices.", tag: "India" },
    { icon: QrCode, title: "Scan QR", copy: "Expiring provider QR; status comes from a signed webhook.", tag: "Supported checkout" },
  ];
  return (
    <div className="space-y-5 tab-enter">
      <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-5">
        <Surface className="p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div><Label><Zap size={11} /> Live classes</Label><h3 className="mt-3 text-2xl font-black" style={{ fontFamily: "Outfit, sans-serif" }}>Protected payment release</h3><p className="mt-2 text-sm leading-relaxed max-w-2xl" style={{ color: MUTED }}>The student is charged at booking. Groovly shows the money as pending, then releases it after the live class and issue-reporting window.</p></div>
            <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "#77778A" }}>Not marketed as escrow</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {liveSteps.map(([number, title, copy]) => <div key={number} className="p-4 rounded-xl flex gap-3" style={{ background: INPUT, border: "1px solid rgba(255,255,255,0.055)" }}><span className="h-8 w-8 flex-none rounded-full flex items-center justify-center text-xs font-black" style={{ background: `${NEON}12`, color: NEON }}>{number}</span><div><p className="text-sm font-black">{title}</p><p className="mt-1 text-[11px] leading-relaxed" style={{ color: "#9090A5" }}>{copy}</p></div></div>)}
          </div>
        </Surface>

        <Surface className="p-5 md:p-7">
          <Label color={VIOLET}><CircleDollarSign size={11} /> On-demand video</Label>
          <h3 className="mt-3 text-2xl font-black" style={{ fontFamily: "Outfit, sans-serif" }}>Creator settlement</h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>Access unlocks only after provider confirmation. Sale proceeds credit the video owner, minus Groovly’s fixed platform fee.</p>
          <div className="mt-6 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex justify-between p-3.5 text-sm" style={{ background: INPUT }}><span>Example video sale</span><strong>{currency === "INR" ? "₹499" : "$6.00"}</strong></div>
            <div className="flex justify-between p-3.5 text-sm"><span style={{ color: MUTED }}>Groovly platform fee</span><strong style={{ color: PINK }}>{currency === "INR" ? "−₹30" : "−₹30 equivalent*"}</strong></div>
            <div className="flex justify-between p-3.5 text-sm" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}><span>Estimated creator earnings</span><strong style={{ color: NEON }}>{currency === "INR" ? "₹469" : "Calculated securely"}</strong></div>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed" style={{ color: "#77778A" }}>*The backend must calculate and disclose the local equivalent, tax, payment-processing, and FX adjustments before settlement.</p>
        </Surface>
      </div>

      <Surface className="p-5 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5"><div><h3 className="text-xl font-black" style={{ fontFamily: "Outfit, sans-serif" }}>Methods shown by eligibility</h3><p className="mt-1 text-xs" style={{ color: MUTED }}>Country, currency, device, and provider rules decide what each student sees.</p></div><Label color={GOLD}><Globe2 size={11} /> International ready</Label></div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {methods.map(method => <div key={method.title} className="rounded-xl p-4" style={{ background: INPUT, border: "1px solid rgba(255,255,255,0.06)" }}><div className="flex items-center justify-between"><method.icon size={19} style={{ color: NEON }} /><span className="text-[9px] font-mono uppercase" style={{ color: "#77778A" }}>{method.tag}</span></div><p className="mt-4 text-sm font-black">{method.title}</p><p className="mt-1 text-[11px] leading-relaxed" style={{ color: "#9292A6" }}>{method.copy}</p></div>)}
        </div>
        <div className="mt-4 rounded-xl p-4 flex gap-3" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}22` }}><QrCode size={17} className="flex-none mt-0.5" style={{ color: GOLD }} /><p className="text-xs leading-relaxed" style={{ color: "#C5C5D3" }}><strong style={{ color: "#FFE08A" }}>For live classes, never display a teacher’s personal QR.</strong> Generate a unique, expiring Groovly checkout QR. “Check status” may query the backend, but only a verified payment-provider webhook can mark it paid.</p></div>
      </Surface>
    </div>
  );
}

function VerificationFlow({ onOpenAccount }: { onOpenAccount: () => void }) {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("India");
  const [form, setForm] = useState({ name: "", phone: "", city: "", idType: "Passport", payout: "" });
  const [notice, setNotice] = useState("");
  const india = country === "India";
  const next = () => {
    if (step === 0 && (!form.name.trim() || !form.phone.trim() || !form.city.trim())) { setNotice("Complete your name, phone number, and city to continue."); return; }
    if (step === 2 && !form.payout) { setNotice("Choose a payout route to continue."); return; }
    setNotice(""); setStep(value => Math.min(3, value + 1));
  };
  const fieldStyle = { background: INPUT, border: "1px solid rgba(255,255,255,0.08)" };
  return (
    <div className="grid xl:grid-cols-[0.34fr_0.66fr] gap-5 tab-enter">
      <Surface className="p-5 md:p-6 h-fit">
        <Label color={GOLD}><BadgeCheck size={11} /> Teacher setup</Label>
        <h3 className="mt-4 text-2xl font-black" style={{ fontFamily: "Outfit, sans-serif" }}>Verify once. Earn globally.</h3>
        <p className="mt-2 text-xs leading-relaxed" style={{ color: MUTED }}>Country comes first because identity, tax, currency, and payout requirements vary.</p>
        <ol className="mt-6 space-y-2">
          {["Basic details", "Government ID", "Payout method", "Review"].map((item, index) => <li key={item} className="rounded-xl px-3.5 py-3 flex items-center gap-3 text-xs font-bold" style={step === index ? { background: `${GOLD}10`, border: `1px solid ${GOLD}28`, color: "#FFE08A" } : { color: index < step ? NEON : "#77778A", border: "1px solid transparent" }}><span className="h-6 w-6 rounded-full flex items-center justify-center text-[10px]" style={{ background: index < step ? `${NEON}12` : "rgba(255,255,255,0.05)" }}>{index < step ? <Check size={12} /> : index + 1}</span>{item}</li>)}
        </ol>
      </Surface>

      <Surface className="p-5 md:p-7 min-h-[480px] flex flex-col">
        {step === 0 && <div><Label><UserRound size={11} /> Step 1 of 4</Label><h3 className="mt-4 text-2xl font-black">Your basic details</h3><p className="mt-2 text-sm" style={{ color: MUTED }}>Use the same legal name that appears on your verification document.</p><div className="grid sm:grid-cols-2 gap-4 mt-6"><label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "#9292A6" }}>Country of residence<select value={country} onChange={event => setCountry(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl px-3 text-sm normal-case font-sans outline-none" style={fieldStyle}>{countries.map(item => <option key={item}>{item}</option>)}</select></label><label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "#9292A6" }}>Full legal name<div className="relative mt-2"><UserRound size={15} className="absolute left-4 top-4" style={{ color: "#66667A" }} /><input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className="min-h-12 w-full rounded-xl pl-11 pr-3 text-sm outline-none normal-case font-sans" style={fieldStyle} placeholder="Name on your ID" /></div></label><label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "#9292A6" }}>Phone number<div className="relative mt-2"><Phone size={15} className="absolute left-4 top-4" style={{ color: "#66667A" }} /><input value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} className="min-h-12 w-full rounded-xl pl-11 pr-3 text-sm outline-none normal-case font-sans" style={fieldStyle} placeholder={india ? "+91 98765 43210" : "+1 555 000 0000"} inputMode="tel" /></div></label><label className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "#9292A6" }}>City<div className="relative mt-2"><MapPin size={15} className="absolute left-4 top-4" style={{ color: "#66667A" }} /><input value={form.city} onChange={event => setForm({ ...form, city: event.target.value })} className="min-h-12 w-full rounded-xl pl-11 pr-3 text-sm outline-none normal-case font-sans" style={fieldStyle} placeholder="Your city" /></div></label></div></div>}

        {step === 1 && <div><Label color={VIOLET}><IdCard size={11} /> Step 2 of 4</Label><h3 className="mt-4 text-2xl font-black">Government ID verification</h3><p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>Choose the document type, then continue in the verification provider’s secure, hosted flow. Groovly must never store raw document images in this React app.</p><div className="grid sm:grid-cols-3 gap-3 mt-6">{(india ? ["Aadhaar", "Passport", "Driving licence"] : ["Passport", "National ID", "Driving licence"]).map(item => <button key={item} onClick={() => setForm({ ...form, idType: item })} className="min-h-20 rounded-xl px-3 text-sm font-bold" style={form.idType === item ? { background: `${VIOLET}12`, border: `1px solid ${VIOLET}38`, color: "#C7C3FF" } : { background: INPUT, border: "1px solid rgba(255,255,255,0.07)", color: "#9797AA" }}>{item}</button>)}</div><div className="mt-5 rounded-xl p-4 flex gap-3" style={{ background: `${VIOLET}08`, border: `1px solid ${VIOLET}20` }}><LockKeyhole size={17} className="flex-none" style={{ color: "#AAA5FF" }} /><p className="text-xs leading-relaxed" style={{ color: "#B9B7D7" }}>Production action: open provider-hosted KYC for document capture, selfie/liveness, sanctions, tax, and regional eligibility checks.</p></div></div>}

        {step === 2 && <div><Label color={GOLD}><Banknote size={11} /> Step 3 of 4</Label><h3 className="mt-4 text-2xl font-black">Choose a payout route</h3><p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>Available methods depend on {country}. Sensitive UPI, bank, card, or PayPal credentials belong in provider-hosted fields—not local storage.</p><div className="grid sm:grid-cols-2 gap-3 mt-6">{(india ? [{ id: "upi", icon: Smartphone, title: "UPI ID", copy: "Verify through the payout provider." }, { id: "bank", icon: Landmark, title: "Bank transfer", copy: "Hosted bank-account connection." }] : [{ id: "paypal", icon: Globe2, title: "PayPal", copy: "Connect an eligible PayPal account." }, { id: "bank", icon: Landmark, title: "Local bank payout", copy: "Availability varies by country." }]).map(item => <button key={item.id} onClick={() => setForm({ ...form, payout: item.id })} className="rounded-xl p-5 text-left" style={form.payout === item.id ? { background: `${GOLD}0D`, border: `1px solid ${GOLD}32` } : { background: INPUT, border: "1px solid rgba(255,255,255,0.07)" }}><item.icon size={20} style={{ color: GOLD }} /><p className="mt-4 text-sm font-black">{item.title}</p><p className="mt-1 text-[11px]" style={{ color: "#9292A6" }}>{item.copy}</p></button>)}</div></div>}

        {step === 3 && <div><Label><FileCheck2 size={11} /> Step 4 of 4</Label><h3 className="mt-4 text-2xl font-black">Review your setup</h3><p className="mt-2 text-sm" style={{ color: MUTED }}>Your production account can accept paid bookings only after the provider returns a verified status.</p><div className="mt-6 divide-y divide-white/[0.06] rounded-xl px-4" style={{ background: INPUT }}>{[["Name", form.name], ["Location", `${form.city}, ${country}`], ["ID route", `${form.idType} · provider hosted`], ["Payout", form.payout || "Not selected"], ["Status", "Draft · verification required"]].map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3.5 text-sm"><span style={{ color: "#8F8FA3" }}>{label}</span><strong className="text-right capitalize">{value}</strong></div>)}</div><button onClick={onOpenAccount} className="mt-6 min-h-12 w-full rounded-xl px-5 font-black flex items-center justify-center gap-2" style={{ background: NEON, color: "#000" }}>Create account to continue <ArrowRight size={16} /></button><p className="mt-3 text-center text-[10px]" style={{ color: "#77778A" }}>UI preview only. Submission requires authentication and a configured verification provider.</p></div>}

        <div className="mt-auto pt-7">
          {notice && <p role="alert" className="mb-3 flex items-center gap-2 text-xs" style={{ color: "#FF8298" }}><CircleAlert size={14} />{notice}</p>}
          {step < 3 && <div className="flex justify-between gap-3"><button onClick={() => { setNotice(""); setStep(value => Math.max(0, value - 1)); }} disabled={step === 0} className="min-h-11 rounded-xl px-4 text-sm font-bold flex items-center gap-2 disabled:opacity-30" style={{ border: "1px solid rgba(255,255,255,0.09)" }}><ChevronLeft size={15} /> Back</button><button onClick={next} className="min-h-11 rounded-xl px-5 text-sm font-black flex items-center gap-2" style={{ background: GOLD, color: "#000" }}>{step === 1 ? "Continue to secure verification" : "Continue"}<ChevronRight size={15} /></button></div>}
        </div>
      </Surface>
    </div>
  );
}

function WalletView({ currency, onOpenAccount }: { currency: Currency; onOpenAccount: () => void }) {
  const [notice, setNotice] = useState("");
  const money = (inr: string, usd: string) => currency === "INR" ? inr : usd;
  const stats = [
    { label: "Available", value: money("₹12,430", "$150"), icon: WalletCards, color: NEON },
    { label: "Pending", value: money("₹4,980", "$60"), icon: Clock3, color: GOLD },
    { label: "On the way", value: money("₹0", "$0"), icon: Banknote, color: VIOLET },
    { label: "Action required", value: "Verify ID", icon: CircleAlert, color: PINK },
  ];
  const rows = [
    { title: "Zumba Live · Morning Burn", ref: "GRV-LIVE-8421", gross: money("₹1,499", "$18"), fee: "—", net: money("₹1,499", "$18"), state: "Release pending" },
    { title: "Rhythm & Groove Theory", ref: "GRV-VID-7194", gross: money("₹499", "$6"), fee: currency === "INR" ? "−₹30" : "−₹30 eq.", net: currency === "INR" ? "₹469" : "Pending FX", state: "Available" },
    { title: "Breaking Basics · Live", ref: "GRV-LIVE-6850", gross: money("₹2,999", "$36"), fee: "—", net: money("₹2,999", "$36"), state: "Paid" },
  ];
  return (
    <div className="space-y-5 tab-enter">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">{stats.map(stat => <Surface key={stat.label} className="p-4 md:p-5"><div className="flex items-center justify-between"><stat.icon size={17} style={{ color: stat.color }} /><span className="h-2 w-2 rounded-full" style={{ background: stat.color }} /></div><p className="mt-4 text-[10px] font-mono uppercase tracking-wider" style={{ color: "#87879B" }}>{stat.label}</p><p className="mt-1 text-xl font-black" style={{ color: stat.color }}>{stat.value}</p></Surface>)}</div>
      <div className="grid xl:grid-cols-[1fr_320px] gap-5">
        <Surface className="overflow-hidden"><div className="p-5 flex flex-wrap items-center justify-between gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}><div><h3 className="text-xl font-black">Recent earnings</h3><p className="mt-1 text-xs" style={{ color: MUTED }}>Gross, fee, net, and release status stay visible.</p></div><Label color={GOLD}>Sample data</Label></div><div className="divide-y divide-white/[0.06]">{rows.map(row => <div key={row.ref} className="p-4 md:p-5 grid md:grid-cols-[1fr_repeat(3,95px)_120px] gap-3 items-center"><div><p className="text-sm font-black">{row.title}</p><p className="mt-1 text-[10px] font-mono" style={{ color: "#747489" }}>{row.ref}</p></div><div><span className="md:hidden text-[10px] mr-2" style={{ color: "#77778A" }}>Gross</span><strong className="text-xs">{row.gross}</strong></div><div><span className="md:hidden text-[10px] mr-2" style={{ color: "#77778A" }}>Fee</span><strong className="text-xs">{row.fee}</strong></div><div><span className="md:hidden text-[10px] mr-2" style={{ color: "#77778A" }}>Net</span><strong className="text-xs" style={{ color: NEON }}>{row.net}</strong></div><span className="text-[10px] font-bold" style={{ color: row.state === "Paid" || row.state === "Available" ? NEON : GOLD }}>{row.state}</span></div>)}</div></Surface>
        <Surface className="p-5 h-fit"><Label color={PINK}><CircleAlert size={11} /> Verification needed</Label><h3 className="mt-4 text-xl font-black">Payouts are paused</h3><p className="mt-2 text-xs leading-relaxed" style={{ color: MUTED }}>Finish identity and payout verification before requesting a withdrawal.</p><button onClick={() => setNotice("Payout not started. Verification must be completed through the secure provider first.")} className="mt-5 min-h-11 w-full rounded-xl px-4 text-sm font-black" style={{ background: GOLD, color: "#000" }}>Request payout</button><button onClick={onOpenAccount} className="mt-2 min-h-11 w-full rounded-xl px-4 text-sm font-bold" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Set up account</button><p aria-live="polite" className="mt-4 text-[11px] leading-relaxed" style={{ color: notice ? "#FF9BAE" : "#77778A" }}>{notice || "No bank or UPI details are stored in this preview."}</p></Surface>
      </div>
      <div className="rounded-xl p-4 flex gap-3" style={{ background: `${VIOLET}08`, border: `1px solid ${VIOLET}20` }}><ShieldCheck size={17} className="flex-none" style={{ color: "#AAA5FF" }} /><p className="text-xs leading-relaxed" style={{ color: "#B8B6D4" }}><strong style={{ color: "#D7D5FF" }}>Groovly Wallet is an earnings summary, not a bank account.</strong> Pending amounts can change because of refunds, disputes, chargebacks, tax, processing, or currency conversion.</p></div>
    </div>
  );
}

function SafetyView() {
  const [state, setState] = useState<RecoveryState>("idle");
  const safeguards = [
    { icon: RefreshCcw, title: "Idempotent writes", copy: "Reuse one key for payment, booking, refund, and payout retries." },
    { icon: Server, title: "Separated workloads", copy: "Keep login, catalog, webhooks, checkout, and payouts on independently scalable workers." },
    { icon: ShieldCheck, title: "Webhook truth", copy: "Signed provider events—not browser buttons—confirm paid, refunded, or disputed states." },
    { icon: Clock3, title: "Resumable checkout", copy: "Restore the same payment attempt after refresh, login, timeout, or provider redirect." },
  ];
  return (
    <div className="grid xl:grid-cols-[0.58fr_0.42fr] gap-5 tab-enter">
      <Surface className="p-5 md:p-7"><Label><Server size={11} /> High-traffic design</Label><h3 className="mt-4 text-2xl font-black">Built to fail safely, then recover</h3><p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>These protections belong in the production backend and payment provider integration. The UI must preserve context and never encourage a duplicate payment.</p><div className="grid sm:grid-cols-2 gap-3 mt-6">{safeguards.map(item => <div key={item.title} className="rounded-xl p-4" style={{ background: INPUT, border: "1px solid rgba(255,255,255,0.06)" }}><item.icon size={18} style={{ color: NEON }} /><p className="mt-4 text-sm font-black">{item.title}</p><p className="mt-1 text-[11px] leading-relaxed" style={{ color: "#9191A5" }}>{item.copy}</p></div>)}</div></Surface>
      <Surface className="p-5 md:p-7 flex flex-col"><div className="flex items-center justify-between"><Label color={GOLD}><Zap size={11} /> Recovery demo</Label><span className="text-[9px] font-mono" style={{ color: "#77778A" }}>GRV-7J4K-92Q</span></div><div className="mt-7 flex-1 rounded-2xl p-5 flex flex-col items-center justify-center text-center" aria-live="polite" style={{ minHeight: 280, background: INPUT, border: "1px solid rgba(255,255,255,0.06)" }}>{state === "idle" && <><CreditCard size={34} style={{ color: VIOLET }} /><h4 className="mt-5 text-xl font-black">Test a slow confirmation</h4><p className="mt-2 text-xs leading-relaxed" style={{ color: MUTED }}>See the safe UI when checkout traffic is high.</p><button onClick={() => setState("checking")} className="mt-6 min-h-11 rounded-xl px-5 text-sm font-black" style={{ background: VIOLET }}>Start demo</button></>}{state === "checking" && <><RefreshCcw size={34} className="animate-spin" style={{ color: GOLD }} /><h4 className="mt-5 text-xl font-black">Still confirming payment</h4><p className="mt-2 text-xs leading-relaxed" style={{ color: MUTED }}>Please don’t pay again or close this page.</p><button onClick={() => setState("unknown")} className="mt-6 min-h-11 rounded-xl px-5 text-sm font-bold" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Simulate timeout</button></>}{state === "unknown" && <><CircleAlert size={34} style={{ color: GOLD }} /><h4 className="mt-5 text-xl font-black">Final status not received</h4><p className="mt-2 text-xs leading-relaxed" style={{ color: MUTED }}>Don’t make another payment. We’ll reuse this attempt and check the provider.</p><button onClick={() => setState("confirmed")} className="mt-6 min-h-11 rounded-xl px-5 text-sm font-black flex items-center gap-2" style={{ background: GOLD, color: "#000" }}><RefreshCcw size={14} /> Check status</button></>}{state === "confirmed" && <><CheckCircle2 size={38} style={{ color: NEON }} /><h4 className="mt-5 text-xl font-black">Payment confirmed</h4><p className="mt-2 text-xs leading-relaxed" style={{ color: MUTED }}>Your seat is protected. We’re finishing the booking without charging again.</p><button onClick={() => setState("idle")} className="mt-6 min-h-11 rounded-xl px-5 text-sm font-bold" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Reset demo</button></>}</div></Surface>
    </div>
  );
}

export function TeacherCommerceHub({ currency, onOpenAccount }: { currency: Currency; onOpenAccount: () => void }) {
  const [active, setActive] = useState<HubTab>("flow");
  return (
    <section className="mb-12 rounded-[28px] p-3 md:p-4" style={{ background: "linear-gradient(145deg, rgba(255,184,0,0.055), rgba(108,99,255,0.05), rgba(0,255,178,0.035))", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="p-3 md:p-4 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Teacher commerce center</p><h2 className="mt-2 text-2xl md:text-3xl font-black" style={{ fontFamily: "Outfit, sans-serif" }}>From verification to payout—clearly.</h2></div><p className="max-w-xl text-xs leading-relaxed" style={{ color: MUTED }}>Explore the intended money flow and account setup. Secure providers and a production backend are required before real transactions can be enabled.</p></div>
      <div role="tablist" aria-label="Teacher payments and verification" className="grid grid-cols-4 gap-1 rounded-2xl p-1.5 mb-4" style={{ background: "rgba(0,0,0,0.48)", border: "1px solid rgba(255,255,255,0.06)" }}>{hubTabs.map(tab => <button key={tab.id} role="tab" aria-selected={active === tab.id} onClick={() => setActive(tab.id)} className="min-h-12 rounded-xl px-2 md:px-4 flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold transition-colors" style={active === tab.id ? { background: PANEL, color: "#fff", border: "1px solid rgba(255,255,255,0.09)" } : { color: "#77778A", border: "1px solid transparent" }}><tab.icon size={14} style={{ color: active === tab.id ? NEON : "currentColor" }} /><span className="hidden sm:inline">{tab.label}</span><span className="sm:hidden">{tab.short}</span></button>)}</div>
      {active === "flow" && <PaymentFlow currency={currency} />}
      {active === "verification" && <VerificationFlow onOpenAccount={onOpenAccount} />}
      {active === "wallet" && <WalletView currency={currency} onOpenAccount={onOpenAccount} />}
      {active === "safety" && <SafetyView />}
      <div className="mt-4 rounded-xl px-4 py-3 flex gap-3" style={{ background: "rgba(0,0,0,0.38)", border: "1px solid rgba(255,255,255,0.055)" }}><LockKeyhole size={15} className="flex-none mt-0.5" style={{ color: "#8E8EA3" }} /><p className="text-[10px] leading-relaxed" style={{ color: "#818195" }}>Privacy boundary: never store passwords, identity documents, full card/bank details, provider secrets, authoritative balances, or client-controlled payment status in the browser. Production login, KYC, ledger, webhooks, refunds, disputes, and payouts require secure server-side services.</p></div>
    </section>
  );
}
