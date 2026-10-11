# LearnLens AI — Production Deployment Guide

This guide explains how to deploy **LearnLens AI** to any cloud provider or server environment.

---

## 1. Environment Variables Configuration

Before deploying, configure your environment variables:

| Variable | Description | Required? | Default / Example |
|---|---|---|---|
| `PORT` | Listening port for the application | No | `3000` |
| `NODE_ENV` | Environment flag (`production` or `development`) | No | `production` |
| `JWT_SECRET` | Secret key for signing authentication tokens | Yes (in prod) | `any-secure-random-string` |
| `GEMINI_API_KEY` | Google Gemini API key for live AI tutoring | Optional | If omitted, runs in built-in Demo Engine mode |

---

## 2. Option A: Deploy via Docker (Recommended for Any VPS / Cloud Server)

LearnLens AI includes a multi-stage `Dockerfile` and `docker-compose.yml`.

### Using Docker Compose
```bash
# 1. Clone your repository
git clone <your-repo-url>
cd learnlens-ai

# 2. Build and run in background
docker compose up --build -d

# 3. Verify container is healthy
docker compose ps
docker compose logs -f
```
The application will be live on `http://<your-server-ip>:3000`.

### Using Raw Docker Commands
```bash
docker build -t learnlens-ai .
docker run -d -p 3000:3000 -e NODE_ENV=production -e JWT_SECRET=mysecretkey learnlens-ai
```

---

## 3. Option B: Deploy to Google Cloud Run

Google Cloud Run can build and deploy the container directly:

```bash
# Login and configure GCP project
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID

# Deploy directly from source
gcloud run deploy learnlens-ai \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NODE_ENV=production,JWT_SECRET=supersecret2026
```

---

## 4. Option C: Deploy to Render / Railway / DigitalOcean App Platform

1. Connect your GitHub repository to **Render** or **Railway**.
2. Select **Web Service**.
3. Choose **Docker** as the environment (or Node.js with Build Command `npm install && npm run build` and Start Command `npm start`).
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `<random-secret>`
   - `PORT`: `3000`
5. Click **Deploy**.

---

## 5. Option D: Direct Node.js / PM2 Deployment on Ubuntu / Debian VPS

```bash
# 1. Install Node.js 20+ and PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# 2. Clone and install dependencies
git clone <your-repo-url>
cd learnlens-ai
npm install

# 3. Build frontend bundle
npm run build

# 4. Start production process with PM2
pm2 start server.ts --name "learnlens" --interpreter npx --interpreter-args "tsx" --env NODE_ENV=production

# 5. Save PM2 startup
pm2 save
pm2 startup
```

---

## 6. Verification & Health Check

After deployment, test the health endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected JSON response:
```json
{
  "status": "healthy",
  "product": "LearnLens AI",
  "tagline": "Understand More. Learn Smarter.",
  "aiEngine": "Gemini 3.8 Flash (Active) or Pedagogical Demo Engine",
  "uptime": 12.4
}
```

Demo student account is immediately available for verification:
- Email: `priya@example.com`
- Password: `demo123`
