import { useState, useEffect, useCallback } from "react";
import { Play, Radio, MapPin, ExternalLink, X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ntepeLogo from "@/assets/ntepe-manama-logo.png";

interface FeaturedStation {
  name: string;
  shortName: string;
  frequency: string;
  location: string;
  genre: string;
  subtitle: string;
  listenUrl: string;
  logo: string;
  accentHue: number; // for per-card glow color
}

const FEATURED_STATIONS: FeaturedStation[] = [
  {
    name: "Ntepe-Manama Community Radio 97.0",
    shortName: "Ntepe-Manama FM 97.0",
    frequency: "97.0 FM",
    location: "Gwanda",
    genre: "Community Radio",
    subtitle: "Live from Gwanda",
    listenUrl: "https://ntepemanamafm.listen2myshow.com",
    logo: ntepeLogo,
    accentHue: 25,
  },
  {
    name: "Star FM Zimbabwe",
    shortName: "Star FM",
    frequency: "89.7 FM",
    location: "Harare",
    genre: "Pop & Hits",
    subtitle: "Zimbabwe's #1 Hit Music Station",
    listenUrl: "https://stream.zeno.fm/star-fm42qk430nw98uv",
    logo: "/placeholder.svg",
    accentHue: 200,
  },
  {
    name: "Capitalk 100.4 FM",
    shortName: "Capitalk FM",
    frequency: "100.4 FM",
    location: "Harare",
    genre: "Business & Talk",
    subtitle: "Business radio for Zimbabwe",
    listenUrl: "https://stream.zeno.fm/capitalk-100-4fm-harare",
    logo: "/placeholder.svg",
    accentHue: 142,
  },
  {
    name: "Power FM Zimbabwe",
    shortName: "Power FM",
    frequency: "99.3 FM",
    location: "Harare",
    genre: "Urban",
    subtitle: "Power to the people",
    listenUrl: "https://stream.zeno.fm/power-fm-zimbabwe",
    logo: "/placeholder.svg",
    accentHue: 280,
  },
  {
    name: "Skyz Metro FM",
    shortName: "Skyz Metro FM",
    frequency: "100.3 FM",
    location: "Bulawayo",
    genre: "Hip Hop",
    subtitle: "Urban culture from Bulawayo",
    listenUrl: "https://stream.zeno.fm/skyzmetrofm-1003",
    logo: "/placeholder.svg",
    accentHue: 350,
  },
];

const AUTOPLAY_MS = 6000;

const FeaturedCarousel = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [modalStation, setModalStation] = useState<FeaturedStation | null>(null);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActiveIdx((i) => (i + 1) % FEATURED_STATIONS.length), []);
  const prev = useCallback(() => setActiveIdx((i) => (i - 1 + FEATURED_STATIONS.length) % FEATURED_STATIONS.length), []);

  // Auto-rotate
  useEffect(() => {
    if (paused || modalStation) return;
    const t = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, modalStation, next]);

  const station = FEATURED_STATIONS[activeIdx];
  const isFirst = activeIdx === 0; // Ntepe-Manama gets extra flair

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary uppercase tracking-wider">Featured Stations</span>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className={`relative rounded-2xl p-5 md:p-6 cursor-pointer overflow-hidden group ${
                isFirst
                  ? "border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/5"
                  : "border border-border bg-gradient-to-br from-card via-card to-secondary/30"
              }`}
              onClick={() => setModalStation(station)}
              style={{
                boxShadow: `0 0 30px hsla(${station.accentHue}, 80%, 50%, 0.15), 0 0 60px hsla(${station.accentHue}, 80%, 50%, 0.06)`,
              }}
            >
              {/* Glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 40px hsla(${station.accentHue}, 80%, 50%, 0.1)` }}
              />

              {/* Badges */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {isFirst && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                    <Star className="w-3 h-3" />
                    Featured
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                  LIVE
                </span>
              </div>

              <div className="flex items-center gap-5">
                {/* Logo */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-secondary"
                    style={{ boxShadow: `0 0 0 2px hsla(${station.accentHue}, 80%, 50%, 0.3)` }}
                  >
                    <img src={station.logo} alt={station.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg md:text-xl text-foreground truncate">
                    {station.shortName}
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: `hsl(${station.accentHue}, 80%, 55%)` }}>
                    {station.frequency}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Radio className="w-3 h-3" />
                      {station.genre}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {station.location}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 italic">{station.subtitle}</p>

                  {/* Listen Live CTA */}
                  <a
                    href={station.listenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 mt-3 px-5 py-2 rounded-full text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Play className="w-4 h-4" />
                    Listen Live
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {FEATURED_STATIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIdx ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {modalStation && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalStation(null)}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: `0 0 60px hsla(${modalStation.accentHue}, 80%, 50%, 0.2)` }}
            >
              <button onClick={() => setModalStation(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  LIVE NOW
                </span>
              </div>

              <div
                className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-secondary mb-4"
                style={{ boxShadow: `0 0 0 2px hsla(${modalStation.accentHue}, 80%, 50%, 0.3)` }}
              >
                <img src={modalStation.logo} alt={modalStation.name} className="w-full h-full object-cover" />
              </div>

              <h2 className="font-display font-bold text-xl text-foreground">{modalStation.name}</h2>
              <p className="font-semibold mt-1" style={{ color: `hsl(${modalStation.accentHue}, 80%, 55%)` }}>
                {modalStation.frequency}
              </p>
              <div className="flex justify-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{modalStation.location}</span>
                <span className="flex items-center gap-1"><Radio className="w-3.5 h-3.5" />{modalStation.genre}</span>
              </div>

              <a
                href={modalStation.listenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 mt-6 px-8 py-3.5 rounded-full text-base font-bold text-primary-foreground hover:scale-105 active:scale-95 transition-transform w-full"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}
              >
                <Play className="w-5 h-5" />
                Listen Live
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>

              <button
                onClick={() => setModalStation(null)}
                className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeaturedCarousel;
