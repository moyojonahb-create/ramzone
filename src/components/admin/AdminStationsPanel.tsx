import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, CheckCircle, XCircle, Radio } from "lucide-react";

interface StationRow {
  id: string;
  name: string;
  slug: string;
  genre: string;
  location: string;
  frequency: string | null;
  is_live: boolean;
  is_approved: boolean;
  listeners_count: number;
  stream_url: string | null;
  created_at: string;
}

const AdminStationsPanel = () => {
  const [stations, setStations] = useState<StationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStations = async () => {
    const { data, error } = await supabase
      .from("radio_stations")
      .select("id, name, slug, genre, location, frequency, is_live, is_approved, listeners_count, stream_url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setStations(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStations(); }, []);

  const toggleField = async (id: string, field: "is_approved" | "is_live", value: boolean) => {
    const { error } = await supabase
      .from("radio_stations")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setStations((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
      toast({ title: "Updated", description: `Station ${field === "is_approved" ? (value ? "approved" : "unapproved") : (value ? "set live" : "set offline")}` });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">All Stations</h2>
          <p className="text-muted-foreground text-sm">{stations.length} stations registered</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Freq</TableHead>
                <TableHead>Listeners</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Live</TableHead>
                <TableHead>Stream</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{s.genre}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.location}</TableCell>
                  <TableCell className="text-muted-foreground">{s.frequency || "—"}</TableCell>
                  <TableCell>{s.listeners_count}</TableCell>
                  <TableCell>
                    <Switch
                      checked={s.is_approved}
                      onCheckedChange={(v) => toggleField(s.id, "is_approved", v)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={s.is_live}
                      onCheckedChange={(v) => toggleField(s.id, "is_live", v)}
                    />
                  </TableCell>
                  <TableCell>
                    {s.stream_url ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStationsPanel;
