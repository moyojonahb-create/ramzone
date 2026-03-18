import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eye, EyeOff, Radio, Server, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StreamCredentialsProps {
  host: string | null;
  port: number | null;
  password: string | null;
  mountPoint: string | null;
  streamUrl: string | null;
}

const StreamCredentials = ({ host, port, password, mountPoint, streamUrl }: StreamCredentialsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  if (!host || !port) {
    return (
      <Card className="glass-card border-border">
        <CardContent className="py-8 text-center">
          <Wifi className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Stream credentials will appear here after provisioning.</p>
        </CardContent>
      </Card>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const fields = [
    { label: "Server / Host", value: host, icon: Server },
    { label: "Port", value: String(port), icon: Wifi },
    { label: "Mount Point", value: mountPoint || "/stream", icon: Radio },
    { label: "Stream URL (Listener)", value: streamUrl || `http://${host}:${port}${mountPoint}`, icon: Wifi },
  ];

  return (
    <Card className="glass-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <Server className="w-5 h-5" /> Stream Credentials
            </CardTitle>
            <CardDescription>Use these in RadioBoss, BUTT, or any Icecast-compatible encoder</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">Trial Server</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map(({ label, value, icon: Icon }) => (
          <div key={label} className="space-y-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Icon className="w-3 h-3" /> {label}
            </Label>
            <div className="flex gap-2">
              <Input value={value} readOnly className="bg-secondary border-border font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(value, label)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Password field with toggle */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Password</Label>
          <div className="flex gap-2">
            <Input
              value={showPassword ? (password || "") : "••••••••••••"}
              readOnly
              className="bg-secondary border-border font-mono text-sm"
              type={showPassword ? "text" : "password"}
            />
            <Button variant="outline" size="icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => copyToClipboard(password || "", "Password")}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-secondary/50 p-4 mt-4">
          <h4 className="font-medium text-sm mb-2">📻 Quick Setup for RadioBoss</h4>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Open RadioBoss → Settings → Broadcast</li>
            <li>Select "SHOUTcast v2" as the server type</li>
            <li>Enter the Server, Port, and Password from above</li>
            <li>Set the Mount Point to <code className="bg-background px-1 rounded">{mountPoint || "/stream"}</code></li>
            <li>Click "Start" to begin broadcasting!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamCredentials;
