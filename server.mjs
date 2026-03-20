import express from "express";
import http from "node:http";
import https from "node:https";
import { PassThrough } from "node:stream";

const app = express();
const PORT = process.env.PORT || 3001;
const STREAM_URLS = [
  "https://fpsnew1.listen2myradio.com:2199/listen.php?ip=82.145.63.6&port=10424&type=s1",
  "http://82.145.63.6:10424/stream",
];

const stripIcyPreface = () => {
  let initialized = false;
  let buffer = Buffer.alloc(0);
  const pass = new PassThrough();

  return {
    writable: new PassThrough({
      transform(chunk, _enc, callback) {
        callback(null, chunk);
      },
    }),
    output: pass,
    processChunk(chunk) {
      if (initialized) {
        pass.write(chunk);
        return;
      }

      buffer = Buffer.concat([buffer, chunk]);
      const textStart = buffer.slice(0, 4).toString("utf8");

      if (textStart !== "ICY ") {
        initialized = true;
        pass.write(buffer);
        buffer = Buffer.alloc(0);
        return;
      }

      const separatorIndex = buffer.indexOf("\r\n\r\n");
      if (separatorIndex === -1) {
        return;
      }

      const audioStart = separatorIndex + 4;
      initialized = true;
      pass.write(buffer.slice(audioStart));
      buffer = Buffer.alloc(0);
    },
    end() {
      if (!initialized && buffer.length) {
        pass.write(buffer);
      }
      pass.end();
    },
  };
};

const connectStream = (url) => {
  const client = url.startsWith("https") ? https : http;

  return client.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Icy-MetaData": "1",
      Accept: "audio/mpeg,*/*;q=0.8",
      Connection: "keep-alive",
    },
  });
};

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  next();
});

app.options("/api/radio-stream", (_, res) => {
  res.status(204).end();
});

app.get("/api/radio-stream", (req, res) => {
  let upstreamRequest;
  let upstreamStream;
  let settled = false;

  const closeUpstream = () => {
    if (upstreamStream) upstreamStream.destroy();
    if (upstreamRequest) upstreamRequest.destroy();
  };

  req.on("close", closeUpstream);
  res.on("close", closeUpstream);

  const tryUrl = (index) => {
    if (index >= STREAM_URLS.length) {
      if (!res.headersSent) {
        res.status(502).send("Stream unavailable");
      }
      return;
    }

    const url = STREAM_URLS[index];
    upstreamRequest = connectStream(url);

    upstreamRequest.on("response", (stream) => {
      upstreamStream = stream;

      if (stream.statusCode !== 200) {
        console.error("Stream error:", url, stream.statusCode);
        stream.resume();
        tryUrl(index + 1);
        return;
      }

      settled = true;
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Accept-Ranges", "none");
      res.setHeader("X-Content-Type-Options", "nosniff");

      const icyStripper = stripIcyPreface();

      stream.on("data", (chunk) => {
        icyStripper.processChunk(chunk);
      });

      stream.on("end", () => {
        icyStripper.end();
      });

      stream.on("error", (err) => {
        console.error("Stream error:", err.message);
        if (!res.headersSent) {
          res.status(502).send("Stream unavailable");
        } else {
          res.end();
        }
      });

      icyStripper.output.pipe(res);
    });

    upstreamRequest.on("error", (err) => {
      console.error("Request error:", url, err.message);
      if (settled) {
        if (!res.headersSent) {
          res.status(502).send("Failed to connect to stream");
        } else {
          res.end();
        }
        return;
      }
      tryUrl(index + 1);
    });
  };

  tryUrl(0);
});

app.listen(PORT, () => {
  console.log(`Radio proxy server running on http://localhost:${PORT}`);
});
