# TaskFlow — React Task Manager SPA

A modern, premium **React Single-Page Application** that consumes a REST API to manage tasks via full **CRUD** (Create, Read, Update, Delete) operations.

> ⚡ **Live demo deployable to Vercel (frontend) + Render/Railway (backend).**

---

## ✨ Features

| Feature | Details |
|---|---|
| 📋 Task Dashboard | Grid layout with live search & status filters (All / Pending / Completed) |
| ➕ Create Tasks | Form with inline validation (title 3–50 chars, description 5–200 chars) |
| ✏️ Edit Tasks | Pre-filled form populated from the API, updates via PUT |
| 🗑️ Delete Tasks | Confirmation prompt before deletion, optimistic UI rollback on failure |
| ✅ Toggle Completion | One-click checkbox update with instant optimistic UI update |
| 📊 Analytics Page | SVG circular gauge, completion rate bar, motivational insight messages |
| 🌙 Light / Dark Mode | Theme toggle persisted to `localStorage` |
| ⚠️ Error Handling | Dismissable error banners with rollback on failed API calls |
| 🔄 Loading States | Smooth animated spinner on all async operations |

---

## 🛠️ Tech Stack

**Frontend** · React 19 · React Router DOM v7 · Axios · Vanilla CSS (Glassmorphism)  
**Backend** · Node.js · Express.js · Mongoose · MongoDB  
**Dev** · Vite 8 · mongodb-memory-server (no local MongoDB required)

---

## 📦 Installation & Running

### Backend

```bash
cd backend
npm install
node index.mjs
```

Runs on `http://localhost:3000`. If no local MongoDB is detected, it auto-starts `mongodb-memory-server`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🚀 Deploying to Vercel (Frontend)

### Step 1 — Push to GitHub

Ensure your repo is on GitHub. Both `frontend/` and `backend/` folders should be committed.

### Step 2 — Deploy the Backend First

Deploy the **backend** to a service like [Render](https://render.com) or [Railway](https://railway.app).  
Copy the live base URL it gives you (e.g. `https://your-api.onrender.com`).

### Step 3 — Deploy the Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite** (auto-detected).
4. Under **Environment Variables**, add:
   ```
   VITE_API_URL = https://your-api.onrender.com
   ```
5. Click **Deploy**. Done! ✅

> **Why `VITE_API_URL`?** Vite exposes only variables prefixed with `VITE_` to the browser bundle. The app falls back to `http://localhost:3000` when the variable is not set (local dev).

> **Why `vercel.json`?** React Router uses the browser History API. Without the rewrite rule in `vercel.json`, refreshing any page other than `/` returns a 404. The rewrite rule directs all paths back to `index.html` so React Router handles them.

---

## 📂 Project Structure

```
INTERNSPARK_TASK2/
 ┣ backend/
 ┃ ┣ src/
 ┃ ┃ ┣ mongoose/schemas/task.mjs   # Mongoose Task model
 ┃ ┃ ┣ routes/routes.mjs           # GET, POST, PUT, PATCH, DELETE endpoints
 ┃ ┃ ┗ utils/validationSchema.mjs  # express-validator rules
 ┃ ┣ .env                          # Local config (PORT + MONGO_URI)
 ┃ ┣ index.mjs                     # Server entry, auto fallback DB
 ┃ ┗ package.json
 ┗ frontend/
   ┣ src/
   ┃ ┣ components/
   ┃ ┃ ┣ LoadingSpinner.jsx
   ┃ ┃ ┣ Navbar.jsx
   ┃ ┃ ┗ TaskCard.jsx
   ┃ ┣ pages/
   ┃ ┃ ┣ TaskDashboard.jsx
   ┃ ┃ ┣ TaskDetails.jsx
   ┃ ┃ ┣ TaskFormPage.jsx
   ┃ ┃ ┗ StatsPage.jsx
   ┃ ┣ api.js                      # Axios instance (reads VITE_API_URL)
   ┃ ┣ App.jsx                     # Route definitions
   ┃ ┣ index.css                   # Design system & animations
   ┃ ┗ main.jsx
   ┣ .env.example                  # Copy to .env to set VITE_API_URL locally
   ┣ vercel.json                   # SPA rewrite rule for React Router
   ┗ package.json
```

---

## ✍️ Authors

- **Niharika Mente** — React Frontend  
- **Prem Kumar** — Express REST API Backend
