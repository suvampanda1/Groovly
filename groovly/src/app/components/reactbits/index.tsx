// ─── ReactBits-style animation components, tuned for Groovly ─────────────────
// Adapted from reactbits.dev patterns (MIT) — SplitText, CountUp,
// SpotlightCard, ShinyText, BlurRise — powered by the `motion` engine.

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── SplitText — characters cascade in with a blur-rise ─────────────────────── */
export function SplitText({
  text, className, style, delay = 0, stagger = 0.035,
}: { text: string; className?: string; style?: CSSProperties; delay?: number; stagger?: number }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  if (reduceMotion) {
    return <span className={className} style={{ display: "inline-block", ...style }}>{text}</span>;
  }
  return (
    <span className={className} style={{ display: "inline-block", ...style }} aria-label={text} role="text">
      {words.map((word, wordIndex) => {
        const charOffset = words.slice(0, wordIndex).reduce((total, item) => total + item.length + 1, 0);
        return (
          <span key={word + wordIndex} aria-hidden style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {Array.from(word).map((character, charIndex) => (
              <motion.span
                key={character + charIndex}
                initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.65, ease: EASE, delay: delay + (charOffset + charIndex) * stagger }}
                style={{ display: "inline-block" }}
              >
                {character}
              </motion.span>
            ))}
            {wordIndex < words.length - 1 && <span>&nbsp;</span>}
          </span>
        );
      })}
    </span>
  );
}
/* ── BlurRise — a whole block reveals as one unit ───────────────────────────── */
export function BlurRise({
  children, delay = 0, y = 24, className, style,
}: { children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <span className={className} style={{ display: "inline-block", ...style }}>{children}</span>;
  }
  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", ...style }}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.span>
  );
}

/* ── CountUp — numbers roll up when scrolled into view ──────────────────────── */
export function CountUp({
  to, decimals = 0, suffix = "", prefix = "", duration = 1.8, className, style,
}: { to: number; decimals?: number; suffix?: string; prefix?: string; duration?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / (duration * 1000), 1);
      const eased = 1 - Math.pow(2, -10 * p); // easeOutExpo
      setVal(to * (p === 1 ? 1 : eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduceMotion]);

  const displayVal = reduceMotion ? to : val;

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{displayVal.toFixed(decimals)}{suffix}
    </span>
  );
}

/* ── SpotlightCard — a glow follows the cursor across the card ──────────────── */
export function SpotlightCard({
  children, className, style, color = "rgba(0, 255, 178, 0.09)",
}: { children: ReactNode; className?: string; style?: CSSProperties; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const [over, setOver] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const syncPointer = () => setFinePointer(pointerQuery.matches);
    syncPointer();
    pointerQuery.addEventListener("change", syncPointer);
    return () => pointerQuery.removeEventListener("change", syncPointer);
  }, []);

  const interactive = finePointer && !reduceMotion;

  useEffect(() => {
    if (!interactive) {
      setOver(false);
      setPos(current => current.x === -999 && current.y === -999 ? current : { x: -999, y: -999 });
    }
  }, [interactive]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", ...style }}
      onMouseMove={interactive ? e => {
        const r = ref.current?.getBoundingClientRect();
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      } : undefined}
      onMouseEnter={interactive ? () => setOver(true) : undefined}
      onMouseLeave={interactive ? () => setOver(false) : undefined}
    >
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 2,
          opacity: interactive && over ? 1 : 0, transition: "opacity 0.4s ease",
          background: `radial-gradient(380px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

/* ── ShinyText — a light band sweeps across the letters ─────────────────────── */
export function ShinyText({
  text, className, style, base = "#00FFB2", speed = 3,
}: { text: string; className?: string; style?: CSSProperties; base?: string; speed?: number }) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: `linear-gradient(120deg, ${base} 35%, #FFFFFF 50%, ${base} 65%)`,
        backgroundSize: "220% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        animation: `rb-shine ${speed}s linear infinite`,
        display: "inline-block",
        ...style,
      }}
    >
      {text}
    </span>
  );
}
