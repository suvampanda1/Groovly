import { useState, useRef, useEffect, useCallback } from "react";
import { SplitText, BlurRise, SpotlightCard, ShinyText } from "./components/reactbits";
import { AuthPage, type AccountRole, type AuthMode } from "./components/account/AuthPage";
import { TeacherCommerceHub } from "./components/account/TeacherCommerceHub";
import { CheckoutPreview, type CheckoutItem, type CheckoutStatus } from "./components/account/CheckoutPreview";
import {
  DISCOVERY_STORAGE_KEY,
  LocationPicker,
  RegionalSpotlight,
  getDiscoveryRegion,
  rankByRegion,
  readStoredDiscoveryRegionKey,
  type DiscoveryRegion,
} from "./components/discovery/RegionalDiscovery";
import {
  Play, Radio, Users, Clock, ChevronRight, X, Send, Sparkles, Star,
  TrendingUp, Zap, Music, Search, Home, Video, BookOpen, User,
  ChevronLeft, Globe, Heart, Share2, Bookmark, ArrowRight, Flame,
  Crown, Lock, Camera, Upload, DollarSign, CheckCircle, MapPin,
  Award, Briefcase, RotateCcw, FlipHorizontal, Mic, StopCircle,
  Eye, GraduationCap, IndianRupee, TrendingDown, BarChart2,
  FileVideo, Plus, Check, Image, Film, Mail,
} from "lucide-react";

type Currency = "INR" | "USD";
type Tab = "home" | "learn" | "earn" | "book";
interface Msg { role: "user" | "ai"; text: string; ts: string; }

const NEON = "#00FFB2";
const NEON2 = "#6C63FF";
const PINK = "#FF2D55";
const GOLD = "#FFB800";
const SUPPORT_EMAIL = "support@groovly.co.in";

// ─── Shared Data ─────────────────────────────────────────────────────────────

const promos = [
  { id: 1, tag: "BESTSELLER", label: "12-Week Intensive", title: "Master Hip-Hop\nFundamentals", instructor: "Kayla Johnson", priceINR: 3999, priceUSD: 49, rating: 4.9, students: "14.8K", accent: NEON, regionKey: "new-york", image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=1400&h=700&fit=crop&auto=format&q=80" },
  { id: 2, tag: "NEW DROP", label: "International Artist", title: "Contemporary\nFlow Masterclass", instructor: "Arjun Mehta", priceINR: 2799, priceUSD: 34, rating: 4.8, students: "8.3K", accent: NEON2, regionKey: "bengaluru", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1400&h=700&fit=crop&auto=format&q=80" },
  { id: 3, tag: "🔥 TRENDING", label: "Classical × Street", title: "Bollywood\nFusion Revolution", instructor: "Priya Nair", priceINR: 1999, priceUSD: 24, rating: 4.7, students: "21.5K", accent: PINK, regionKey: "mumbai", image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1400&h=700&fit=crop&auto=format&q=80" },
];

const lives = [
  { id: 1, title: "Breaking Basics", instructor: "DJ Kross", viewers: 342, genre: "Hip-Hop", level: "Beginner", ago: "12 min", priceINR: 499, priceUSD: 6, regionKey: "delhi", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 2, title: "Salsa Caliente", instructor: "Maria Cruz", viewers: 187, genre: "Latin", level: "Intermediate", ago: "5 min", priceINR: 699, priceUSD: 9, regionKey: "singapore", image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 3, title: "Popping & Locking", instructor: "Urban Flex", viewers: 529, genre: "Street", level: "All Levels", ago: "28 min", priceINR: 599, priceUSD: 7, regionKey: "delhi", image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 4, title: "Kathak Fusion", instructor: "Divya Sharma", viewers: 211, genre: "Classical", level: "Intermediate", ago: "2 min", priceINR: 799, priceUSD: 10, regionKey: "bhubaneswar", image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 5, title: "Waacking Session", instructor: "Princess K", viewers: 94, genre: "Vogue", level: "Advanced", ago: "41 min", priceINR: 449, priceUSD: 5, regionKey: "london", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 6, title: "Zumba Morning Burn", instructor: "Sofia Reyes", viewers: 418, genre: "Zumba", level: "All Levels", ago: "8 min", priceINR: 549, priceUSD: 7, regionKey: "dubai", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=640&h=420&fit=crop&auto=format&q=80" },
];

const vids = [
  { id: 1, title: "8-Count Foundations", instructor: "Mia Rodriguez", duration: "18:42", views: "142K", likes: "9.2K", genre: "Hip-Hop", level: "Beginner", regionKey: "mumbai", image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 2, title: "Footwork Drills for Speed", instructor: "Tommy Lee", duration: "24:10", views: "87K", likes: "5.1K", genre: "Breaking", level: "Intermediate", regionKey: "delhi", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 3, title: "Flexibility & Body Control", instructor: "Arya Kapoor", duration: "31:05", views: "203K", likes: "18K", genre: "Contemporary", level: "All Levels", regionKey: "bengaluru", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 4, title: "Rhythm & Groove Theory", instructor: "Kayla Johnson", duration: "15:28", views: "310K", likes: "24K", genre: "Hip-Hop", level: "Beginner", regionKey: "new-york", image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 5, title: "Bharatanatyam Adavus", instructor: "Divya Sharma", duration: "42:18", views: "56K", likes: "4.8K", genre: "Classical", level: "Beginner", regionKey: "bhubaneswar", image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 6, title: "Heels Choreo Masterclass", instructor: "Princess K", duration: "27:33", views: "178K", likes: "15K", genre: "Commercial", level: "Intermediate", regionKey: "london", image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=640&h=420&fit=crop&auto=format&q=80" },
  { id: 7, title: "Zumba Cardio Party", instructor: "Sofia Reyes", duration: "29:45", views: "226K", likes: "19K", genre: "Zumba", level: "All Levels", regionKey: "dubai", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=640&h=420&fit=crop&auto=format&q=80" },
];

const videographers = [
  { id: 1, name: "Rohan Verma", city: "Mumbai", specialty: "Dance Reels & Shorts", rating: 4.9, reviews: 214, priceINR: 8000, priceUSD: 97, available: true, badge: "Top Rated", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format&q=80", portfolio: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400&h=300&fit=crop&auto=format&q=70"] },
  { id: 2, name: "Sneha Pillai", city: "Delhi", specialty: "Live Performance Capture", rating: 4.8, reviews: 178, priceINR: 6500, priceUSD: 79, available: true, badge: "Pro", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format&q=80", portfolio: ["https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=300&fit=crop&auto=format&q=70"] },
  { id: 3, name: "Aditya Sen", city: "Bangalore", specialty: "Tutorial & Course Videos", rating: 4.7, reviews: 93, priceINR: 5000, priceUSD: 61, available: false, badge: "New", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format&q=80", portfolio: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=300&fit=crop&auto=format&q=70"] },
  { id: 4, name: "Zara Khan", city: "Hyderabad", specialty: "Instagram & Social Content", rating: 4.9, reviews: 301, priceINR: 9500, priceUSD: 115, available: true, badge: "Elite", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format&q=80", portfolio: ["https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=300&fit=crop&auto=format&q=70"] },
  { id: 5, name: "Karan Bose", city: "Pune", specialty: "Music Video & Cinematic", rating: 4.6, reviews: 67, priceINR: 12000, priceUSD: 145, available: true, badge: "Pro", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format&q=80", portfolio: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400&h=300&fit=crop&auto=format&q=70"] },
  { id: 6, name: "Meera Iyer", city: "Chennai", specialty: "Classical & Fusion Dance", rating: 4.8, reviews: 142, priceINR: 7000, priceUSD: 85, available: true, badge: "Top Rated", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&auto=format&q=80", portfolio: ["https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=300&fit=crop&auto=format&q=70", "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=300&fit=crop&auto=format&q=70"] },
];

const teacherVideos = [
  { id: 1, title: "Beginner Footwork Series", views: "4.2K", earnings: 8400, earningsUSD: 102, status: "published", thumb: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=400&h=260&fit=crop&auto=format&q=70", uploadedAt: "3 days ago" },
  { id: 2, title: "Advanced Isolations", views: "2.1K", earnings: 4200, earningsUSD: 51, status: "published", thumb: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=260&fit=crop&auto=format&q=70", uploadedAt: "1 week ago" },
  { id: 3, title: "Hip-Hop Combos — Part 3", views: "—", earnings: 0, earningsUSD: 0, status: "draft", thumb: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=260&fit=crop&auto=format&q=70", uploadedAt: "Today" },
];

const aiAnswers: Record<string, string> = {
  default: "Hey! I'm Groove AI — your dance assistant. Ask me about classes, pricing, booking a videographer, how to upload videos, or anything else 🎧",
  class: "We have 800+ live and recorded classes across Hip-Hop, Salsa, Contemporary, Breaking, Kathak, Vogue, Zumba, and more. Want a recommendation?",
  price: "Programs are priced individually in INR or USD. Live-class payments are held securely until completion; on-demand video sales have a ₹30 platform fee, with tax, processing, and FX shown separately.",
  beginner: "Start with '8-Count Foundations' or our live 'Breaking Basics' — both hit hard for beginners. Want me to add one to your schedule?",
  hip: "Hip-Hop is on fire! 🔥 Top: 'Breaking Basics' live (529 viewers), 'Rhythm & Groove Theory' (310K views), Kayla Johnson's 12-week program.",
  billing: "Groovly supports eligible cards, PayPal, UPI apps, and provider-generated QR by country and device. If a payment is still confirming, do not pay again—use Check status with your transaction reference.",
  video: "Open Earn → Video Studio Preview to explore recording, upload, pricing, and publishing steps. Real media storage and publishing require the production backend.",
  book: "To book a videographer, go to the Book Pro tab. You'll find vetted professionals across India with portfolio previews. Filter by city, specialty, or budget. Prices start from ₹5,000 per session!",
  zumba: "Zumba is now in Find your rhythm, live classes, and on-demand videos. Try Sofia Reyes' Zumba Cardio Party for an all-level energy boost!",
};
function getAI(input: string) {
  const l = input.toLowerCase();
  if (l.includes("class") || l.includes("live")) return aiAnswers.class;
  if (l.includes("price") || l.includes("cost") || l.includes("plan") || l.includes("inr") || l.includes("usd") || l.includes("₹")) return aiAnswers.price;
  if (l.includes("begin") || l.includes("start") || l.includes("new")) return aiAnswers.beginner;
  if (l.includes("zumba") || l.includes("dance fitness")) return aiAnswers.zumba;
  if (l.includes("hip") || l.includes("hop") || l.includes("break")) return aiAnswers.hip;
  if (l.includes("bill") || l.includes("refund") || l.includes("pay")) return aiAnswers.billing;
  if (l.includes("upload") || l.includes("record") || l.includes("video") || l.includes("camera")) return aiAnswers.video;
  if (l.includes("book") || l.includes("videograph") || l.includes("shoot")) return aiAnswers.book;
  return aiAnswers.default;
}
function fmt(inr: number, usd: number, cur: Currency) {
  return cur === "INR" ? `₹${inr.toLocaleString("en-IN")}` : `$${usd}`;
}

// ─── Atoms ───────────────────────────────────────────────────────────────────

function Pill({ text, color = NEON }: { text: string; color?: string }) {
  return (
    <span className="inline-flex items-center px-2 py-[3px] rounded-full text-[9px] font-mono font-bold tracking-[0.12em] uppercase"
      style={{ color, background: `${color}12`, border: `1px solid ${color}28` }}>
      {text}
    </span>
  );
}

function Equalizer({ color = NEON, size = 15 }: { color?: string; size?: number }) {
  return (
    <span aria-hidden className="inline-flex items-end gap-[2.5px]" style={{ height: size }}>
      {[0.9, 0.55, 1.15, 0.7].map((d, i) => (
        <span key={i} className="eq-bar rounded-full" style={{ width: 3, height: size, background: color, animationDuration: `${d}s`, animationDelay: `${i * 0.13}s` }} />
      ))}
    </span>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ background: "rgba(255,45,85,0.15)", border: "1px solid rgba(255,45,85,0.4)" }}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D55] opacity-80" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF2D55]" />
      </span>
      <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF2D55] uppercase">Live</span>
    </span>
  );
}

function SectionLabel({ icon: Icon, text, count, color = NEON }: { icon: any; text: string; count?: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-2.5">
        <Icon size={13} style={{ color }} />
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-foreground font-bold">{text}</span>
      </div>
      {count && <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold" style={{ background: `${color}12`, color, border: `1px solid ${color}28` }}>{count}</span>}
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}20, transparent)` }} />
    </div>
  );
}

// ─── Promo Carousel ───────────────────────────────────────────────────────────

function PromoCarousel({ currency, onCheckout }: { currency: Currency; onCheckout: (item: CheckoutItem) => void }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const p = promos[idx];
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(i => (i + 1) % promos.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="px-4 md:px-8 mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Crown size={13} style={{ color: GOLD }} />
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-bold" style={{ color: GOLD }}>Featured Programs</span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${GOLD}30, transparent)` }} />
        <span className="font-mono text-[10px] text-muted-foreground">{idx + 1} / {promos.length}</span>
      </div>

      <div className="relative rounded-2xl overflow-hidden select-none" style={{ height: 480 }}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {promos.map((pr, i) => (
          <img key={pr.id} decoding="async" src={pr.image} alt={pr.title.replace("\n", " ")}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === idx ? 1 : 0 }} />
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, #000 0%, #000C 35%, #00008A 60%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #000 0%, #000A 20%, transparent 55%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-700" style={{ background: `linear-gradient(90deg, ${p.accent}, transparent)`, boxShadow: `0 0 30px ${p.accent}80` }} />

        <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12">
          <div className="flex items-start justify-between">
            <div className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-black tracking-[0.2em] uppercase" style={{ background: `${p.accent}20`, border: `1px solid ${p.accent}50`, color: p.accent }}>{p.tag}</div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.3)" }}>
              <Lock size={10} style={{ color: GOLD }} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: GOLD }}>Paid Program</span>
            </div>
          </div>
          <div className="max-w-lg">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: p.accent, opacity: 0.8 }}>{p.label}</p>
            <h2 className="text-5xl md:text-6xl font-black leading-[1.05] mb-4 whitespace-pre-line" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em" }}>{p.title}</h2>
            <p className="text-base mb-6" style={{ color: "rgba(240,240,255,0.6)" }}>with <span style={{ color: p.accent }}>{p.instructor}</span></p>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-1.5">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill={GOLD} stroke="none" />)}<span className="text-sm font-bold ml-1">{p.rating}</span></div>
              <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.12)" }} />
              <span className="text-sm font-mono text-muted-foreground">{p.students} enrolled</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => onCheckout({ id: `program-${p.id}`, kind: "video", title: p.title.replace("\n", " "), instructor: p.instructor, price: currency === "INR" ? p.priceINR : p.priceUSD, thumbnailUrl: p.image })} className="flex items-center gap-3 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95" style={{ background: p.accent, color: "#000", boxShadow: `0 0 32px ${p.accent}70` }}>
                <Play size={16} fill="#000" /> Enroll — {fmt(p.priceINR, p.priceUSD, currency)}
              </button>
              <button className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}>
                Free Preview <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Vertical dots */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5">
          {promos.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={"Show featured program " + (i + 1)} className="rounded-full transition-all duration-300"
              style={{ width: 6, height: i === idx ? 28 : 6, background: i === idx ? p.accent : "rgba(255,255,255,0.2)", boxShadow: i === idx ? `0 0 10px ${p.accent}` : "none" }} />
          ))}
        </div>
        <button onClick={() => setIdx(i => (i - 1 + promos.length) % promos.length)} aria-label="Previous featured program" className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-all hover:scale-110" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}><ChevronLeft size={18} /></button>
        <button onClick={() => setIdx(i => (i + 1) % promos.length)} aria-label="Next featured program" className="absolute right-16 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-all hover:scale-110" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}><ChevronRight size={18} /></button>
      </div>
    </section>
  );
}

