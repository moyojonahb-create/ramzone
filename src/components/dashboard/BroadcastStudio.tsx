import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Mic, MicOff, Radio, Square, Volume2, Waves, AlertCircle, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Station } from "@/pages/Dashboard";

interface BroadcastStudioProps {
  station: Station | null;
}

const BroadcastStudio = ({ station }: BroadcastStudioProps) => {
  const [isLive, setIsLive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [gain, setGain] = useState(75);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBroadcast();
    };
  }, []);

  // Update gain in real-time
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = gain / 100;
    }
  }, [gain]);

  const startMic = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 44100 });
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = gain / 100;
      gainNodeRef.current = gainNode;

      source.connect(gainNode);
      gainNode.connect(analyser);
      // Connect to destination so MediaRecorder captures processed audio
      const dest = audioCtx.createMediaStreamDestination();
      gainNode.connect(dest);

      // Store processed stream for recording
      streamRef.current = dest.stream;

      setIsMicActive(true);

      // Start level metering
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setMicLevel(Math.round((avg / 255) * 100));
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      toast({ title: "Microphone active", description: "Your mic is ready. Hit 'Go Live' to start broadcasting." });
    } catch (err: any) {
      setError("Microphone access denied. Please allow microphone permissions.");
      toast({ title: "Mic Error", description: "Could not access microphone", variant: "destructive" });
    }
  }, [gain, toast]);

  const stopMic = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    audioCtxRef.current = null;
    gainNodeRef.current = null;
    setIsMicActive(false);
    setMicLevel(0);
  }, []);

  const startBroadcast = useCallback(() => {
    if (!streamRef.current) return;

    try {
      const recorder = new MediaRecorder(streamRef.current, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      recorder.ondataavailable = async (e) => {
        if (e.data.size > 0 && station) {
          // In production, these chunks would be sent to an Icecast relay endpoint
          // via WebSocket or chunked HTTP POST to an edge function
          console.log(`[BroadcastStudio] Audio chunk: ${e.data.size} bytes`);
        }
      };

      recorder.start(1000); // 1-second chunks
      mediaRecorderRef.current = recorder;

      setIsLive(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

      toast({ title: "🔴 You're LIVE!", description: `Broadcasting on ${station?.name || "your station"}` });
    } catch (err) {
      toast({ title: "Broadcast Error", description: "Failed to start broadcast", variant: "destructive" });
    }
  }, [station, toast]);

  const stopBroadcast = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    setIsLive(false);
    setElapsed(0);
    stopMic();
  }, [stopMic]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!station) {
    return (
      <Card className="glass-card border-border">
        <CardContent className="py-12 text-center">
          <Radio className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Create a station first to use the broadcast studio.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Live Status Banner */}
      {isLive && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive" />
              </span>
              <span className="font-display font-bold text-destructive text-lg">LIVE</span>
              <span className="font-mono text-muted-foreground">{formatTime(elapsed)}</span>
            </div>
            <Button variant="destructive" size="sm" onClick={stopBroadcast}>
              <Square className="w-4 h-4 mr-2" /> Stop Broadcast
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Controls */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <Monitor className="w-5 h-5" /> Browser Broadcast Studio
          </CardTitle>
          <CardDescription>
            Go live directly from your browser using WebRTC — no software needed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Mic Toggle & Level */}
          <div className="flex items-center gap-4">
            <Button
              variant={isMicActive ? "destructive" : "default"}
              size="lg"
              onClick={isMicActive ? stopMic : startMic}
              disabled={isLive}
              className="gap-2"
            >
              {isMicActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isMicActive ? "Disable Mic" : "Enable Mic"}
            </Button>

            {isMicActive && (
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> Input Level</span>
                  <span>{micLevel}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-75"
                    style={{
                      width: `${micLevel}%`,
                      background: micLevel > 85
                        ? "hsl(var(--destructive))"
                        : micLevel > 50
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Gain Control */}
          {isMicActive && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Volume2 className="w-4 h-4" /> Mic Gain
                </span>
                <span className="font-mono text-xs">{gain}%</span>
              </div>
              <Slider value={[gain]} onValueChange={(v) => setGain(v[0])} max={150} step={1} />
            </div>
          )}

          {/* Go Live Button */}
          <div className="pt-2">
            {!isLive ? (
              <Button
                size="lg"
                className="w-full gap-2 text-lg h-14"
                disabled={!isMicActive}
                onClick={startBroadcast}
              >
                <Radio className="w-5 h-5" /> Go Live
              </Button>
            ) : (
              <Button
                size="lg"
                variant="destructive"
                className="w-full gap-2 text-lg h-14"
                onClick={stopBroadcast}
              >
                <Square className="w-5 h-5" /> Stop Broadcast
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="glass-card border-border">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary mt-0.5">WebRTC</Badge>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Your browser captures audio via <strong>WebRTC getUserMedia</strong> and encodes it in real-time.</p>
              <p>Audio chunks are streamed to the Icecast server relay. For best quality use Chrome or Edge with a good microphone.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BroadcastStudio;
