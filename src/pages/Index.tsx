import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StationsGrid from "@/components/StationsGrid";
import PricingSection from "@/components/PricingSection";
import BroadcasterSection from "@/components/BroadcasterSection";
import CustomAppSection from "@/components/CustomAppSection";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "@/components/Footer";
import { useStations } from "@/hooks/useStations";
import { RadioStation } from "@/types/radio";

const Index = () => {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const { stations, loading } = useStations();

  const handleStationSelect = (station: RadioStation) => {
    setCurrentStation(station);
  };

  const handleClosePlayer = () => {
    setCurrentStation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StationsGrid
        stations={stations}
        currentStation={currentStation}
        onStationSelect={handleStationSelect}
        loading={loading}
      />
      <BroadcasterSection />
      <PricingSection />
      <CustomAppSection />
      <Footer />
      
      {/* Audio Player - shows when a station is selected */}
      <AudioPlayer station={currentStation} onClose={handleClosePlayer} />
      
      {/* Spacer for fixed player */}
      {currentStation && <div className="h-24" />}
    </div>
  );
};

export default Index;
