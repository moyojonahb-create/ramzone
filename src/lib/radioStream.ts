const configuredProxyBase = (import.meta.env.VITE_RADIO_PROXY_URL || "").trim().replace(/\/+$/, "");

export const RADIO_STREAM_URL = configuredProxyBase
  ? `${configuredProxyBase}/api/radio-stream`
  : "/api/radio-stream";
