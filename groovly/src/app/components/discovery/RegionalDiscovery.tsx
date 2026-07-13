import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Check,
  Globe2,
  LocateFixed,
  LoaderCircle,
  MapPin,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";

const NEON = "#00FFB2";
const VIOLET = "#6C63FF";
const PINK = "#FF2D55";

export const DISCOVERY_STORAGE_KEY = "groovly.discovery.region";

export type DiscoveryRegion = {
  key: string;
  label: string;
  shortLabel: string;
  area?: string;
  country: string;
  countryCode: string;
  scope: "global" | "country" | "city";
  coordinates?: { latitude: number; longitude: number };
};

export const DISCOVERY_REGIONS: DiscoveryRegion[] = [
  { key: "global", label: "Everywhere", shortLabel: "Global", country: "Worldwide", countryCode: "GLOBAL", scope: "global" },
  { key: "india", label: "India", shortLabel: "India", country: "India", countryCode: "IN", scope: "country" },
  { key: "bhubaneswar", label: "Bhubaneswar", shortLabel: "Bhubaneswar", area: "Odisha", country: "India", countryCode: "IN", scope: "city", coordinates: { latitude: 20.2961, longitude: 85.8245 } },
  { key: "bengaluru", label: "Bengaluru", shortLabel: "Bengaluru", area: "Karnataka", country: "India", countryCode: "IN", scope: "city", coordinates: { latitude: 12.9716, longitude: 77.5946 } },
  { key: "mumbai", label: "Mumbai", shortLabel: "Mumbai", area: "Maharashtra", country: "India", countryCode: "IN", scope: "city", coordinates: { latitude: 19.076, longitude: 72.8777 } },
  { key: "delhi", label: "Delhi NCR", shortLabel: "Delhi NCR", country: "India", countryCode: "IN", scope: "city", coordinates: { latitude: 28.6139, longitude: 77.209 } },
  { key: "kolkata", label: "Kolkata", shortLabel: "Kolkata", area: "West Bengal", country: "India", countryCode: "IN", scope: "city", coordinates: { latitude: 22.5726, longitude: 88.3639 } },
  { key: "chennai", label: "Chennai", shortLabel: "Chennai", area: "Tamil Nadu", country: "India", countryCode: "IN", scope: "city", coordinates: { latitude: 13.0827, longitude: 80.2707 } },
  { key: "hyderabad", label: "Hyderabad", shortLabel: "Hyderabad", area: "Telangana", country: "India", countryCode: "IN", scope: "city", coordinates: { latitude: 17.385, longitude: 78.4867 } },
  { key: "pune", label: "Pune", shortLabel: "Pune", area: "Maharashtra", country: "India", countryCode: "IN", scope: "city", coordinates: { latitude: 18.5204, longitude: 73.8567 } },
  { key: "dubai", label: "Dubai", shortLabel: "Dubai", country: "United Arab Emirates", countryCode: "AE", scope: "city", coordinates: { latitude: 25.2048, longitude: 55.2708 } },
  { key: "london", label: "London", shortLabel: "London", country: "United Kingdom", countryCode: "GB", scope: "city", coordinates: { latitude: 51.5072, longitude: -0.1276 } },
  { key: "new-york", label: "New York", shortLabel: "New York", country: "United States", countryCode: "US", scope: "city", coordinates: { latitude: 40.7128, longitude: -74.006 } },
  { key: "los-angeles", label: "Los Angeles", shortLabel: "Los Angeles", country: "United States", countryCode: "US", scope: "city", coordinates: { latitude: 34.0522, longitude: -118.2437 } },
  { key: "singapore", label: "Singapore", shortLabel: "Singapore", country: "Singapore", countryCode: "SG", scope: "city", coordinates: { latitude: 1.3521, longitude: 103.8198 } },
  { key: "toronto", label: "Toronto", shortLabel: "Toronto", country: "Canada", countryCode: "CA", scope: "city", coordinates: { latitude: 43.6532, longitude: -79.3832 } },
  { key: "sydney", label: "Sydney", shortLabel: "Sydney", country: "Australia", countryCode: "AU", scope: "city", coordinates: { latitude: -33.8688, longitude: 151.2093 } },
  { key: "tokyo", label: "Tokyo", shortLabel: "Tokyo", country: "Japan", countryCode: "JP", scope: "city", coordinates: { latitude: 35.6762, longitude: 139.6503 } },
];

