import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Send, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Station } from "@/pages/Dashboard";

interface CustomAppPanelProps {
  station: Station | null;
}

interface AppRequest {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  requirements: string | null;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending Review", icon: Clock, className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  in_progress: { label: "In Progress", icon: Loader2, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-green-500/10 text-green-500 border-green-500/20" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const CustomAppPanel = ({ station }: CustomAppPanelProps) => {
  const [requests, setRequests] = useState<AppRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    requirements: "",
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (station) fetchRequests();
  }, [station]);

  const fetchRequests = async () => {
    if (!station) return;
    const { data, error } = await supabase
      .from("custom_app_requests")
      .select("*")
      .eq("station_id", station.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching app requests:", error);
    } else {
      setRequests(data as AppRequest[]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!station) return;

    const name = formData.contact_name.trim();
    const email = formData.contact_email.trim();
    const requirements = formData.requirements.trim();

    if (!name || !email) {
      toast({ title: "Missing fields", description: "Name and email are required.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("custom_app_requests").insert({
      station_id: station.id,
      contact_name: name,
      contact_email: email,
      contact_phone: formData.contact_phone.trim() || null,
      requirements: requirements || null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request submitted! 🎉", description: "We'll review your custom app request and get back to you." });
      setFormData({ contact_name: "", contact_email: "", contact_phone: "", requirements: "" });
      setShowForm(false);
      fetchRequests();
    }
    setSubmitting(false);
  };

  if (!station) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card border-border">
          <CardContent className="py-12 text-center">
            <Smartphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Create a station first to request a custom app.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-primary" /> Custom Branded App
          </h2>
          <p className="text-muted-foreground mt-1">
            Request a personalized mobile app for your radio station
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gradient-primary text-primary-foreground">
            <Send className="w-4 h-4 mr-2" /> New Request
          </Button>
        )}
      </div>

      {/* Request Form */}
      {showForm && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="font-display text-lg">Request Custom App for "{station.name}"</CardTitle>
            <CardDescription>
              Fill in your details and we'll build a branded mobile app for your station.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Contact Name *</Label>
                  <Input
                    id="contact_name"
                    placeholder="Your full name"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    maxLength={255}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone Number (optional)</Label>
                <Input
                  id="contact_phone"
                  placeholder="+263 77 123 4567"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">App Requirements & Features</Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe what you'd like in your app — colors, features, branding preferences, etc."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  maxLength={2000}
                  rows={4}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting} className="gradient-primary text-primary-foreground">
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Submit Request
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing Requests */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 && !showForm ? (
        <Card className="glass-card border-border">
          <CardContent className="py-12 text-center">
            <Smartphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">No App Requests Yet</h3>
            <p className="text-muted-foreground mb-6">
              Submit a request and our team will build a custom branded mobile app for your station.
            </p>
            <Button onClick={() => setShowForm(true)} className="gradient-primary text-primary-foreground">
              <Send className="w-4 h-4 mr-2" /> Request Custom App
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-foreground">Your Requests</h3>
          {requests.map((req) => {
            const status = statusConfig[req.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <Card key={req.id} className="glass-card border-border">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{req.contact_name}</p>
                      <p className="text-sm text-muted-foreground">{req.contact_email}</p>
                      {req.requirements && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{req.requirements}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className={status.className}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomAppPanel;
