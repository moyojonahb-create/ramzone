import { useEffect, useRef, useState } from "react";

const LiveRadioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlaying = () => {
      setIsPlaying(true);
      setIsConnecting(false);
      setError(null);
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsConnecting(false);
    };

    const onWaiting = () => {
      if (!audio.paused) {
        setIsConnecting(true);
      }
    };

    const onCanPlay = () => {
      setIsConnecting(false);
    };

    const onError = () => {
      setIsPlaying(false);
      setIsConnecting(false);
      setError("Stream is offline or temporarily unavailable.");
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    setError(null);
    setIsConnecting(true);

    try {
      // Refresh connection before starting a live stream
      audio.pause();
      audio.src = "";
      audio.load();
      audio.src = "/api/radio-stream";
      audio.load();
      await audio.play();
    } catch (err) {
      setIsConnecting(false);
      setIsPlaying(false);

      const playError = err as DOMException | Error;
      if (playError?.name === "NotAllowedError") {
        setError("Playback was blocked by the browser. Tap Play again.");
      } else if (playError?.name === "NotSupportedError") {
        setError("Stream format was rejected by the browser. Please retry.");
      } else {
        setError("Playback failed to start live stream. Please tap Play again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <audio ref={audioRef} src="/api/radio-stream" preload="none" playsInline />

      <button
        type="button"
        onClick={togglePlayPause}
        className="px-6 py-3 rounded-full gradient-primary text-primary-foreground font-semibold min-w-36"
      >
        {isPlaying ? "Pause" : isConnecting ? "Connecting..." : "Play"}
      </button>

      {isPlaying && (
        <span className="inline-flex items-center gap-2 text-sm text-live font-medium">
          <span className="w-2 h-2 rounded-full bg-live live-pulse" />
          Listening Live
        </span>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default LiveRadioPlayer;