// ─── Live Classes ─────────────────────────────────────────────────────────────

function LiveSection({ currency, onCheckout, region }: { currency: Currency; onCheckout: (item: CheckoutItem) => void; region: DiscoveryRegion }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d, behavior: "smooth" });
  const rankedLives = rankByRegion(lives, region);
  return (
    <section className="mb-16 px-4 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D55] opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2D55]" /></span>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase font-bold">Live Now</span>
          </div>
          <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold" style={{ background: "rgba(255,45,85,0.12)", color: PINK, border: "1px solid rgba(255,45,85,0.3)" }}>{lives.length} streaming</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono" style={{ color: "#85859B" }}><MapPin size={10} style={{ color: NEON }} />{region.shortLabel} first</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-300)} aria-label="Previous live classes" className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all" style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)" }}><ChevronLeft size={15} /></button>
          <button onClick={() => scroll(300)} aria-label="Next live classes" className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all" style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)" }}><ChevronRight size={15} /></button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {rankedLives.map(cls => (
          <div key={cls.id} className="group flex-none w-[280px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1" style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="relative h-[168px] overflow-hidden bg-[#0E0E1A]">
              <img loading="lazy" decoding="async" src={cls.image} alt={cls.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #080810 0%, transparent 60%)" }} />
              <div className="absolute top-3 left-3"><LiveBadge /></div>
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Users size={10} style={{ color: NEON }} /><span className="text-[10px] font-mono font-bold">{cls.viewers}</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: NEON, boxShadow: `0 0 40px ${NEON}80` }}><Play size={22} fill="#000" className="ml-1" /></div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex gap-1.5 mb-3"><Pill text={cls.genre} color={NEON} /><Pill text={cls.level} color={NEON2} /></div>
              <h4 className="font-bold text-[15px] mb-1 leading-snug group-hover:text-accent transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>{cls.title}</h4>
              <div className="flex items-center justify-between gap-2 text-xs mb-3" style={{ color: "#8A8AA4" }}>
                <span>{cls.instructor}</span>
                <span className="flex items-center gap-1 text-[10px]"><MapPin size={10} style={{ color: NEON }} />{getDiscoveryRegion(cls.regionKey).shortLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#8A8AA4" }}><Clock size={11} />Started {cls.ago} ago</div>
              <button onClick={() => onCheckout({ id: `live-${cls.id}`, kind: "live", title: cls.title, instructor: cls.instructor, price: currency === "INR" ? cls.priceINR : cls.priceUSD, startsAt: `Started ${cls.ago} ago`, thumbnailUrl: cls.image })} className="mt-4 min-h-10 w-full rounded-xl text-xs font-black" style={{ background: `${NEON}12`, border: `1px solid ${NEON}30`, color: NEON }}>Join live · {fmt(cls.priceINR, cls.priceUSD, currency)}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Videos Grid ─────────────────────────────────────────────────────────────

function VideosSection({ currency, saved, toggleSave, region }: { currency: Currency; saved: Set<number>; toggleSave: (id: number) => void; region: DiscoveryRegion }) {
  const [filter, setFilter] = useState("All");
  const genres = ["All", "Hip-Hop", "Breaking", "Contemporary", "Classical", "Commercial", "Zumba"];
  const filtered = rankByRegion(filter === "All" ? vids : vids.filter(v => v.genre === filter), region);
  return (
    <section className="mb-24 px-4 md:px-8">
      <SectionLabel icon={Video} text="Learn at your pace" count={`${vids.length} videos · ${region.shortLabel} first`} />
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {genres.map(g => (
          <button key={g} onClick={() => setFilter(g)} className="flex-none px-4 py-2 rounded-full text-[11px] font-semibold font-mono uppercase tracking-wide transition-all duration-200"
            style={filter === g ? { background: NEON, color: "#000", boxShadow: `0 0 20px ${NEON}50` } : { background: "#0E0E1A", color: "#8A8AA4", border: "1px solid rgba(255,255,255,0.06)" }}>
            {g}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(v => (
          <div key={v.id} className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1" style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="relative h-[196px] overflow-hidden bg-[#0E0E1A]">
              <img loading="lazy" decoding="async" src={v.image} alt={v.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #080810 0%, transparent 50%)" }} />
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.08)" }}>{v.duration}</div>
              <button onClick={e => { e.stopPropagation(); toggleSave(v.id); }} aria-label={(saved.has(v.id) ? "Remove saved " : "Save ") + v.title} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                <Bookmark size={13} fill={saved.has(v.id) ? NEON : "none"} stroke={saved.has(v.id) ? NEON : "currentColor"} />
              </button>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: NEON, boxShadow: `0 0 40px ${NEON}80` }}><Play size={22} fill="#000" className="ml-1" /></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, ${NEON}, transparent)` }} />
            </div>
            <div className="p-4">
              <div className="flex gap-1.5 mb-3"><Pill text={v.genre} color={NEON} /><Pill text={v.level} color={NEON2} /></div>
              <h4 className="font-bold text-[15px] mb-1 leading-snug group-hover:text-accent transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>{v.title}</h4>
              <div className="flex items-center justify-between gap-2 text-xs mb-4" style={{ color: "#8A8AA4" }}>
                <span>{v.instructor}</span>
                <span className="flex items-center gap-1 text-[10px]"><MapPin size={10} style={{ color: NEON }} />{getDiscoveryRegion(v.regionKey).shortLabel}</span>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "#8A8AA4" }}>
                <span className="flex items-center gap-1.5"><TrendingUp size={11} />{v.views}</span>
                <span className="flex items-center gap-1.5"><Heart size={11} />{v.likes}</span>
                <button aria-label={"Share " + v.title} className="ml-auto hover:text-foreground transition-colors"><Share2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({
  currency,
  saved,
  toggleSave,
  onNavigate,
  onCheckout,
  region,
  onOpenLocation,
}: {
  currency: Currency;
  saved: Set<number>;
  toggleSave: (id: number) => void;
  onNavigate: (tab: Tab) => void;
  onCheckout: (item: CheckoutItem) => void;
  region: DiscoveryRegion;
  onOpenLocation: () => void;
}) {
  const [query, setQuery] = useState("");
  const styles = ["Hip-Hop", "Bollywood", "Contemporary", "Breaking", "Classical", "Salsa", "Zumba"];
  const trustSignals = [
    "Live + on-demand",
    "Clear levels & formats",
    "INR + USD supported",
    "Global teacher payouts",
  ];
  const featuredLive = rankByRegion(lives, region)[0];

  return (
    <>
      <section className="relative overflow-hidden px-4 md:px-8 pt-8 md:pt-14 pb-10 md:pb-14" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", zIndex: 1 }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 left-[18%] w-72 h-72 rounded-full blur-3xl" style={{ background: NEON + "0B" }} />
          <div className="absolute -bottom-20 right-[8%] w-80 h-80 rounded-full blur-3xl" style={{ background: NEON2 + "10" }} />
        </div>

        <div className="relative grid lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-14 items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: NEON + "0C", border: "1px solid " + NEON + "24" }}>
              <Flame size={11} style={{ color: NEON }} />
              <ShinyText text="LIVE, ON-DEMAND & 1:1 DANCE LEARNING" className="font-mono text-[10px] tracking-[0.17em] uppercase font-bold" />
            </div>

            <h1 className="font-black leading-[0.95] mb-6 text-[clamp(3.25rem,7vw,6.6rem)]" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.045em" }}>
              <SplitText text="Learn every move." stagger={0.024} />
              <br />
              <BlurRise delay={0.32}>
                <span style={{ background: "linear-gradient(90deg, " + NEON + " 0%, #00C8FF 34%, " + NEON2 + " 68%, " + PINK + " 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Earn from what moves you.
                </span>
              </BlurRise>
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-7 max-w-2xl" style={{ color: "#B0B0C6" }}>
              Join live sessions, master on-demand programs, book private coaching—or turn your own style into income with clear, protected payment flows.
            </p>

            <form
              className="max-w-2xl p-2 rounded-2xl flex flex-col sm:flex-row gap-2 mb-6"
              style={{ background: "rgba(14,14,26,0.92)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 18px 70px rgba(0,0,0,0.35)" }}
              onSubmit={e => { e.preventDefault(); onNavigate("learn"); }}
            >
              <label htmlFor="class-search" className="sr-only">Search dance classes, styles, or instructors</label>
              <div className="flex items-center gap-3 flex-1 min-w-0 px-3">
                <Search size={18} style={{ color: NEON }} aria-hidden />
                <input
                  id="class-search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search hip-hop, salsa, choreography…"
                  className="w-full py-3 bg-transparent outline-none text-sm placeholder:text-[#66667C]"
                />
              </div>
              <button type="submit" className="min-h-12 px-6 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ background: NEON, color: "#000", boxShadow: "0 0 28px rgba(0,255,178,0.22)" }}>
                Explore classes <ArrowRight size={15} />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => onNavigate("learn")} className="min-h-11 px-5 rounded-xl text-sm font-bold flex items-center gap-2" style={{ background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)", color: "#C5C1FF" }}>
                <GraduationCap size={16} /> I want to learn
              </button>
              <button onClick={() => onNavigate("earn")} className="min-h-11 px-5 rounded-xl text-sm font-bold flex items-center gap-2" style={{ background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.24)", color: "#FFD66B" }}>
                <DollarSign size={16} /> I want to earn
              </button>
            </div>
          </div>

          <SpotlightCard className="rounded-[28px] overflow-hidden min-h-[510px]" color="rgba(0,255,178,0.13)" style={{ border: "1px solid rgba(255,255,255,0.09)", background: "#080810", boxShadow: "0 30px 90px rgba(0,0,0,0.46)" }}>
            <div className="relative z-[3] min-h-[510px]">
              <img src={featuredLive.image} alt={`${featuredLive.title} dance class`} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.92) 84%)" }} />
              <div className="absolute inset-x-0 top-0 p-5 flex items-center justify-between">
                <LiveBadge />
                <span className="px-3 py-1.5 rounded-full text-[10px] font-mono font-bold" style={{ background: "rgba(0,0,0,0.62)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}>POPULAR IN {getDiscoveryRegion(featuredLive.regionKey).shortLabel.toUpperCase()}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color: NEON }}>Happening now · {featuredLive.genre}</p>
                <h2 className="text-3xl md:text-4xl font-black mb-2">{featuredLive.title}</h2>
                <p className="text-sm mb-5" style={{ color: "#C7C7D8" }}>with {featuredLive.instructor} · Join from any device</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => onCheckout({ id: `live-${featuredLive.id}`, kind: "live", title: featuredLive.title, instructor: featuredLive.instructor, price: currency === "INR" ? featuredLive.priceINR : featuredLive.priceUSD, startsAt: `Started ${featuredLive.ago} ago`, thumbnailUrl: featuredLive.image })} className="min-h-11 px-5 rounded-xl text-sm font-black flex items-center gap-2" style={{ background: NEON, color: "#000" }}>
                    <Play size={15} fill="#000" /> Join live
                  </button>
                  <span className="flex items-center gap-2 text-xs" style={{ color: "#C7C7D8" }}><Users size={14} style={{ color: NEON }} />{featuredLive.viewers} learning now</span>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>

        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {trustSignals.map(signal => (
            <div key={signal} className="min-h-12 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", color: "#C7C7D8" }}>
              <CheckCircle size={14} style={{ color: NEON }} aria-hidden />
              {signal}
            </div>
          ))}
        </div>
      </section>

      <div className="relative pt-10 md:pt-12" style={{ zIndex: 1 }}>
        <RegionalSpotlight region={region} videos={vids} onChangeLocation={onOpenLocation} onExplore={() => onNavigate("learn")} />
        <LiveSection currency={currency} onCheckout={onCheckout} region={region} />

        <section className="px-4 md:px-8 mb-16">
          <SectionLabel icon={Music} text="Find your rhythm" count="Choose a style" color={NEON2} />
          <div className="flex flex-wrap gap-2.5">
            {styles.map((style, index) => (
              <button key={style} onClick={() => onNavigate("learn")} className="min-h-11 px-5 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5" style={{ background: index === 0 ? NEON2 : "#0E0E1A", color: index === 0 ? "#fff" : "#B8B8CC", border: index === 0 ? "1px solid rgba(108,99,255,0.44)" : "1px solid rgba(255,255,255,0.08)" }}>
                {style}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 md:px-8 mb-20">
          <SectionLabel icon={Sparkles} text="One platform, two journeys" count="Pick your path" />
          <div className="grid md:grid-cols-2 gap-5">
            <SpotlightCard className="rounded-3xl overflow-hidden" color="rgba(108,99,255,0.16)" style={{ background: "linear-gradient(145deg, #0B0B18, #080810)", border: "1px solid rgba(108,99,255,0.2)" }}>
              <article className="relative z-[3] p-6 md:p-8 min-h-[330px] flex flex-col">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-7" style={{ background: "rgba(108,99,255,0.11)", border: "1px solid rgba(108,99,255,0.24)", color: "#B7B2FF" }}><GraduationCap size={22} /></div>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "#A9A3FF" }}>For learners</p>
                <h2 className="text-3xl md:text-4xl font-black mb-3">Find your next move.</h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#A8A8BC" }}>Choose your style, level and schedule. Learn live or on demand and keep your momentum visible.</p>
                <div className="space-y-2.5 mb-7 text-sm" style={{ color: "#D3D3DF" }}>
                  {["Live classes with real instructors", "Structured programs for every level", "Save lessons and continue anytime"].map(item => <div key={item} className="flex items-center gap-2"><Check size={14} style={{ color: NEON2 }} />{item}</div>)}
                </div>
                <button onClick={() => onNavigate("learn")} className="mt-auto min-h-12 px-5 rounded-xl font-black flex items-center justify-between" style={{ background: NEON2, color: "#fff" }}>Build my learning plan <ArrowRight size={17} /></button>
              </article>
            </SpotlightCard>

            <SpotlightCard className="rounded-3xl overflow-hidden" color="rgba(255,184,0,0.13)" style={{ background: "linear-gradient(145deg, #111008, #080810)", border: "1px solid rgba(255,184,0,0.18)" }}>
              <article className="relative z-[3] p-6 md:p-8 min-h-[330px] flex flex-col">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-7" style={{ background: "rgba(255,184,0,0.09)", border: "1px solid rgba(255,184,0,0.22)", color: GOLD }}><Crown size={22} /></div>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "#FFD66B" }}>For instructors</p>
                <h2 className="text-3xl md:text-4xl font-black mb-3">Turn your rhythm into income.</h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#A8A8BC" }}>Create live classes and video programs with publishing, payments and learner tools in one studio.</p>
                <div className="space-y-2.5 mb-7 text-sm" style={{ color: "#D3D3DF" }}>
                  {["Publish from camera or uploaded video", "Live earnings release to your wallet", "₹30 platform fee per completed video sale"].map(item => <div key={item} className="flex items-center gap-2"><Check size={14} style={{ color: GOLD }} />{item}</div>)}
                </div>
                <button onClick={() => onNavigate("earn")} className="mt-auto min-h-12 px-5 rounded-xl font-black flex items-center justify-between" style={{ background: GOLD, color: "#000" }}>Open my earning studio <ArrowRight size={17} /></button>
              </article>
            </SpotlightCard>
          </div>
        </section>

        <PromoCarousel currency={currency} onCheckout={onCheckout} />
        <VideosSection currency={currency} saved={saved} toggleSave={toggleSave} region={region} />

        <section className="px-4 md:px-8 mb-24">
          <div className="relative overflow-hidden rounded-[28px] p-7 md:p-12" style={{ background: "linear-gradient(120deg, rgba(0,255,178,0.07), rgba(108,99,255,0.1) 55%, rgba(255,45,85,0.05))", border: "1px solid rgba(255,255,255,0.09)" }}>
            <div className="absolute -right-16 -top-24 w-72 h-72 rounded-full blur-3xl" style={{ background: "rgba(108,99,255,0.13)" }} aria-hidden />
            <div className="relative grid lg:grid-cols-[1fr_auto] gap-7 items-end">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: NEON }}>Your next chapter starts with one count</p>
                <h2 className="text-4xl md:text-5xl font-black mb-3 max-w-3xl">Learn a style. Share your own. Keep moving.</h2>
                <p className="text-sm md:text-base max-w-2xl" style={{ color: "#AFAFC2" }}>Explore classes today or open your instructor studio and turn practice into impact.</p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <button onClick={() => onNavigate("learn")} className="min-h-12 px-6 rounded-xl font-black flex items-center justify-center gap-2 whitespace-nowrap" style={{ background: NEON, color: "#000" }}>Explore classes <ArrowRight size={16} /></button>
                <button onClick={() => onNavigate("earn")} className="min-h-12 px-6 rounded-xl font-black flex items-center justify-center gap-2 whitespace-nowrap" style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.14)" }}>Start earning <ArrowRight size={16} /></button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
// ─── Learn Tab (Students) ─────────────────────────────────────────────────────

function LearnTab({ currency, onCheckout, region, onOpenLocation }: { currency: Currency; onCheckout: (item: CheckoutItem) => void; region: DiscoveryRegion; onOpenLocation: () => void }) {
  const [activeCat, setActiveCat] = useState("All Styles");
  const cats = ["All Styles", "Hip-Hop", "Breaking", "Latin", "Contemporary", "Classical", "Vogue", "Zumba"];
  const courses = [
    { id: 1, title: "The Complete Hip-Hop Dancer", instructor: "Kayla Johnson", lessons: 48, duration: "12 hrs", level: "All Levels", priceINR: 3999, priceUSD: 49, rating: 4.9, students: "14.8K", progress: 32, genre: "Hip-Hop", regionKey: "new-york", image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=640&h=400&fit=crop&auto=format&q=80" },
    { id: 2, title: "Breaking: Zero to Hero", instructor: "Urban Flex", lessons: 36, duration: "9 hrs", level: "Beginner", priceINR: 2499, priceUSD: 30, rating: 4.8, students: "8.1K", progress: 0, genre: "Breaking", regionKey: "delhi", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640&h=400&fit=crop&auto=format&q=80" },
    { id: 3, title: "Salsa & Bachata Essentials", instructor: "Maria Cruz", lessons: 28, duration: "7 hrs", level: "Beginner", priceINR: 1999, priceUSD: 24, rating: 4.7, students: "11.2K", progress: 0, genre: "Latin", regionKey: "singapore", image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=640&h=400&fit=crop&auto=format&q=80" },
    { id: 4, title: "Contemporary Movement Lab", instructor: "Arya Kapoor", lessons: 52, duration: "14 hrs", level: "Intermediate", priceINR: 4499, priceUSD: 55, rating: 4.9, students: "5.4K", progress: 67, genre: "Contemporary", regionKey: "bengaluru", image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=640&h=400&fit=crop&auto=format&q=80" },
    { id: 5, title: "Bharatanatyam: Classical Forms", instructor: "Divya Sharma", lessons: 60, duration: "16 hrs", level: "Beginner", priceINR: 3499, priceUSD: 42, rating: 4.8, students: "7.9K", progress: 0, genre: "Classical", regionKey: "bhubaneswar", image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=640&h=400&fit=crop&auto=format&q=80" },
    { id: 6, title: "Vogue & Waacking Foundations", instructor: "Princess K", lessons: 24, duration: "6 hrs", level: "All Levels", priceINR: 1499, priceUSD: 18, rating: 4.6, students: "3.8K", progress: 0, genre: "Vogue", regionKey: "london", image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=640&h=400&fit=crop&auto=format&q=80" },
    { id: 7, title: "Zumba Cardio Party", instructor: "Sofia Reyes", lessons: 30, duration: "8 hrs", level: "All Levels", priceINR: 1799, priceUSD: 22, rating: 4.9, students: "12.6K", progress: 0, genre: "Zumba", regionKey: "dubai", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=640&h=400&fit=crop&auto=format&q=80" },
  ];
  const filtered = rankByRegion(activeCat === "All Styles" ? courses : courses.filter(c => c.genre === activeCat), region);
  const enrolled = courses.filter(c => c.progress > 0);

  return (
    <div className="px-4 md:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: `${NEON2}0C`, border: `1px solid ${NEON2}20` }}>
          <GraduationCap size={11} style={{ color: NEON2 }} />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: NEON2 }}>Student Portal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em" }}>
          Learn from the<br /><span style={{ background: `linear-gradient(90deg, ${NEON2}, ${NEON})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Best in the World.</span>
        </h1>
        <p className="text-[15px]" style={{ color: "#8A8AA4" }}>800+ courses taught by world-class dance artists. Learn at your pace.</p>
        <button onClick={onOpenLocation} className="mt-4 min-h-10 px-3.5 rounded-xl inline-flex items-center gap-2 text-xs font-bold transition-all hover:-translate-y-0.5" style={{ background: `${NEON}0C`, border: `1px solid ${NEON}24`, color: "#C7C7D8" }}>
          <MapPin size={13} style={{ color: NEON }} /> Recommendations for {region.shortLabel} <span style={{ color: NEON }}>· Change</span>
        </button>
      </div>

      {/* Continue Learning strip */}
      {enrolled.length > 0 && (
        <div className="mb-12">
          <SectionLabel icon={Play} text="Continue Learning" color={NEON2} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolled.map(c => (
              <div key={c.id} className="flex gap-4 p-4 rounded-2xl group cursor-pointer hover:-translate-y-0.5 transition-all duration-300" style={{ background: "#080810", border: "1px solid rgba(108,99,255,0.15)" }}>
                <div className="relative w-28 h-20 rounded-xl overflow-hidden flex-none bg-[#0E0E1A]">
                  <img loading="lazy" decoding="async" src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: NEON2 }}><Play size={14} fill="#fff" className="ml-0.5" /></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm mb-0.5 truncate group-hover:text-[#6C63FF] transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>{c.title}</h4>
                  <p className="text-xs mb-3" style={{ color: "#8A8AA4" }}>{c.instructor}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "#0E0E1A" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${c.progress}%`, background: `linear-gradient(90deg, ${NEON2}, ${NEON})` }} />
                    </div>
                    <span className="text-[11px] font-mono font-bold" style={{ color: NEON2 }}>{c.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Browse courses */}
      <SectionLabel icon={BookOpen} text="Browse Courses" count={`${filtered.length} courses`} color={NEON2} />
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {cats.map(g => (
          <button key={g} onClick={() => setActiveCat(g)} className="flex-none px-4 py-2 rounded-full text-[11px] font-semibold font-mono uppercase tracking-wide transition-all duration-200"
            style={activeCat === g ? { background: NEON2, color: "#fff", boxShadow: `0 0 20px ${NEON2}50` } : { background: "#0E0E1A", color: "#8A8AA4", border: "1px solid rgba(255,255,255,0.06)" }}>
            {g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(c => (
          <div key={c.id} className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1" style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="relative h-[186px] overflow-hidden bg-[#0E0E1A]">
              <img loading="lazy" decoding="async" src={c.image} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #080810 0%, transparent 55%)" }} />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: NEON2, boxShadow: `0 0 40px ${NEON2}80` }}><Play size={22} fill="#fff" className="ml-1" /></div>
              </div>
              <div className="absolute top-3 left-3"><Pill text={c.level} color={NEON2} /></div>
            </div>
            <div className="p-4">
              <div className="flex gap-1.5 mb-2"><Pill text={c.genre} color={NEON} /></div>
              <h4 className="font-bold text-[15px] mb-1 leading-snug group-hover:text-[#6C63FF] transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>{c.title}</h4>
              <div className="flex items-center justify-between gap-2 text-xs mb-3" style={{ color: "#8A8AA4" }}>
                <span>{c.instructor}</span>
                <span className="flex items-center gap-1 text-[10px]"><MapPin size={10} style={{ color: NEON }} />{getDiscoveryRegion(c.regionKey).shortLabel}</span>
              </div>
              <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: "#8A8AA4" }}>
                <span className="flex items-center gap-1"><BookOpen size={11} />{c.lessons} lessons</span>
                <span className="flex items-center gap-1"><Clock size={11} />{c.duration}</span>
                <span className="flex items-center gap-1"><Star size={11} fill={GOLD} stroke="none" style={{ color: GOLD }} />{c.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-base" style={{ fontFamily: "Outfit, sans-serif", color: NEON2 }}>{fmt(c.priceINR, c.priceUSD, currency)}</span>
                <button onClick={() => { if (c.progress === 0) onCheckout({ id: `course-${c.id}`, kind: "video", title: c.title, instructor: c.instructor, price: currency === "INR" ? c.priceINR : c.priceUSD, duration: c.duration, thumbnailUrl: c.image }); }} className="px-4 py-2 rounded-xl text-[12px] font-bold transition-all hover:scale-105 active:scale-95"
                  style={{ background: `${NEON2}18`, color: NEON2, border: `1px solid ${NEON2}35` }}>
                  {c.progress > 0 ? "Resume" : "Enroll"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Earn Tab (Teachers) ──────────────────────────────────────────────────────

type UploadStep = "idle" | "details" | "recording" | "preview" | "done";
type CamMode = "front" | "back";

function EarnTab({ currency, onOpenAccount }: { currency: Currency; onOpenAccount: () => void }) {
  const [step, setStep] = useState<UploadStep>("idle");
  const [camMode, setCamMode] = useState<CamMode>("front");
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [form, setForm] = useState({ title: "", genre: "Hip-Hop", level: "Beginner", desc: "", price: "", uploadType: "" as "" | "record" | "file" });
  const validPrice = Number(form.price) > 0;

  useEffect(() => {
    if (!isRecording) { setRecordSecs(0); return; }
    const t = setInterval(() => setRecordSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  const fmtSecs = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const totalEarned = teacherVideos.filter(v => v.status === "published").reduce((a, v) => a + v.earnings, 0);
  const totalEarnedUSD = teacherVideos.filter(v => v.status === "published").reduce((a, v) => a + v.earningsUSD, 0);

  return (
    <div className="px-4 md:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: `${GOLD}0C`, border: `1px solid ${GOLD}20` }}>
          <DollarSign size={11} style={{ color: GOLD }} />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: GOLD }}>Earning Studio</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em" }}>
          Go live. Upload.<br /><span style={{ background: `linear-gradient(90deg, ${GOLD}, ${PINK})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Earn Globally.</span>
        </h1>
        <p className="text-[15px] max-w-3xl leading-relaxed" style={{ color: "#A8A8BC" }}>Live-class payments release to your Groovly Wallet after the class and issue window. On-demand videos settle to the creator minus a ₹30 platform fee.</p>
      </div>

      <TeacherCommerceHub currency={currency} onOpenAccount={onOpenAccount} />

      {/* Earnings overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Total Earned", value: fmt(totalEarned, totalEarnedUSD, currency), icon: IndianRupee, color: NEON },
          { label: "This Month", value: fmt(8400, 102, currency), icon: TrendingUp, color: GOLD },
          { label: "Total Views", value: "6.3K", icon: Eye, color: NEON2 },
          { label: "Published", value: `${teacherVideos.filter(v => v.status === "published").length} videos`, icon: CheckCircle, color: PINK },
        ].map(stat => (
          <SpotlightCard key={stat.label} color={`${GOLD}10`} className="p-5 rounded-2xl" style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 mb-3">
              <stat.icon size={14} style={{ color: stat.color }} />
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "#8A8AA4" }}>{stat.label}</span>
            </div>
            <p className="text-xl font-black" style={{ fontFamily: "Outfit, sans-serif", color: stat.color }}>{stat.value}</p>
          </SpotlightCard>
        ))}
      </div>

      {/* Upload CTA */}
      {step === "idle" && (
        <div className="mb-12">
          <SectionLabel icon={Upload} text="Video Studio Preview" color={GOLD} />
          <div className="mb-5 flex items-start gap-2.5 rounded-xl p-3.5 text-[11px] leading-relaxed" style={{ background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.18)", color: "#B8B8C8" }}><Lock size={15} className="mt-0.5 flex-none" style={{ color: GOLD }} /><p><strong style={{ color: "#FFE08A" }}>Studio preview:</strong> no recording, file storage, processing, entitlement, or publishing happens in this interface. Those actions require authenticated production services.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Record */}
            <button onClick={() => { setForm(f => ({ ...f, uploadType: "record" })); setStep("details"); }}
              className="group relative p-8 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ background: "#080810", border: `1px solid ${NEON}20` }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at 30% 50%, ${NEON}06, transparent 70%)` }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative" style={{ background: `${NEON}15`, border: `1px solid ${NEON}30` }}>
                <Camera size={24} style={{ color: NEON }} />
              </div>
              <h3 className="text-lg font-black mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Record with Camera</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#8A8AA4" }}>Preview a front- or back-camera recording setup for dual-angle tutorials.</p>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold" style={{ background: `${NEON}12`, border: `1px solid ${NEON}25`, color: NEON }}>
                  <FlipHorizontal size={10} /> Front Camera
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold" style={{ background: `${NEON}12`, border: `1px solid ${NEON}25`, color: NEON }}>
                  <Camera size={10} /> Back Camera
                </div>
              </div>
            </button>

            {/* Upload file */}
            <button onClick={() => { setForm(f => ({ ...f, uploadType: "file" })); setStep("details"); }}
              className="group relative p-8 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ background: "#080810", border: `1px solid ${NEON2}20` }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at 30% 50%, ${NEON2}06, transparent 70%)` }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${NEON2}15`, border: `1px solid ${NEON2}30` }}>
                <Upload size={24} style={{ color: NEON2 }} />
              </div>
              <h3 className="text-lg font-black mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Upload from Device</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#8A8AA4" }}>Preview the flow for a pre-recorded MP4 or MOV. Real uploads require secure storage, scanning, and processing.</p>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold" style={{ background: `${NEON2}12`, border: `1px solid ${NEON2}25`, color: NEON2 }}>
                  <Film size={10} /> MP4 / MOV
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold" style={{ background: `${NEON2}12`, border: `1px solid ${NEON2}25`, color: NEON2 }}>
                  Up to 4 GB
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Step: Details form */}
      {step === "details" && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep("idle")} className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all" style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)" }}><ChevronLeft size={15} /></button>
            <SectionLabel icon={FileVideo} text="Video Details" color={GOLD} />
          </div>
          <div className="max-w-2xl space-y-5">
            {[
              { label: "Video Title", key: "title", placeholder: "e.g. Beginner Hip-Hop Footwork — Part 1" },
              { label: "Description", key: "desc", placeholder: "What will students learn in this video?" },
              { label: "Price (in your currency)", key: "price", placeholder: currency === "INR" ? "e.g. 499" : "e.g. 6" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "#8A8AA4" }}>{f.label}</label>
                {f.key === "desc" ? (
                  <textarea rows={3} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl px-4 py-3 text-[13px] outline-none placeholder:text-muted-foreground transition-all resize-none"
                    style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)", color: "#F0F0FF" }} />
                ) : (
                  <input type={f.key === "price" ? "number" : "text"} min={f.key === "price" ? "1" : undefined} step={f.key === "price" ? "1" : undefined} inputMode={f.key === "price" ? "numeric" : undefined} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl px-4 py-3 text-[13px] outline-none placeholder:text-muted-foreground transition-all"
                    style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)", color: "#F0F0FF" }} />
                )}
              </div>
            ))}

            {/* Genre + Level pickers */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "#8A8AA4" }}>Genre</label>
                <div className="flex flex-wrap gap-2">
                  {["Hip-Hop", "Contemporary", "Breaking", "Classical", "Salsa", "Commercial", "Zumba"].map(g => (
                    <button key={g} onClick={() => setForm(prev => ({ ...prev, genre: g }))}
                      className="px-3 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all"
                      style={form.genre === g
                        ? { background: NEON, color: "#000" }
                        : { background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)", color: "#8A8AA4" }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "#8A8AA4" }}>Level</label>
                <div className="flex flex-wrap gap-2">
                  {["Beginner", "Intermediate", "Advanced", "All Levels"].map(l => (
                    <button key={l} onClick={() => setForm(prev => ({ ...prev, level: l }))}
                      className="px-3 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all"
                      style={form.level === l
                        ? { background: NEON2, color: "#fff" }
                        : { background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)", color: "#8A8AA4" }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setStep(form.uploadType === "record" ? "recording" : "preview")}
              disabled={!form.title.trim() || !validPrice}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-[13px] font-black tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              style={{ background: form.title.trim() && validPrice ? `linear-gradient(90deg, ${NEON}, ${NEON2})` : "#0E0E1A", color: form.title.trim() && validPrice ? "#000" : "#8A8AA4", boxShadow: form.title.trim() && validPrice ? `0 0 24px ${NEON}30` : "none", fontFamily: "Outfit, sans-serif" }}>
              {form.uploadType === "record" ? <><Camera size={15} /> Start Recording</> : <><Upload size={15} /> Continue File Preview</>}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step: Recording (front / back camera) */}
      {step === "recording" && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => { setIsRecording(false); setStep("details"); }} className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all" style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)" }}><ChevronLeft size={15} /></button>
            <SectionLabel icon={Camera} text={`Recording — ${camMode === "front" ? "Front" : "Back"} Camera`} color={PINK} />
          </div>

          <div className="max-w-3xl">
            {/* Camera viewport (simulated) */}
            <div className="relative rounded-3xl overflow-hidden mb-6" style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #0A0A14, #10101E)", border: `1px solid ${isRecording ? PINK : "rgba(255,255,255,0.07)"}`, boxShadow: isRecording ? `0 0 40px ${PINK}20` : "none" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${camMode === "front" ? NEON : NEON2}0D`, border: `1px solid ${camMode === "front" ? NEON : NEON2}25` }}>
                  {camMode === "front" ? <User size={32} style={{ color: NEON }} /> : <Video size={32} style={{ color: NEON2 }} />}
                </div>
                <p className="text-xs font-mono" style={{ color: "#8A8AA4" }}>{camMode === "front" ? "Front camera preview" : "Back camera preview"}</p>
              </div>

              {/* REC badge */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: `1px solid ${PINK}40` }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: PINK, boxShadow: `0 0 8px ${PINK}` }} />
                  <span className="text-[11px] font-mono font-bold" style={{ color: PINK }}>REC {fmtSecs(recordSecs)}</span>
                </div>
              )}

              {/* Flip camera */}
              <button onClick={() => setCamMode(m => m === "front" ? "back" : "front")}
                className="absolute top-4 right-4 flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-mono font-bold transition-all hover:scale-105"
                style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", color: "#F0F0FF" }}>
                <RotateCcw size={12} /> Flip to {camMode === "front" ? "Back" : "Front"}
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-5">
              {!isRecording ? (
                <button onClick={() => setIsRecording(true)}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-full text-[13px] font-black transition-all hover:scale-105 active:scale-95"
                  style={{ background: PINK, color: "#fff", boxShadow: `0 0 30px ${PINK}40`, fontFamily: "Outfit, sans-serif" }}>
                  <span className="w-3 h-3 rounded-full bg-white" /> Start Recording
                </button>
              ) : (
                <button onClick={() => { setIsRecording(false); setStep("preview"); }}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-full text-[13px] font-black transition-all hover:scale-105 active:scale-95"
                  style={{ background: "#F0F0FF", color: "#000", fontFamily: "Outfit, sans-serif" }}>
                  <StopCircle size={17} /> Stop & Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step: Preview & publish */}
      {step === "preview" && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep("details")} className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all" style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)" }}><ChevronLeft size={15} /></button>
            <SectionLabel icon={Eye} text="Review Publish Setup" color={NEON} />
          </div>
          <div className="max-w-2xl p-6 rounded-2xl" style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-28 h-20 rounded-xl flex-none flex items-center justify-center" style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Film size={22} style={{ color: NEON }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-lg truncate" style={{ fontFamily: "Outfit, sans-serif" }}>{form.title || "Untitled Video"}</h3>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: "#8A8AA4" }}>{form.desc || "No description"}</p>
                <div className="flex gap-2 mt-2.5">
                  <Pill text={form.genre} />
                  <Pill text={form.level} color={NEON2} />
                  {form.price && <Pill text={form.price} color={GOLD} />}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl mb-6" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}>
              <IndianRupee size={14} style={{ color: GOLD }} />
              <p className="text-[12px] leading-relaxed" style={{ color: "#B0B0C0" }}>Groovly deducts <span className="font-bold" style={{ color: GOLD }}>₹30 per completed video sale</span>. Taxes, processing, and currency conversion are calculated securely and shown separately before settlement in {currency}.</p>
            </div>
            <button onClick={() => setStep("done")}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-[13px] font-black tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: `linear-gradient(90deg, ${NEON}, ${NEON2})`, color: "#000", boxShadow: `0 0 30px ${NEON}30`, fontFamily: "Outfit, sans-serif" }}>
              <CheckCircle size={15} /> Preview Publish
            </button>
          </div>
        </div>
      )}

      {/* Step: Done */}
      {step === "done" && (
        <div className="mb-12 max-w-2xl">
          <div className="p-10 rounded-3xl text-center" style={{ background: "#080810", border: `1px solid ${NEON}25`, boxShadow: `0 0 60px ${NEON}0A` }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: `${NEON}15`, border: `1px solid ${NEON}40`, boxShadow: `0 0 30px ${NEON}30` }}>
              <Check size={28} style={{ color: NEON }} />
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Publish Flow Preview Ready</h3>
            <p className="text-sm mb-7" style={{ color: "#8A8AA4" }}>No video was uploaded or published. "{form.title}" is ready for a future authenticated media, moderation, entitlement, and settlement backend.</p>
            <button onClick={() => { setStep("idle"); setForm({ title: "", genre: "Hip-Hop", level: "Beginner", desc: "", price: "", uploadType: "" }); }}
              className="px-6 py-3 rounded-xl text-[12px] font-black transition-all hover:scale-105"
              style={{ background: `${NEON}12`, border: `1px solid ${NEON}30`, color: NEON, fontFamily: "Outfit, sans-serif" }}>
              <Plus size={13} className="inline mr-1.5 -mt-0.5" />Reset Preview
            </button>
          </div>
        </div>
      )}

      {/* My videos */}
      <div>
        <SectionLabel icon={BarChart2} text="My Videos" count={`${teacherVideos.length}`} color={NEON2} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {teacherVideos.map(v => (
            <div key={v.id} className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1" style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="relative" style={{ aspectRatio: "16/10" }}>
                <img loading="lazy" decoding="async" src={v.thumb} alt={v.title} className="w-full h-full object-cover" style={{ opacity: v.status === "draft" ? 0.4 : 0.85 }} />
                <div className="absolute top-3 left-3">
                  {v.status === "published"
                    ? <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider" style={{ background: `${NEON}E6`, color: "#000" }}>Published</span>
                    : <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.12)", color: "#B0B0C0", backdropFilter: "blur(8px)" }}>Draft</span>}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-[14px] mb-2 truncate" style={{ fontFamily: "Outfit, sans-serif" }}>{v.title}</h4>
                <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: "#8A8AA4" }}>
                  <span className="flex items-center gap-1"><Eye size={11} /> {v.views}</span>
                  <span className="font-bold" style={{ color: v.earnings > 0 ? GOLD : "#8A8AA4" }}>{v.earnings > 0 ? fmt(v.earnings, v.earningsUSD, currency) : "—"}</span>
                  <span>{v.uploadedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Book Tab (Videographers) ─────────────────────────────────────────────────

function BookTab({ currency }: { currency: Currency }) {
  const [city, setCity] = useState("All Cities");
  const [booked, setBooked] = useState<number | null>(null);
  const cities = ["All Cities", ...Array.from(new Set(videographers.map(v => v.city)))];
  const list = city === "All Cities" ? videographers : videographers.filter(v => v.city === city);

  return (
    <div className="px-4 md:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: `${PINK}0C`, border: `1px solid ${PINK}20` }}>
          <Camera size={11} style={{ color: PINK }} />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: PINK }}>Book a Pro</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.02em" }}>
          Your Moves Deserve<br /><span style={{ background: `linear-gradient(90deg, ${PINK}, ${NEON2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>A Pro Behind the Lens.</span>
        </h1>
        <p className="text-[15px] max-w-xl" style={{ color: "#8A8AA4" }}>Vetted dance videographers across India. Portfolio-verified, artist-rated, and ready to shoot your next reel, class, or performance.</p>
      </div>

      {/* City filter */}
      <div className="flex gap-2.5 mb-8 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {cities.map(c => (
          <button key={c} onClick={() => setCity(c)}
            className="flex-none flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-mono font-bold transition-all"
            style={c === city
              ? { background: PINK, color: "#fff", boxShadow: `0 0 16px ${PINK}30` }
              : { background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)", color: "#8A8AA4" }}>
            {c !== "All Cities" && <MapPin size={10} />}{c}
          </button>
        ))}
      </div>

      {/* Videographer cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map(v => (
          <SpotlightCard key={v.id} color={`${PINK}14`} className="group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5" style={{ background: "#080810", border: "1px solid rgba(255,255,255,0.05)" }}>
            {/* Portfolio strip */}
            <div className="grid grid-cols-3 gap-0.5">
              {v.portfolio.map((p, i) => (
                <div key={i} className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <img loading="lazy" decoding="async" src={p} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" style={{ opacity: 0.8 }} />
                </div>
              ))}
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3.5 mb-4">
                <div className="relative flex-none">
                  <img loading="lazy" decoding="async" src={v.image} alt={v.name} className="w-14 h-14 rounded-2xl object-cover" style={{ border: `1px solid ${v.available ? NEON : "#8A8AA4"}30` }} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#080810]" style={{ background: v.available ? NEON : "#8A8AA4", boxShadow: v.available ? `0 0 8px ${NEON}` : "none" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-[15px] truncate" style={{ fontFamily: "Outfit, sans-serif" }}>{v.name}</h3>
                    <span className="flex-none px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider" style={{ background: v.badge === "Elite" ? `${GOLD}15` : v.badge === "Top Rated" ? `${NEON}12` : `${NEON2}12`, color: v.badge === "Elite" ? GOLD : v.badge === "Top Rated" ? NEON : NEON2, border: `1px solid ${v.badge === "Elite" ? GOLD : v.badge === "Top Rated" ? NEON : NEON2}25` }}>{v.badge}</span>
                  </div>
                  <p className="text-[11.5px] truncate mt-0.5" style={{ color: "#8A8AA4" }}>{v.specialty}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono" style={{ color: "#8A8AA4" }}>
                    <span className="flex items-center gap-1"><Star size={10} style={{ color: GOLD, fill: GOLD }} /> {v.rating}</span>
                    <span>{v.reviews} reviews</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {v.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "#8A8AA4" }}>Per session</p>
                  <p className="text-lg font-black" style={{ fontFamily: "Outfit, sans-serif", color: NEON }}>{fmt(v.priceINR, v.priceUSD, currency)}</p>
                </div>
                <button onClick={() => setBooked(v.id)} disabled={!v.available}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                  style={booked === v.id
                    ? { background: NEON, color: "#000", boxShadow: `0 0 20px ${NEON}40` }
                    : { background: `${PINK}12`, border: `1px solid ${PINK}30`, color: PINK }}>
                  {booked === v.id ? <><Check size={13} /> Requested!</> : v.available ? <><Briefcase size={13} /> Book Now</> : "Unavailable"}
                </button>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}

// ─── Groove AI Chat ───────────────────────────────────────────────────────────

function ChatWidget({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: aiAnswers.default, ts: "Now" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMsgs(m => [...m, { role: "user", text: t, ts }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { role: "ai", text: getAI(t), ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 900 + Math.random() * 400);
  };

  const quickPicks = ["Pricing plans", "Beginner classes", "Hip-Hop videos"];

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 w-[340px] rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "#080810", border: "1px solid rgba(0,255,178,0.12)", boxShadow: `0 0 60px rgba(0,255,178,0.06), 0 0 0 1px rgba(0,255,178,0.04), 0 24px 64px rgba(0,0,0,0.8)`, height: 520 }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(0,255,178,0.08)", background: "linear-gradient(135deg, rgba(0,255,178,0.04), rgba(108,99,255,0.04))" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(0,255,178,0.15), rgba(108,99,255,0.15))", border: `1px solid ${NEON}25` }}>
          <Sparkles size={17} style={{ color: NEON }} />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00FFB2]" style={{ boxShadow: "0 0 8px #00FFB2" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Groove AI</p>
          <p className="text-[10px] font-mono" style={{ color: NEON, opacity: 0.7 }}>● Always online</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "rgba(255,255,255,0.05)" }}>
          <X size={14} style={{ color: "#8A8AA4" }} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4" style={{ scrollbarWidth: "none" }}>
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "ai" && (
              <div className="w-7 h-7 rounded-lg flex-none flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${NEON}12`, border: `1px solid ${NEON}25` }}>
                <Sparkles size={11} style={{ color: NEON }} />
              </div>
            )}
            <div className={`flex flex-col gap-1 max-w-[82%] ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div className="px-3.5 py-2.5 text-[12.5px] leading-relaxed"
                style={m.role === "user"
                  ? { background: NEON, color: "#000", borderRadius: "18px 18px 4px 18px", fontWeight: 500 }
                  : { background: "#0E0E1A", color: "#F0F0FF", borderRadius: "18px 18px 18px 4px", border: "1px solid rgba(255,255,255,0.05)" }
                }>
                {m.text}
              </div>
              <span className="text-[9px] font-mono px-1" style={{ color: "#8A8AA4" }}>{m.ts}</span>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg flex-none flex items-center justify-center" style={{ background: `${NEON}12`, border: `1px solid ${NEON}25` }}>
              <Sparkles size={11} style={{ color: NEON }} />
            </div>
            <div className="px-4 py-3 rounded-[18px_18px_18px_4px]" style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: NEON, animationDelay: `${i * 0.12}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={end} />
      </div>

      {/* Quick picks */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {quickPicks.map(q => (
          <button key={q} onClick={() => send(q)}
            className="flex-none px-3 py-1.5 rounded-full text-[10px] font-mono font-semibold whitespace-nowrap transition-all hover:border-accent/50"
            style={{ background: "#0E0E1A", border: "1px solid rgba(0,255,178,0.12)", color: "#8A8AA4" }}>
            {q}
          </button>
        ))}
      </div>

      <div className="px-4 pb-3">
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Groovly%20support%20request`}
          className="min-h-10 w-full rounded-xl px-3 flex items-center gap-2.5 text-[11px] font-bold transition-all hover:-translate-y-0.5"
          style={{ background: `${NEON}0A`, border: `1px solid ${NEON}20`, color: "#D7D7E5" }}
        >
          <Mail size={14} style={{ color: NEON }} />
          <span>Human support</span>
          <span className="ml-auto font-mono text-[9px]" style={{ color: "#8A8AA4" }}>{SUPPORT_EMAIL}</span>
        </a>
      </div>

      {/* Input */}
      <div className="px-4 py-3.5 flex gap-2.5" style={{ borderTop: "1px solid rgba(0,255,178,0.08)" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask me anything..."
          className="flex-1 rounded-xl px-4 py-2.5 text-[12.5px] outline-none placeholder:text-muted-foreground transition-all"
          style={{ background: "#0E0E1A", border: `1px solid rgba(0,255,178,${input ? 0.2 : 0.06})`, color: "#F0F0FF" }}
        />
        <button onClick={() => send()}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-none transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: input.trim() ? NEON : "#0E0E1A", color: input.trim() ? "#000" : "#8A8AA4", boxShadow: input.trim() ? `0 0 16px ${NEON}50` : "none" }}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

const NAV: { id: Tab; label: string; icon: any; color: string }[] = [
  { id: "home", label: "Explore", icon: Home, color: NEON },
  { id: "learn", label: "Learn", icon: GraduationCap, color: NEON2 },
  { id: "earn", label: "Earn", icon: DollarSign, color: GOLD },
  { id: "book", label: "Book Pro", icon: Camera, color: PINK },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [regionKey, setRegionKey] = useState(readStoredDiscoveryRegionKey);
  const [currency, setCurrency] = useState<Currency>(() => getDiscoveryRegion(regionKey).countryCode === "IN" ? "INR" : "USD");
  const [locationOpen, setLocationOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [saved, setSaved] = useState(new Set([2, 5]));
  const [authView, setAuthView] = useState<AuthMode | null>(null);
  const [accountRole, setAccountRole] = useState<AccountRole | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");

  const region = getDiscoveryRegion(regionKey);
  const toggleSave = useCallback((id: number) => setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const openCheckout = useCallback((item: CheckoutItem) => { setCheckoutItem(item); setCheckoutStatus("idle"); }, []);
  const closeCheckout = useCallback(() => { setCheckoutItem(null); setCheckoutStatus("idle"); }, []);
  const openLocationPicker = useCallback(() => setLocationOpen(true), []);
  const closeLocationPicker = useCallback(() => setLocationOpen(false), []);
  const selectRegion = useCallback((nextRegion: DiscoveryRegion) => {
    setRegionKey(nextRegion.key);
    try { window.localStorage.setItem(DISCOVERY_STORAGE_KEY, nextRegion.key); } catch { /* The feed still updates for this session. */ }
    if (nextRegion.countryCode === "IN") setCurrency("INR");
    else if (nextRegion.countryCode !== "GLOBAL") setCurrency("USD");
    setLocationOpen(false);
  }, []);

  if (authView) {
    return <AuthPage initialMode={authView} onBack={() => setAuthView(null)} onAuthenticated={(role, mode) => { setAuthView(null); if (mode === "signup") { setAccountRole(role); setTab(role === "teacher" ? "earn" : "learn"); } }} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-0" style={{ fontFamily: "Manrope, sans-serif" }}>

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute aurora-blob" style={{ animationDuration: "18s", top: -200, left: -200, width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${NEON}06 0%, transparent 70%)` }} />
        <div className="absolute aurora-blob" style={{ animationDuration: "24s", animationDelay: "-6s", top: 300, right: -150, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${NEON2}07 0%, transparent 70%)` }} />
        <div className="absolute aurora-blob" style={{ animationDuration: "30s", animationDelay: "-12s", bottom: 100, left: "30%", width: 600, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}04 0%, transparent 70%)` }} />
      </div>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 h-[60px] flex items-center gap-3 px-4 md:px-8"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>

        {/* Logo */}
        <button onClick={() => setTab("home")} aria-label="Go to Groovly explore" className="flex items-center gap-2.5 flex-none">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#0A0A12", border: `1px solid ${NEON}35`, boxShadow: `0 0 20px ${NEON}25` }}>
            <Equalizer size={14} />
          </div>
          <span className="hidden sm:inline text-lg font-black tracking-[0.05em]" style={{ fontFamily: "Outfit, sans-serif", background: `linear-gradient(90deg, ${NEON}, ${NEON2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            GROOVLY
          </span>
        </button>

        {/* Desktop tab nav */}
        <nav className="hidden md:flex items-center gap-1.5 ml-8">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} aria-current={tab === n.id ? "page" : undefined}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all"
              style={tab === n.id
                ? { background: `${n.color}12`, border: `1px solid ${n.color}30`, color: n.color }
                : { border: "1px solid transparent", color: "#8A8AA4" }}>
              <n.icon size={13} /> {n.label}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Regional discovery */}
        <button onClick={openLocationPicker} aria-label={`Change location from ${region.label}`}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] font-mono font-bold transition-all hover:scale-105"
          style={{ background: `${NEON2}0D`, border: `1px solid ${NEON2}25`, color: "#B7B2FF" }}>
          <MapPin size={12} /><span className="hidden xl:inline max-w-24 truncate">{region.shortLabel}</span>
        </button>

        {/* Currency toggle */}
        <button onClick={() => setCurrency(c => c === "INR" ? "USD" : "INR")} aria-label={"Switch currency from " + currency}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-mono font-bold tracking-wider transition-all hover:scale-105"
          style={{ background: `${NEON}0D`, border: `1px solid ${NEON}25`, color: NEON }}>
          <Globe size={11} /> {currency}
        </button>

        <button
          onClick={() => setAuthView(accountRole ? "login" : "signup")}
          aria-label={accountRole ? `Open ${accountRole} account preview` : "Join Groovly"}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[12px] font-black transition-all hover:scale-[1.03]"
          style={{ background: NEON, color: "#000" }}
        >
          <User size={13} />
          <span className="hidden sm:inline">{accountRole ? `${accountRole === "teacher" ? "Teacher" : "Learner"} preview` : "Join now"}</span>
          <ArrowRight size={13} className="hidden md:block" />
        </button>
        {/* AI Button */}
        <button onClick={() => setChatOpen(o => !o)} aria-label={chatOpen ? "Close Groove AI" : "Open Groove AI"}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95"
          style={chatOpen
            ? { background: NEON, color: "#000", boxShadow: `0 0 20px ${NEON}50` }
            : { background: `${NEON}0D`, border: `1px solid ${NEON}25`, color: NEON }}>
          <Sparkles size={12} />
          <span className="hidden md:inline">Groove AI</span>
        </button>

      </header>

      {/* ── Active tab ── */}
      <main className="relative max-w-[1400px] mx-auto" style={{ zIndex: 1 }}>
        <div key={tab} className="tab-enter">
          {tab === "home" && <HomeTab currency={currency} saved={saved} toggleSave={toggleSave} onNavigate={setTab} onCheckout={openCheckout} region={region} onOpenLocation={openLocationPicker} />}
          {tab === "learn" && <LearnTab currency={currency} onCheckout={openCheckout} region={region} onOpenLocation={openLocationPicker} />}
          {tab === "earn" && <EarnTab currency={currency} onOpenAccount={() => setAuthView("signup")} />}
          {tab === "book" && <BookTab currency={currency} />}
        </div>
      </main>

      <footer className="relative z-[1] px-4 md:px-8 pb-10" aria-label="Groovly support">
        <div className="max-w-[1400px] mx-auto rounded-2xl px-5 py-5 md:px-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between"
          style={{ background: "linear-gradient(110deg, rgba(0,255,178,0.055), rgba(108,99,255,0.06))", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-none" style={{ background: `${NEON}12`, border: `1px solid ${NEON}28`, color: NEON }}>
              <Mail size={18} />
            </div>
            <div>
              <p className="text-sm font-black" style={{ fontFamily: "Outfit, sans-serif" }}>Need help from a human?</p>
              <p className="mt-1 text-xs" style={{ color: "#8A8AA4" }}>Account, class and payment support from the Groovly team.</p>
            </div>
          </div>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Groovly%20support%20request`}
            className="min-h-11 rounded-xl px-4 flex items-center justify-center gap-2 text-xs font-black transition-all hover:-translate-y-0.5"
            style={{ background: NEON, color: "#000", boxShadow: `0 0 24px ${NEON}1F` }}
          >
            <Mail size={14} /> {SUPPORT_EMAIL}
          </a>
        </div>
      </footer>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
        style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: "env(safe-area-inset-bottom)" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} aria-current={tab === n.id ? "page" : undefined} className="flex-1 min-h-14 flex flex-col items-center justify-center gap-1 py-2 transition-all">
            <n.icon size={19} style={{ color: tab === n.id ? n.color : "#3A3A4C", filter: tab === n.id ? `drop-shadow(0 0 6px ${n.color}80)` : "none" }} />
            <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: tab === n.id ? n.color : "#3A3A4C" }}>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* Location, chat and checkout overlays */}
      <LocationPicker open={locationOpen} selected={region} onClose={closeLocationPicker} onSelect={selectRegion} />
      {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}
      <CheckoutPreview open={Boolean(checkoutItem)} item={checkoutItem} currency={currency} countryCode={region.countryCode === "GLOBAL" ? (currency === "INR" ? "IN" : "US") : region.countryCode} status={checkoutStatus} paymentReference="GRV-DEMO-7J4K92" providerName="the connected payment provider" onClose={closeCheckout} onContinue={() => setCheckoutStatus("pending")} onCheckStatus={async () => { await new Promise<void>(resolve => window.setTimeout(resolve, 450)); setCheckoutStatus("paid"); }} />
    </div>
  );
}
