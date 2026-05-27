# TaskFlow Frontend

React SPA built with Vite. See the [project root README](../Readme.md) for full documentation, installation steps, and Vercel deployment guide.

## Quick Start (local dev)

```bash
npm install
npm run dev
```

## Deploy to Vercel

Set the **Root Directory** to `frontend` in your Vercel project settings, then add the environment variable:

```
VITE_API_URL = https://your-backend-url.com
```

> `vercel.json` is included — it handles React Router SPA routing so direct URL access and page refresh work correctly on Vercel.
