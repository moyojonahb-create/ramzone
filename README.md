# RamZone Radio (with live stream proxy)

This project now includes a backend radio proxy endpoint so the app can play the Ntepe-Manama FM stream directly inside the app without redirecting to external pages.

## Implemented live radio feature

### Backend (Express)

- Endpoint: `GET /api/radio-stream`
- Upstream source (backend-only): `https://ntepemanamafm.listen2myshow.com/`
- Response content type: `audio/mpeg`
- Streaming behavior: **piped** from upstream response body (not buffered in memory)
- CORS header: `Access-Control-Allow-Origin: *`

### Frontend (React)

- New component: `src/components/LiveRadioPlayer.tsx`
- Uses native `<audio src="/api/radio-stream" />`
- Single button toggle with state text:
  - `Play`
  - `Connecting...`
  - `Pause`
- Shows `Listening Live` indicator while audio is playing
- Displays error message when stream is unavailable/offline

## Local run instructions

### 1) Install dependencies

```bash
npm install
```

### 2) Run backend proxy server

```bash
npm run server
```

Backend starts on `http://localhost:3001`.

### 3) Run frontend (second terminal)

```bash
npm run dev
```

Frontend runs on `http://localhost:8080`.

Vite is configured to proxy `/api/*` requests to `http://localhost:3001`, so frontend audio requests to `/api/radio-stream` go to the backend stream proxy.

## Notes for production

- Deploy frontend and backend behind HTTPS.
- Keep `/api/radio-stream` on your own domain so browsers/mobile apps fetch secure audio from your app endpoint.
- The upstream Listen2MyRadio URL stays hidden from the client.
