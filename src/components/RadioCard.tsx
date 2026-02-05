import { RadioStation } from "@/types/radio";
import { Play, Pause, Radio, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RadioCardProps {
  station: RadioStation;
  isPlaying: boolean;
  onPlay: () => void;
}

const RadioCard = ({ station, isPlaying, onPlay }: RadioCardProps) => {
  return (
    <motion.div
      className="group relative gradient-card rounded-2xl p-4 border border-border hover:border-primary/50 transition-all duration-300 hover-lift cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onPlay}
    >
      {/* Live Indicator */}
      {station.isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-live/20 text-live text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-live live-pulse" />
          LIVE
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Station Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
            <img
              src={station.logo}
              alt={station.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Play overlay */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm transition-opacity duration-200",
            isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            <button className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center glow-primary">
              {isPlaying ? (
                <Pause className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Station Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate">
            {station.name}
          </h3>
          {station.frequency && (
            <p className="text-sm text-primary font-medium">{station.frequency}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {station.genre}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Radio className="w-3 h-3" />
              {station.location}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            {station.listeners.toLocaleString()} listening
          </div>
        </div>
      </div>

      {/* Playing indicator */}
      {isPlaying && (
        <div className="flex items-center gap-0.5 mt-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full equalizer-bar"
              style={{ height: "4px" }}
            />
          ))}
          <span className="text-xs text-primary ml-2 font-medium">Now Playing</span>
        </div>
      )}
    </motion.div>
  );
};

export default RadioCard;