import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RadioStation } from "@/types/radio";

export const useStations = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      const { data, error } = await supabase
        .from("radio_stations")
        .select("*")
        .eq("is_approved", true)
        .order("listeners_count", { ascending: false });

      if (error) {
        console.error("Error fetching stations:", error);
        setLoading(false);
        return;
      }

      const mapped: RadioStation[] = (data || []).map((s) => ({
        id: s.id,
        name: s.name,
        logo: s.logo_url || "/placeholder.svg",
        frequency: s.frequency || undefined,
        genre: s.genre,
        location: s.location,
        streamUrl: "/api/radio-stream",
        isLive: s.is_live,
        listeners: s.listeners_count,
        description: s.description || "",
      }));

      setStations(mapped);
      setLoading(false);
    };

    fetchStations();
  }, []);

  return { stations, loading };
};
