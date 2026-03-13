import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface StreamUrlFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type StreamStatus = "idle" | "checking" | "valid" | "invalid";

const SHOUTCAST_URL_PATTERN = /^https?:\/\/.+:\d+(\/.*)?$/;

const StreamUrlField = ({ value, onChange }: StreamUrlFieldProps) => {
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [streamInfo, setStreamInfo] = useState<string | null>(null);

  const isValidFormat = !value || SHOUTCAST_URL_PATTERN.test(value);

  const testStream = async () => {
    if (!value) return;
    setStatus("checking");
    setStreamInfo(null);

    try {
      const { data, error } = await supabase.functions.invoke("check-stream-status", {
        body: { streamUrl: value },
      });

      if (error) throw error;

      if (data?.online) {
        setStatus("valid");
        const info = [];
        if (data.listeners !== null) info.push(`${data.listeners} listeners`);
        if (data.bitrate) info.push(`${data.bitrate}kbps`);
        if (data.title) info.push(data.title);
        setStreamInfo(info.join(" · ") || "Stream is online");
      } else {
        setStatus("invalid");
        setStreamInfo(null);
      }
    } catch {
      setStatus("invalid");
    }

    setTimeout(() => { setStatus("idle"); setStreamInfo(null); }, 8000);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="stream_url" className="flex items-center gap-2">
        <Link className="w-4 h-4" /> Shoutcast Stream URL
      </Label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            id="stream_url"
            name="stream_url"
            value={value}
            onChange={onChange}
            placeholder="http://your-server:8000/stream"
            className={`bg-secondary border-border ${!isValidFormat ? "border-destructive" : ""}`}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={testStream}
          disabled={!value || !isValidFormat || status === "checking"}
          className="whitespace-nowrap"
        >
          {status === "checking" ? (
            <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Testing</>
          ) : status === "valid" ? (
            <><CheckCircle className="w-3 h-3 mr-1 text-live" /> Online</>
          ) : status === "invalid" ? (
            <><XCircle className="w-3 h-3 mr-1 text-destructive" /> Offline</>
          ) : (
            "Test Stream"
          )}
        </Button>
      </div>
      {!isValidFormat && value && (
        <p className="text-xs text-destructive">
          Enter a valid Shoutcast URL (e.g. http://your-server:8000/stream)
        </p>
      )}
      {streamInfo && status === "valid" && (
        <p className="text-xs text-live">{streamInfo}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-1">
        <Badge variant="secondary" className="text-xs">Shoutcast v2</Badge>
        <Badge variant="secondary" className="text-xs">MP3 / AAC</Badge>
        <Badge variant="secondary" className="text-xs">RadioBoss Compatible</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Enter your Shoutcast server URL. Compatible with RadioBoss, SAM Broadcaster, and any Shoutcast-compatible encoder.
      </p>
    </div>
  );
};

export default StreamUrlField;
