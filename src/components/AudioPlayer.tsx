import { RadioStation } from "@/types/radio";
import { Play, Pause, Volume2, VolumeX, X, Radio } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  station: RadioStation | null;
  onClose: () => void;
}

const AudioPlayer = ({ station, onClose }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (station && audioRef.current) {
      // In a real app, this would play the actual stream
      setIsPlaying(true);
    }
  }, [station]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!station) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 md:h-24 gap-4">
            {/* Station Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                <img
                  src={station.logo}
                  alt={station.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-display font-semibold text-foreground truncate">
                  {station.name}
                </h4>
                <div className="flex items-center gap-2">
                  {station.isLive && (
                    <span className="flex items-center gap-1 text-xs text-live font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-live live-pulse" />
                      LIVE
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">{station.genre}</span>
                </div>
              </div>
            </div>

            {/* Equalizer Visualization */}
            <div className="hidden md:flex items-center gap-1 px-4">
              {isPlaying &&
                [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full equalizer-bar"
                    style={{ height: "4px" }}
                  />
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full gradient-primary flex items-center justify-center glow-primary hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                ) : (
                  <Play className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground ml-1" />
                )}
              </button>

              {/* Volume */}
              <div className="hidden md:flex items-center gap-3">
                <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(val) => {
                    setVolume(val[0]);
                    setIsMuted(false);
                  }}
                  max={100}
                  step={1}
                  className="w-24"
                />
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Hidden audio element for actual streaming */}
        <audio ref={audioRef} src={station.streamUrl} />
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioPlayer;