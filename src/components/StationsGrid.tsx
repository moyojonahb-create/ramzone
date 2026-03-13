import { useState } from "react";
import { RadioStation } from "@/types/radio";
import RadioCard from "./RadioCard";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface StationsGridProps {
  stations: RadioStation[];
  currentStation: RadioStation | null;
  onStationSelect: (station: RadioStation) => void;
  loading?: boolean;
}

const StationsGrid = ({ stations, currentStation, onStationSelect }: StationsGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const genres = Array.from(new Set(stations.map((s) => s.genre)));

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || station.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <section id="stations" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tune Into Zimbabwe's
            <span className="text-gradient"> Best Stations</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and listen to over 50 radio stations across Zimbabwe. From news to music, gospel to urban beats.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border focus:border-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !selectedGenre
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {genres.slice(0, 5).map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedGenre === genre
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStations.map((station) => (
            <RadioCard
              key={station.id}
              station={station}
              isPlaying={currentStation?.id === station.id}
              onPlay={() => onStationSelect(station)}
            />
          ))}
        </div>

        {filteredStations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No stations found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StationsGrid;