import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, CircleAlert, CircleDollarSign,
  LockKeyhole, Mail, RefreshCcw, ShieldCheck, UserRound, Zap,
} from "lucide-react";

export type AccountRole = "student" | "teacher";
export type AuthMode = "login" | "signup";

const NEON = "#00FFB2";
const VIOLET = "#6C63FF";
const GOLD = "#FFB800";
const PANEL = "#080810";
const INPUT = "#0E0E1A";
const MUTED = "#A5A5BA";
const inputClass = "min-h-12 w-full rounded-xl px-4 text-sm outline-none transition-colors placeholder:text-[#646478]";

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className="h-5 w-5 flex-none">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 31 14.2l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 31 14.2l5.7-5.7A20 20 0 0 0 6.3 14.7Z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 12.9 28l-6.5 5A20 20 0 0 0 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C41.3 35.2 44 30 44 24c0-1.2-.1-2.4-.4-3.5Z" />
    </svg>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-mono font-bold uppercase tracking-[0.12em]" style={{ color: "#8A8AA4" }}>{label}</span>
      {children}
    </label>
  );
}

function StatusPill({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: NEON, background: `${NEON}12`, border: `1px solid ${NEON}30` }}>{children}</span>;
}

export function AuthPage({ initialMode, onBack, onAuthenticated }: {
  initialMode: AuthMode;
  onBack: () => void;
  onAuthenticated: (role: AccountRole, mode: AuthMode) => void;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<AccountRole>(initialMode === "signup" ? "teacher" : "student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [authMethod, setAuthMethod] = useState<"email" | "google">("email");
  const [error, setError] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setAuthMethod("email");
    if (mode === "signup" && fullName.trim().length < 2) {
      setError("Enter your name to create an account.");
      return;
    }
    if (!email.includes("@") || password.length < 6) {
      setError("Use a valid email and a password with at least 6 characters.");
      return;
    }
    setStatus("processing");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("success"), 700);
  };

  const continueWithGoogle = () => {
    setError("");
    setAuthMethod("google");
    setStatus("processing");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("success"), 700);
  };

  return (
    <main className="min-h-screen bg-black text-white grid lg:grid-cols-[0.9fr_1.1fr]" style={{ fontFamily: "Manrope, sans-serif" }}>
      <section className="relative hidden lg:flex overflow-hidden p-12 xl:p-16 flex-col justify-between" style={{ background: "radial-gradient(circle at 20% 15%, rgba(0,255,178,0.16), transparent 38%), radial-gradient(circle at 80% 75%, rgba(108,99,255,0.2), transparent 42%), #050509" }}>
        <button onClick={onBack} className="relative z-10 w-fit flex items-center gap-2 text-sm font-bold min-h-11" style={{ color: "#C8C8D8" }}><ArrowLeft size={17} /> Back to Groovly</button>
        <div className="relative z-10 max-w-xl">
          <StatusPill><ShieldCheck size={12} /> One account, every rhythm</StatusPill>
          <h1 className="mt-6 text-5xl xl:text-7xl font-black leading-[0.95]" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.045em" }}>Learn globally.<br /><span style={{ color: NEON }}>Earn securely.</span></h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed" style={{ color: "#B5B5C7" }}>Join live classes, purchase videos, or build your own international teaching business with one Groovly account.</p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {["Protected checkout", "Global teachers", "Clear payout states"].map(item => <div key={item} className="rounded-2xl p-4 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#CFCFDD" }}><Check size={14} className="mb-3" style={{ color: NEON }} />{item}</div>)}
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="absolute inset-0 pointer-events-none lg:hidden" style={{ background: "radial-gradient(circle at 20% 0%, rgba(0,255,178,0.1), transparent 38%)" }} />
        <div className="relative w-full max-w-[520px]">
          <button onClick={onBack} className="lg:hidden mb-8 flex items-center gap-2 min-h-11 text-sm font-bold" style={{ color: "#B8B8CA" }}><ArrowLeft size={17} /> Back to Groovly</button>
          <div className="mb-8">
            <div className="mb-5 flex items-center gap-3"><div className="h-11 w-11 rounded-2xl flex items-center justify-center" style={{ background: `${NEON}12`, border: `1px solid ${NEON}32`, color: NEON }}><Zap size={20} /></div><span className="text-xl font-black tracking-[0.08em]" style={{ fontFamily: "Outfit, sans-serif" }}>GROOVLY</span></div>
            <h2 className="text-4xl font-black" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.025em" }}>{mode === "login" ? "Welcome back." : "Create your account."}</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>{mode === "login" ? "Continue learning or manage your earning studio." : "Choose what you want to do first. You can learn and earn from the same account."}</p>
          </div>

          {status === "success" ? (
            <div className="tab-enter rounded-3xl p-7 sm:p-9 text-center" style={{ background: PANEL, border: `1px solid ${NEON}30`, boxShadow: `0 24px 80px ${NEON}0D` }}>
              <div className="mx-auto mb-5 h-16 w-16 rounded-full flex items-center justify-center" style={{ background: `${NEON}15`, border: `1px solid ${NEON}40`, color: NEON }}><CheckCircle2 size={30} /></div>
              <h3 className="text-2xl font-black" style={{ fontFamily: "Outfit, sans-serif" }}>{authMethod === "google" ? (mode === "login" ? "Google sign-in preview ready" : "Google sign-up preview ready") : (mode === "login" ? "Login preview complete" : "Account setup preview ready")}</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>{authMethod === "google" ? "No request was sent to Google and no session was created. Connect Google OAuth through the production identity provider to enable real authentication." : (mode === "login" ? "No session was created. Connect a production identity provider before enabling real sign-in." : "No account was created and your password was not stored. This preview only shows the intended setup flow.")}</p>
              <button onClick={() => onAuthenticated(role, mode)} className="mt-7 min-h-12 w-full rounded-xl px-5 font-black flex items-center justify-center gap-2" style={{ background: NEON, color: "#000" }}>{mode === "login" ? "Return to Groovly" : "Continue to Groovly"} <ArrowRight size={17} /></button>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-3xl p-5 sm:p-7" style={{ background: PANEL, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 28px 90px rgba(0,0,0,0.45)" }}>
              <div className="grid grid-cols-2 rounded-xl p-1 mb-6" style={{ background: INPUT }}>
                {(["login", "signup"] as AuthMode[]).map(item => <button key={item} type="button" onClick={() => { window.clearTimeout(timer.current); setMode(item); setRole(item === "signup" ? "teacher" : "student"); setStatus("idle"); setAuthMethod("email"); setError(""); }} className="min-h-11 rounded-lg text-sm font-bold transition-colors" style={mode === item ? { background: "#181824", color: "#fff" } : { color: "#77778B" }}>{item === "login" ? "Log in" : "Sign up"}</button>)}
              </div>

              {mode === "signup" && <div className="mb-5"><p className="mb-2 text-[11px] font-mono font-bold uppercase tracking-[0.12em]" style={{ color: "#8A8AA4" }}>I want to</p><div className="grid grid-cols-2 gap-3">{[
                { id: "student" as const, label: "Learn", icon: UserRound, color: VIOLET },
                { id: "teacher" as const, label: "Earn", icon: CircleDollarSign, color: GOLD },
              ].map(item => <button key={item.id} type="button" onClick={() => setRole(item.id)} className="min-h-14 rounded-xl px-4 flex items-center justify-center gap-2.5 text-sm font-black" style={role === item.id ? { color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}36` } : { color: "#8A8AA4", background: INPUT, border: "1px solid rgba(255,255,255,0.06)" }}><item.icon size={17} /> {item.label}</button>)}</div></div>}

              <button
                type="button"
                onClick={continueWithGoogle}
                disabled={status === "processing"}
                className="min-h-12 w-full rounded-xl px-4 text-sm font-bold flex items-center justify-center gap-2.5 whitespace-nowrap transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                style={{ background: "#FFFFFF", color: "#17171F", border: "1px solid rgba(255,255,255,0.75)", boxShadow: "0 10px 34px rgba(0,0,0,0.2)" }}
              >
                {status === "processing" && authMethod === "google" ? <RefreshCcw size={18} className="animate-spin" /> : <GoogleMark />}
                {status === "processing" && authMethod === "google" ? "Connecting to Google" : mode === "login" ? "Sign in with Google" : "Sign up with Google"}
              </button>

              <div className="my-5 flex items-center gap-3" aria-hidden>
                <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.14em]" style={{ color: "#6F6F82" }}>or continue with email</span>
                <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>

              <div className="space-y-4">
                {mode === "signup" && <Field label="Full name"><div className="relative"><UserRound size={16} className="absolute left-4 top-4" style={{ color: "#66667A" }} /><input value={fullName} onChange={event => setFullName(event.target.value)} className={`${inputClass} pl-11`} style={{ background: INPUT, border: "1px solid rgba(255,255,255,0.07)" }} placeholder="Your name" autoComplete="name" /></div></Field>}
                <Field label="Email address"><div className="relative"><Mail size={16} className="absolute left-4 top-4" style={{ color: "#66667A" }} /><input value={email} onChange={event => setEmail(event.target.value)} className={`${inputClass} pl-11`} style={{ background: INPUT, border: "1px solid rgba(255,255,255,0.07)" }} placeholder="you@example.com" type="email" autoComplete="email" /></div></Field>
                <Field label="Password"><div className="relative"><LockKeyhole size={16} className="absolute left-4 top-4" style={{ color: "#66667A" }} /><input value={password} onChange={event => setPassword(event.target.value)} className={`${inputClass} pl-11 pr-14`} style={{ background: INPUT, border: "1px solid rgba(255,255,255,0.07)" }} placeholder="At least 6 characters" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} aria-invalid={Boolean(error)} /><button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-2 top-1.5 min-h-9 px-3 rounded-lg text-[11px] font-bold" style={{ color: "#A0A0B4" }}>{showPassword ? "Hide" : "Show"}</button></div></Field>
              </div>

              {error && <p role="alert" className="mt-4 flex items-center gap-2 text-xs" style={{ color: "#FF7A94" }}><CircleAlert size={14} />{error}</p>}
              <button disabled={status === "processing"} className="mt-6 min-h-12 w-full rounded-xl px-5 font-black flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: NEON, color: "#000", boxShadow: `0 0 24px ${NEON}22` }}>{status === "processing" && authMethod === "email" ? <><RefreshCcw size={16} className="animate-spin" /> Checking preview</> : <>{mode === "login" ? "Log in" : "Create account"}<ArrowRight size={17} /></>}</button>
              <div className="mt-5 rounded-xl p-3.5 flex gap-3" style={{ background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.18)" }}><ShieldCheck size={16} className="mt-0.5 flex-none" style={{ color: "#AAA5FF" }} /><p className="text-[11px] leading-relaxed" style={{ color: "#A8A8BC" }}><strong style={{ color: "#D3D1FF" }}>UI preview:</strong> no password or account data entered here is stored. Production login requires an identity provider, secure sessions, MFA, and rate limiting.</p></div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
