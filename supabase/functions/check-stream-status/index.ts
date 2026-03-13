import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { streamUrl } = await req.json();

    if (!streamUrl || typeof streamUrl !== "string") {
      return new Response(
        JSON.stringify({ error: "streamUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate URL format
    let url: URL;
    try {
      url = new URL(streamUrl);
    } catch {
      return new Response(
        JSON.stringify({ online: false, error: "Invalid URL" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try Shoutcast v2 stats endpoint (JSON)
    const statsUrl = `${url.protocol}//${url.host}/statistics?json=1`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(statsUrl, {
        signal: controller.signal,
        headers: { "User-Agent": "ZimRadio/1.0" },
      });
      clearTimeout(timeout);

      if (response.ok) {
        const text = await response.text();
        try {
          const stats = JSON.parse(text);
          // Shoutcast v2 stats format
          const stream = stats.streams?.[0] || stats;
          return new Response(
            JSON.stringify({
              online: true,
              listeners: stream.currentlisteners ?? stream.listeners ?? 0,
              peakListeners: stream.peaklisteners ?? 0,
              maxListeners: stream.maxlisteners ?? 0,
              title: stream.songtitle || stream.title || null,
              genre: stream.genre || null,
              bitrate: stream.bitrate || null,
              contentType: stream.content || null,
              serverType: "shoutcast",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch {
          // Not JSON, try Shoutcast v1
        }
      }
    } catch {
      clearTimeout(timeout);
    }

    // Try Shoutcast v1 stats (XML at /admin.cgi?sid=1)
    const v1StatsUrl = `${url.protocol}//${url.host}/7.html`;
    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), 6000);

    try {
      const response = await fetch(v1StatsUrl, {
        signal: controller2.signal,
        headers: { "User-Agent": "ZimRadio/1.0" },
      });
      clearTimeout(timeout2);

      if (response.ok) {
        const text = await response.text();
        // Shoutcast v1 7.html format: currentlisteners,status,peaklisteners,maxlisteners,uniquelisteners,bitrate,songtitle
        const match = text.match(/<body>(.+?)<\/body>/i);
        if (match) {
          const parts = match[1].split(",");
          if (parts.length >= 7) {
            return new Response(
              JSON.stringify({
                online: parts[1] === "1",
                listeners: parseInt(parts[0]) || 0,
                peakListeners: parseInt(parts[2]) || 0,
                maxListeners: parseInt(parts[3]) || 0,
                title: parts.slice(6).join(",") || null,
                bitrate: parseInt(parts[5]) || null,
                serverType: "shoutcast-v1",
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      }
    } catch {
      clearTimeout(timeout2);
    }

    // Fallback: try HEAD request on the stream URL directly
    const controller3 = new AbortController();
    const timeout3 = setTimeout(() => controller3.abort(), 6000);

    try {
      const response = await fetch(streamUrl, {
        method: "HEAD",
        signal: controller3.signal,
        headers: { "User-Agent": "ZimRadio/1.0" },
      });
      clearTimeout(timeout3);

      const contentType = response.headers.get("content-type") || "";
      const isAudio = contentType.includes("audio") || contentType.includes("mpeg") || contentType.includes("ogg");

      return new Response(
        JSON.stringify({
          online: response.ok && isAudio,
          listeners: null,
          serverType: "unknown",
          contentType,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch {
      clearTimeout(timeout3);
    }

    return new Response(
      JSON.stringify({ online: false, listeners: null, serverType: "unreachable" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