const regionByKey = new Map(DISCOVERY_REGIONS.map(region => [region.key, region]));

export function getDiscoveryRegion(key?: string | null) {
  return regionByKey.get(key || "") || regionByKey.get("india")!;
}

export function readStoredDiscoveryRegionKey() {
  if (typeof window === "undefined") return "india";
  try {
    const key = window.localStorage.getItem(DISCOVERY_STORAGE_KEY);
    return regionByKey.has(key || "") ? key! : "india";
  } catch {
    return "india";
  }
}

export function rankByRegion<T extends { regionKey: string }>(items: readonly T[], selected: DiscoveryRegion): T[] {
  if (selected.scope === "global") return [...items];

  const score = (item: T) => {
    const itemRegion = getDiscoveryRegion(item.regionKey);
    if (itemRegion.key === selected.key) return 4;
    if (itemRegion.countryCode === selected.countryCode) return selected.scope === "country" ? 3 : 2;
    return itemRegion.scope === "global" ? 1 : 0;
  };

  return items
    .map((item, index) => ({ item, index, score: score(item) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(entry => entry.item);
}

export function getRegionMatchLabel(itemRegionKey: string, selected: DiscoveryRegion) {
  const itemRegion = getDiscoveryRegion(itemRegionKey);
  if (selected.scope === "city" && itemRegion.key === selected.key) return "Near you";
  if (selected.scope !== "global" && itemRegion.countryCode === selected.countryCode) return `In ${selected.country}`;
  return "Global pick";
}

function haversineDistance(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
) {
  const radians = (degrees: number) => degrees * (Math.PI / 180);
  const earthRadiusKm = 6371;
  const latitudeDelta = radians(latitudeB - latitudeA);
  const longitudeDelta = radians(longitudeB - longitudeA);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(latitudeA)) * Math.cos(radians(latitudeB)) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestSupportedRegion(latitude: number, longitude: number) {
  const cities = DISCOVERY_REGIONS.filter(region => region.scope === "city" && region.coordinates);
  const nearest = cities
    .map(region => ({
      region,
      distance: haversineDistance(
        latitude,
        longitude,
        region.coordinates!.latitude,
        region.coordinates!.longitude,
      ),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  return nearest && nearest.distance <= 1200 ? nearest.region : getDiscoveryRegion("global");
}

type LocationPickerProps = {
  open: boolean;
  selected: DiscoveryRegion;
  onClose: () => void;
  onSelect: (region: DiscoveryRegion) => void;
};

export function LocationPicker({ open, selected, onClose, onSelect }: LocationPickerProps) {
  const [query, setQuery] = useState("");
  const [locationState, setLocationState] = useState<"idle" | "locating" | "error">("idle");
  const [locationMessage, setLocationMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setQuery("");
    setLocationState("idle");
    setLocationMessage("");
    window.requestAnimationFrame(() => searchRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose, open]);

  const visibleRegions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return DISCOVERY_REGIONS;
    return DISCOVERY_REGIONS.filter(region =>
      [region.label, region.area, region.country].filter(Boolean).some(value => value!.toLowerCase().includes(normalized)),
    );
  }, [query]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationState("error");
      setLocationMessage("Location is unavailable in this browser. Choose a city below instead.");
      return;
    }

    setLocationState("locating");
    setLocationMessage("Finding the closest Groovly region…");
    navigator.geolocation.getCurrentPosition(
      position => {
        const match = nearestSupportedRegion(position.coords.latitude, position.coords.longitude);
        onSelect(match);
      },
      () => {
        setLocationState("error");
        setLocationMessage("We couldn’t access your location. Search for a city or continue with your current region.");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    );
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-5"
      style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(14px)" }}
      onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-picker-title"
        className="w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px]"
        style={{ background: "linear-gradient(145deg, #10101D, #07070E 62%)", border: "1px solid rgba(255,255,255,0.11)", boxShadow: "0 30px 120px rgba(0,0,0,0.72)" }}
      >
        <div className="sticky top-0 z-10 px-5 sm:px-7 pt-5 sm:pt-7 pb-4" style={{ background: "linear-gradient(180deg, #10101D 78%, transparent)" }}>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-none" style={{ background: `${NEON}12`, border: `1px solid ${NEON}30`, color: NEON }}>
              <MapPin size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase font-bold mb-1" style={{ color: NEON }}>Regional discovery</p>
              <h2 id="location-picker-title" className="text-2xl sm:text-3xl font-black" style={{ fontFamily: "Outfit, sans-serif" }}>Where are you learning from?</h2>
              <p className="text-xs sm:text-sm mt-1.5 leading-relaxed" style={{ color: "#A8A8BC" }}>We’ll put teachers, classes and videos from your region first.</p>
            </div>
            <button onClick={onClose} aria-label="Close location picker" className="w-10 h-10 rounded-xl flex items-center justify-center flex-none hover:scale-105 transition-transform" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-7">
          <button
            onClick={useCurrentLocation}
            disabled={locationState === "locating"}
            className="w-full min-h-14 px-4 rounded-2xl flex items-center gap-3 text-left transition-all hover:-translate-y-0.5 disabled:opacity-70"
            style={{ background: `linear-gradient(90deg, ${NEON}12, ${VIOLET}12)`, border: `1px solid ${NEON}2E` }}
          >
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-none" style={{ background: `${NEON}18`, color: NEON }}>
              {locationState === "locating" ? <LoaderCircle size={17} className="animate-spin" /> : <LocateFixed size={17} />}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-black">Use my current location</span>
              <span className="block text-[11px] mt-0.5" style={{ color: "#9292A8" }}>Matches you to the nearest supported city</span>
            </span>
            <ArrowRight size={15} style={{ color: NEON }} />
          </button>

          {locationMessage && (
            <p role="status" className="mt-3 text-xs leading-relaxed" style={{ color: locationState === "error" ? "#FF9BAD" : "#B8B8CC" }}>{locationMessage}</p>
          )}

          <div className="relative mt-5">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#77778E" }} />
            <label htmlFor="region-search" className="sr-only">Search city or country</label>
            <input
              ref={searchRef}
              id="region-search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search city or country"
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-transparent outline-none text-sm placeholder:text-[#66667C] focus:border-[#00FFB2]"
              style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.09)" }}
            />
          </div>

          <div className="flex items-center justify-between mt-6 mb-3">
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase font-bold" style={{ color: "#85859B" }}>Choose a region</p>
            <span className="text-[10px]" style={{ color: "#66667C" }}>{visibleRegions.length} available</span>
          </div>

          {visibleRegions.length ? (
            <div className="grid sm:grid-cols-2 gap-2.5">
              {visibleRegions.map(region => {
                const active = region.key === selected.key;
                const Icon = region.scope === "city" ? MapPin : Globe2;
                const subtitle = region.scope === "global"
                  ? "Worldwide recommendations"
                  : [region.area, region.country !== region.label ? region.country : undefined].filter(Boolean).join(", ") || "Countrywide recommendations";
                return (
                  <button
                    key={region.key}
                    onClick={() => onSelect(region)}
                    aria-pressed={active}
                    className="min-h-[64px] px-4 py-3 rounded-2xl flex items-center gap-3 text-left transition-all hover:-translate-y-0.5"
                    style={active
                      ? { background: `${NEON}12`, border: `1px solid ${NEON}45`, boxShadow: `0 0 24px ${NEON}0C` }
                      : { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-none" style={{ background: active ? `${NEON}18` : "rgba(255,255,255,0.045)", color: active ? NEON : "#9999AE" }}>
                      <Icon size={16} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold truncate">{region.label}</span>
                      <span className="block text-[10px] mt-0.5 truncate" style={{ color: "#7F7F95" }}>{subtitle}</span>
                    </span>
                    {active && <Check size={15} style={{ color: NEON }} />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-7 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <MapPin size={20} className="mx-auto mb-2" style={{ color: "#77778E" }} />
              <p className="text-sm font-bold">That region isn’t listed yet.</p>
              <p className="text-xs mt-1" style={{ color: "#85859B" }}>Choose Everywhere for the global feed.</p>
            </div>
          )}

          <div className="mt-5 p-4 rounded-2xl flex items-start gap-3" style={{ background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.18)" }}>
            <ShieldCheck size={17} className="flex-none mt-0.5" style={{ color: "#AAA5FF" }} />
            <p className="text-[11px] leading-relaxed" style={{ color: "#9999AE" }}>
              <strong style={{ color: "#D7D5FF" }}>Privacy first.</strong> Precise coordinates stay in your browser and are discarded after city matching. Groovly saves only your selected region on this device.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type RegionalVideo = {
  id: number;
  title: string;
  instructor: string;
  image: string;
  duration: string;
  views: string;
  genre: string;
  regionKey: string;
};

const regionalTeachers = [
  { id: 1, name: "Divya Sharma", style: "Kathak · Classical Fusion", rating: 4.9, learners: "7.9K", regionKey: "bhubaneswar", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=420&h=520&fit=crop&auto=format&q=80" },
  { id: 2, name: "Arya Kapoor", style: "Contemporary · Flow", rating: 4.9, learners: "5.4K", regionKey: "bengaluru", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=420&h=520&fit=crop&auto=format&q=80" },
  { id: 3, name: "Priya Nair", style: "Bollywood · Fusion", rating: 4.8, learners: "21K", regionKey: "mumbai", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=420&h=520&fit=crop&auto=format&q=80" },
  { id: 4, name: "Urban Flex", style: "Breaking · Street", rating: 4.8, learners: "8.1K", regionKey: "delhi", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=420&h=520&fit=crop&auto=format&q=80" },
  { id: 5, name: "Meera Iyer", style: "Bharatanatyam · Fusion", rating: 4.8, learners: "6.2K", regionKey: "chennai", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=420&h=520&fit=crop&auto=format&q=80" },
  { id: 6, name: "Sofia Reyes", style: "Zumba · Dance Fitness", rating: 4.9, learners: "12.6K", regionKey: "dubai", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=420&h=520&fit=crop&auto=format&q=80" },
  { id: 7, name: "Princess K", style: "Waacking · Commercial", rating: 4.7, learners: "3.8K", regionKey: "london", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=420&h=520&fit=crop&auto=format&q=80" },
  { id: 8, name: "Kayla Johnson", style: "Hip-Hop · Choreography", rating: 4.9, learners: "14.8K", regionKey: "new-york", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=420&h=520&fit=crop&auto=format&q=80" },
  { id: 9, name: "Maria Cruz", style: "Salsa · Bachata", rating: 4.8, learners: "11.2K", regionKey: "singapore", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=420&h=520&fit=crop&auto=format&q=80" },
];

type RegionalSpotlightProps = {
  region: DiscoveryRegion;
  videos: readonly RegionalVideo[];
  onChangeLocation: () => void;
  onExplore: () => void;
};

export function RegionalSpotlight({ region, videos, onChangeLocation, onExplore }: RegionalSpotlightProps) {
  const teachers = rankByRegion(regionalTeachers, region).slice(0, 3);
  const regionalVideos = rankByRegion(videos, region).slice(0, 2);
  const heading = region.scope === "city"
    ? `Popular near ${region.shortLabel}`
    : region.scope === "country"
      ? `Popular across ${region.country}`
      : "Popular around the world";

  return (
    <section className="px-4 md:px-8 mb-16" aria-labelledby="regional-discovery-heading">
      <div className="relative overflow-hidden rounded-[30px] p-5 sm:p-7 lg:p-8" style={{ background: "linear-gradient(135deg, rgba(0,255,178,0.075), rgba(8,8,16,0.97) 42%, rgba(108,99,255,0.11))", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 26px 90px rgba(0,0,0,0.25)" }}>
        <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(108,99,255,0.12)" }} aria-hidden />
        <div className="absolute -bottom-28 left-[20%] w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0,255,178,0.07)" }} aria-hidden />

        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" style={{ background: `${NEON}0D`, border: `1px solid ${NEON}26` }}>
              <Sparkles size={11} style={{ color: NEON }} />
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase font-bold" style={{ color: NEON }}>Made for your region</span>
            </div>
            <h2 id="regional-discovery-heading" className="text-3xl md:text-4xl font-black" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.025em" }}>{heading}</h2>
            <p className="text-sm mt-2 max-w-2xl leading-relaxed" style={{ color: "#9D9DB2" }}>Local matches appear first, followed by standout teachers and lessons from your country and the global Groovly community.</p>
          </div>
          <button onClick={onChangeLocation} className="min-h-11 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-black flex-none transition-all hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.1)", color: "#E3E3EC" }}>
            <MapPin size={14} style={{ color: NEON }} /> {region.shortLabel} <span style={{ color: "#77778E" }}>·</span> Change
          </button>
        </div>

        <div className="relative grid xl:grid-cols-[1.2fr_0.8fr] gap-7">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase font-bold">Teachers for you</p>
              <button onClick={onExplore} className="text-[11px] font-bold flex items-center gap-1" style={{ color: NEON }}>Explore classes <ArrowRight size={12} /></button>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {teachers.map((teacher, index) => {
                const teacherRegion = getDiscoveryRegion(teacher.regionKey);
                return (
                  <article key={teacher.id} className="group relative min-h-[244px] rounded-2xl overflow-hidden" style={{ background: "#0A0A12", border: index === 0 ? `1px solid ${NEON}35` : "1px solid rgba(255,255,255,0.07)" }}>
                    <img loading="lazy" decoding="async" src={teacher.image} alt={teacher.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,10,0.98) 8%, rgba(5,5,10,0.45) 64%, rgba(5,5,10,0.08))" }} />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold" style={{ background: index === 0 ? "rgba(0,255,178,0.16)" : "rgba(0,0,0,0.58)", border: index === 0 ? `1px solid ${NEON}38` : "1px solid rgba(255,255,255,0.1)", color: index === 0 ? NEON : "#D7D7E2", backdropFilter: "blur(10px)" }}>
                      {getRegionMatchLabel(teacher.regionKey, region)}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-center gap-1 text-[10px] mb-1.5" style={{ color: "#C8C8D7" }}><MapPin size={10} style={{ color: NEON }} />{teacherRegion.shortLabel}</div>
                      <h3 className="font-black text-lg leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>{teacher.name}</h3>
                      <p className="text-[11px] mt-1" style={{ color: "#A8A8BC" }}>{teacher.style}</p>
                      <div className="flex items-center gap-3 mt-3 text-[10px]" style={{ color: "#C8C8D7" }}>
                        <span className="flex items-center gap-1"><Star size={10} fill="#FFB800" stroke="none" />{teacher.rating}</span>
                        <span className="flex items-center gap-1"><Users size={10} />{teacher.learners}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase font-bold">Videos trending nearby</p>
              <span className="text-[10px]" style={{ color: "#77778E" }}>Location-ranked</span>
            </div>
            <div className="space-y-3">
              {regionalVideos.map((video, index) => {
                const videoRegion = getDiscoveryRegion(video.regionKey);
                return (
                  <button key={video.id} onClick={onExplore} className="group w-full min-h-[115px] p-3 rounded-2xl flex gap-4 text-left transition-all hover:-translate-y-0.5" style={{ background: index === 0 ? "rgba(108,99,255,0.1)" : "rgba(255,255,255,0.025)", border: index === 0 ? `1px solid ${VIOLET}35` : "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="relative w-28 sm:w-36 min-h-[90px] rounded-xl overflow-hidden flex-none">
                      <img loading="lazy" decoding="async" src={video.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.25)" }}>
                        <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: NEON, color: "#000", boxShadow: `0 0 22px ${NEON}55` }}><Play size={14} fill="#000" className="ml-0.5" /></span>
                      </span>
                      <span className="absolute right-1.5 bottom-1.5 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold" style={{ background: "rgba(0,0,0,0.75)" }}>{video.duration}</span>
                    </span>
                    <span className="flex-1 min-w-0 py-1">
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wide" style={{ color: index === 0 ? "#AAA5FF" : "#8F8FA5" }}><MapPin size={9} />{videoRegion.shortLabel}</span>
                      <span className="block text-sm font-black leading-snug mt-2 group-hover:text-[#00FFB2] transition-colors" style={{ fontFamily: "Outfit, sans-serif" }}>{video.title}</span>
                      <span className="block text-[10px] mt-1" style={{ color: "#8F8FA5" }}>{video.instructor} · {video.views} views</span>
                      <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold" style={{ background: `${PINK}10`, color: "#FF829A", border: `1px solid ${PINK}22` }}>{video.genre}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-6 pt-4 flex items-center gap-2 text-[10px]" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#747489" }}>
          <ShieldCheck size={12} style={{ color: NEON }} /> Your feed uses only the region saved on this device—not your precise location.
        </div>
      </div>
    </section>
  );
}
