import { useState, useEffect } from "react";
import { Station } from "@/pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Save, Radio, MapPin, Music } from "lucide-react";
import StreamUrlField from "./StreamUrlField";

interface StationSettingsProps {
  station: Station | null;
  hasStation: boolean | null;
  onStationUpdate: (station: Station) => void;
  onStationCreated: (station: Station) => void;
}

const StationSettings = ({ station, hasStation, onStationUpdate, onStationCreated }: StationSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    frequency: "",
    genre: "",
    location: "",
    description: "",
    stream_url: "",
  });

  const { user } = useAuth();
  const { toast } = useToast();

  // Update form data when station changes
  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name || "",
        frequency: station.frequency || "",
        genre: station.genre || "",
        location: station.location || "",
        description: station.description || "",
        stream_url: station.stream_url || "",
      });
    }
  }, [station]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !station) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${station.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("station-logos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("station-logos")
        .getPublicUrl(fileName);

      const { data: updatedStation, error: updateError } = await supabase
        .from("radio_stations")
        .update({ logo_url: publicUrl })
        .eq("id", station.id)
        .select()
        .single();

      if (updateError) throw updateError;

      onStationUpdate(updatedStation as Station);
      toast({
        title: "Logo updated",
        description: "Your station logo has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      if (station) {
        // Update existing station
        const { data, error } = await supabase
          .from("radio_stations")
          .update({
            name: formData.name,
            frequency: formData.frequency,
            genre: formData.genre,
            location: formData.location,
            description: formData.description,
            stream_url: formData.stream_url,
          })
          .eq("id", station.id)
          .select()
          .single();

        if (error) throw error;

        onStationUpdate(data as Station);
        toast({
          title: "Settings saved",
          description: "Your station settings have been updated.",
        });
      } else {
        // Create new station
        const slug = generateSlug(formData.name);
        
        const { data, error } = await supabase
          .from("radio_stations")
          .insert({
            owner_id: user.id,
            name: formData.name,
            slug,
            frequency: formData.frequency,
            genre: formData.genre,
            location: formData.location,
            description: formData.description,
            stream_url: formData.stream_url,
          })
          .select()
          .single();

        if (error) throw error;

        // Auto-provision stream credentials
        try {
          const { data: provisionData, error: provisionError } = await supabase.functions.invoke("provision-station", {
            body: { stationId: data.id, stationName: formData.name },
          });
          
          if (provisionError) {
            console.error("Provisioning error:", provisionError);
            toast({
              title: "Station created",
              description: "Station created but stream provisioning failed. You can retry from the Streaming tab.",
              variant: "default",
            });
          } else {
            // Merge provisioned credentials into station data
            const provisionedStation = {
              ...data,
              ...provisionData.credentials,
            };
            onStationCreated(provisionedStation as Station);
            toast({
              title: "Station created & provisioned! 🎉",
              description: "Your stream credentials are ready in the Streaming tab.",
            });
            return;
          }
        } catch (provErr) {
          console.error("Provision call failed:", provErr);
        }

        // Create default subscription
        await supabase.from("subscriptions").insert({
          station_id: data.id,
          plan: "starter",
          status: "pending",
        });

        onStationCreated(data as Station);
        toast({
          title: "Station created",
          description: "Your radio station has been created successfully!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasStation === false) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Radio className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="font-display text-2xl">Create Your Radio Station</CardTitle>
            <CardDescription>
              Set up your station to start broadcasting on ZimRadio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Station Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Star FM"
                    className="bg-secondary border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    placeholder="98.5 FM"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre *</Label>
                  <Input
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    placeholder="Pop, Gospel, News..."
                    className="bg-secondary border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Harare"
                    className="bg-secondary border-border"
                    required
                  />
                </div>
              </div>

              <StreamUrlField
                value={formData.stream_url}
                onChange={handleInputChange}
              />

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell listeners about your station..."
                  className="bg-secondary border-border min-h-[100px]"
                />
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Station...
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4 mr-2" />
                    Create Station
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Logo Upload Card */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl">Station Logo</CardTitle>
          <CardDescription>Upload your station's logo (recommended: 400x400px)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-secondary flex items-center justify-center">
              {station?.logo_url ? (
                <img
                  src={station.logo_url}
                  alt={station.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Radio className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("logo-upload")?.click()}
                disabled={isUploading || !station}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Logo
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station Details Card */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl">Station Details</CardTitle>
          <CardDescription>Manage your station information and stream settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Radio className="w-4 h-4" /> Station Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre" className="flex items-center gap-2">
                  <Music className="w-4 h-4" /> Genre
                </Label>
                <Input
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                  required
                />
              </div>
            </div>

            <StreamUrlField
              value={formData.stream_url}
              onChange={handleInputChange}
            />

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell listeners about your station..."
                className="bg-secondary border-border min-h-[100px]"
              />
            </div>

            <Button type="submit" className="gradient-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StationSettings;
