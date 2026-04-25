# CanWearProject Fixed

This fixed ZIP separates the real production apps:

- `client/` = Vite React frontend for Netlify
- `server/` = Express PayPal backend for Render

The unrelated root Next.js template was removed because it conflicted with the Vite app deployment.

## Local setup

### Client

```powershell
cd client
copy .env.example .env
npm install
npm run dev
```

### Server

```powershell
cd server
copy .env.example .env
npm install
npm run dev
```

Client: http://localhost:5173
Server health: http://localhost:8080/api/health

## Netlify

Base directory: `client`
Build command: `npm run build`
Publish directory: `client/dist`

## Render

Root directory: `server`
Build command: `npm install`
Start command: `npm start`
Health check path: `/api/health`
