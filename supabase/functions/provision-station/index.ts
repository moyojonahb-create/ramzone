import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { stationId, stationName } = await req.json();

    if (!stationId || !stationName) {
      throw new Error("stationId and stationName are required");
    }

    // TODO: Replace with real AzuraCast API call
    // const azuraResponse = await fetch(`${AZURACAST_URL}/api/admin/stations`, {
    //   method: "POST",
    //   headers: { "X-API-Key": AZURACAST_API_KEY, "Content-Type": "application/json" },
    //   body: JSON.stringify({ name: stationName, ... })
    // });

    // Mock AzuraCast provisioning response
    const port = 8000 + Math.floor(Math.random() * 2000);
    const password = generatePassword(16);
    const mountPoint = `/${stationName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const azuracastStationId = Math.floor(Math.random() * 10000) + 1;

    const credentials = {
      shoutcast_host: "stream.ramzone.lovable.app", // Fake host for trial
      shoutcast_port: port,
      shoutcast_password: password,
      mount_point: mountPoint,
      azuracast_station_id: azuracastStationId,
      stream_url: `http://stream.ramzone.lovable.app:${port}${mountPoint}`,
    };

    // Update the station with provisioned credentials
    const { error: updateError } = await supabase
      .from("radio_stations")
      .update({
        shoutcast_host: credentials.shoutcast_host,
        shoutcast_port: credentials.shoutcast_port,
        shoutcast_password: credentials.shoutcast_password,
        mount_point: credentials.mount_point,
        azuracast_station_id: credentials.azuracast_station_id,
        stream_url: credentials.stream_url,
      })
      .eq("id", stationId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, credentials }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generatePassword(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let result = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}
