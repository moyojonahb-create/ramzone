import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StationSettings from "@/components/dashboard/StationSettings";
import AnalyticsPanel from "@/components/dashboard/AnalyticsPanel";
import SubscriptionPanel from "@/components/dashboard/SubscriptionPanel";
import { Loader2 } from "lucide-react";

export interface Station {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  frequency: string | null;
  genre: string;
  location: string;
  description: string | null;
  stream_url: string | null;
  is_live: boolean;
  is_approved: boolean;
  listeners_count: number;
}

export interface Subscription {
  id: string;
  plan: "starter" | "professional" | "enterprise";
  status: "active" | "expired" | "cancelled" | "pending";
  max_listeners: number;
  price_usd: number;
  started_at: string | null;
  expires_at: string | null;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [station, setStation] = useState<Station | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStation, setHasStation] = useState<boolean | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchStation();
    }
  }, [user]);

  const fetchStation = async () => {
    if (!user) return;
    
    try {
      const { data: stationData, error: stationError } = await supabase
        .from("radio_stations")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (stationError) throw stationError;

      if (stationData) {
        setStation(stationData as Station);
        setHasStation(true);

        // Fetch subscription
        const { data: subData, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("station_id", stationData.id)
          .maybeSingle();

        if (subError && subError.code !== "PGRST116") throw subError;
        if (subData) {
          setSubscription(subData as Subscription);
        }
      } else {
        setHasStation(false);
      }
    } catch (error) {
      console.error("Error fetching station:", error);
      toast({
        title: "Error",
        description: "Failed to load station data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStationUpdate = (updatedStation: Station) => {
    setStation(updatedStation);
  };

  const handleStationCreated = (newStation: Station) => {
    setStation(newStation);
    setHasStation(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader station={station} />
        
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "settings" && (
            <StationSettings
              station={station}
              hasStation={hasStation}
              onStationUpdate={handleStationUpdate}
              onStationCreated={handleStationCreated}
            />
          )}
          {activeTab === "analytics" && (
            <AnalyticsPanel station={station} />
          )}
          {activeTab === "subscription" && (
            <SubscriptionPanel station={station} subscription={subscription} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
