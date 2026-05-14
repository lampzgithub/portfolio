# bhama.in — portfolio

A minimal MERN portfolio for Shrikant Bhama.

- **client/** — React + Vite frontend (deploy to Cloudflare Pages)
- **server/** — Express + MongoDB API (deploy to Railway)
- **DB** — MongoDB Atlas free tier

---

## Local setup

### 1. MongoDB Atlas (free)
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free M0 cluster.
- Database Access → add a user with password.
- Network Access → allow `0.0.0.0/0` (for now).
- Copy the connection string.

### 2. Backend
```bash
cd server
cp .env.example .env
# edit .env with your MONGO_URI, set JWT_SECRET to a long random string,
# set ADMIN_USERNAME and ADMIN_PASSWORD
npm install
npm run seed     # creates the admin user + seeds 2 projects
npm run dev      # runs on http://localhost:5000
```

### 3. Frontend
```bash
cd client
cp .env.example .env       # VITE_API_URL points at localhost:5000 by default
npm install
npm run dev                # runs on http://localhost:5173
```

Open http://localhost:5173. Admin panel is at `/login` then `/admin`.

---

## Deploying

### Backend → Railway
1. Push the whole repo to GitHub.
2. Railway → New Project → Deploy from GitHub repo.
3. Pick the repo. Set **Root Directory** to `server`.
4. In **Variables**, add:
   - `MONGO_URI` (from Atlas)
   - `JWT_SECRET` (long random string — generate with `openssl rand -hex 32`)
   - `ADMIN_USERNAME` (e.g. `shrikant`)
   - `ADMIN_PASSWORD` (set something strong)
   - `CLIENT_URL` (your frontend URL, e.g. `https://bhama.in`)
5. Settings → Networking → Generate Domain.
6. Run seed once: Railway shell → `npm run seed` (or do it locally pointing to Atlas).
7. Copy the Railway URL — you'll need it for the frontend env.

### Frontend → Cloudflare Pages
1. pages.cloudflare.com → Create project → Connect to Git → your repo.
2. Build settings:
   - **Root directory**: `client`
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
3. Environment variables → add `VITE_API_URL` = your Railway backend URL.
4. Deploy.
5. Custom domain → add `bhama.in` and `www.bhama.in`. Cloudflare will give you DNS records — add them in Hostinger's DNS Zone Editor.

### One note
After the .in eKYC is complete and the domain isn't suspended, DNS will work. Without that, your domain stops resolving regardless of where it's hosted.

---

## How to add a new project
1. Go to `https://bhama.in/login`
2. Sign in.
3. Click "new project". Fill in title, description, highlights (one per line), stack (comma separated). Save.
4. It shows up on the homepage and the work page automatically.

To edit or delete, same admin page.

---

## Security notes
- The admin route is protected client-side and server-side (JWT, 7 day expiry).
- Set a strong `ADMIN_PASSWORD` and a long random `JWT_SECRET`.
- Atlas: tighten the IP allow list to Railway's IPs once stable.
- Never commit `.env` files.

---

## Stack
- React 18, Vite, React Router
- Node 18+, Express, Mongoose
- MongoDB Atlas
- JWT auth, bcryptjs hashing
- Fonts: Fraunces + JetBrains Mono (Google Fonts)
