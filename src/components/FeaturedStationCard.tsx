import { useState } from "react";
import { Play, Pause, Radio, MapPin, ExternalLink, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ntepeLogo from "@/assets/ntepe-manama-logo.png";

const STATION = {
  name: "Ntepe-Manama Community Radio 97.0",
  shortName: "Ntepe-Manama FM 97.0",
  frequency: "97.0 FM",
  location: "Gwanda",
  genre: "Community Radio",
  subtitle: "Live from Gwanda",
  listenUrl: "https://ntepemanamafm.listen2myshow.com",
  logo: ntepeLogo,
};

const FeaturedStationCard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="relative rounded-2xl p-5 border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 cursor-pointer overflow-hidden group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setModalOpen(true)}
        style={{
          boxShadow: "0 0 30px hsla(25, 95%, 53%, 0.15), 0 0 60px hsla(0, 100%, 50%, 0.08)",
        }}
      >
        {/* Glow overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 40px hsla(25, 95%, 53%, 0.1)" }} />

        {/* Badges row */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
            <Star className="w-3 h-3" />
            Featured
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-5">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-secondary ring-2 ring-primary/30">
              <img src={STATION.logo} alt={STATION.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-lg md:text-xl text-foreground truncate">
              {STATION.shortName}
            </h3>
            <p className="text-sm text-primary font-semibold">{STATION.frequency}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-3 h-3" />
                {STATION.genre}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {STATION.location}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 italic">{STATION.subtitle}</p>

            {/* Listen Live CTA */}
            <a
              href={STATION.listenUrl}
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

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: "0 0 60px hsla(25, 95%, 53%, 0.2)" }}
            >
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>

              {/* Live badge */}
              <div className="flex justify-center mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  LIVE NOW
                </span>
              </div>

              {/* Large logo */}
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-secondary ring-2 ring-primary/30 mb-4">
                <img src={STATION.logo} alt={STATION.name} className="w-full h-full object-cover" />
              </div>

              <h2 className="font-display font-bold text-xl text-foreground">{STATION.name}</h2>
              <p className="text-primary font-semibold mt-1">{STATION.frequency}</p>
              <div className="flex justify-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{STATION.location}</span>
                <span className="flex items-center gap-1"><Radio className="w-3.5 h-3.5" />{STATION.genre}</span>
              </div>

              {/* Listen Live button */}
              <a
                href={STATION.listenUrl}
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
                onClick={() => setModalOpen(false)}
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

export default FeaturedStationCard;
