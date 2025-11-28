# Deployment Guide

This guide covers two main ways to deploy the Snake Rivals Arena:
1.  **VPS (Virtual Private Server)** - Using Docker Compose (Recommended for control/cost)
2.  **PaaS (Platform as a Service)** - Using Railway/Render (Recommended for ease of use)

---

## Option 1: VPS (DigitalOcean, Hetzner, AWS EC2)

This is the simplest way to replicate your local environment. You run the exact same `docker-compose` setup on a remote server.

### 1. Provision a Server
*   Get a Linux server (Ubuntu 22.04 or 24.04 recommended).
*   Minimum specs: 1 vCPU, 1GB RAM (2GB recommended).

### 2. Install Docker & Git
SSH into your server and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose (if not included in newer docker versions)
sudo apt install -y docker-compose-plugin
```

### 3. Deploy the App

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/snake-rivals-arena.git
cd snake-rivals-arena

# 2. Create production environment file
cp .env.docker .env

# 3. (Optional) Edit .env to change passwords/secrets
nano .env

# 4. Start the application
docker compose up -d --build
```

Your app is now running at `http://YOUR_SERVER_IP`.

### 4. (Optional) Domain & SSL
To add a domain and HTTPS using Caddy (easiest method):

1.  Stop the app: `docker compose down`
2.  Edit `docker-compose.yml` to expose port 8080 instead of 80 for the app.
3.  Run Caddy as a reverse proxy.

---

## Option 2: Render (PaaS) - Recommended

We use a **Render Blueprint** (`render.yaml`) for Infrastructure as Code. This automates the setup of the database and web service.

### 1. Setup Blueprint
1.  Create an account at [render.com](https://render.com).
2.  Go to **Blueprints** -> **New Blueprint Instance**.
3.  Connect your `snake-rivals-arena` repository.
4.  Render will detect `render.yaml` and show you the resources it will create (Web Service + Database).
5.  Click **Apply**.

### 2. Configure CI/CD (GitHub Actions)
Our `render.yaml` has `autoDeploy: false`. This means Render won't deploy automatically on push. Instead, we use GitHub Actions to run tests first.

1.  In Render Dashboard, go to your new **Web Service**.
2.  Go to **Settings** -> **Deploy Hook**.
3.  Copy the **Deploy Hook URL**.
4.  In GitHub, go to your repo **Settings** -> **Secrets and variables** -> **Actions**.
5.  Create a **New repository secret**:
    *   Name: `RENDER_DEPLOY_HOOK_URL`
    *   Value: (Paste the URL)

Now, every push to `main` will:
1.  Run Backend Tests
2.  Run Frontend Tests
3.  If all pass -> Trigger Render Deployment

### 3. Verify
Once deployed, Render will give you a public URL (e.g., `snake-rivals-arena.onrender.com`).
Visit it to play!

---

## Option 3: Railway (PaaS)

Railway is another excellent option.

### 1. Setup
1.  Create an account at [railway.app](https://railway.app).
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your repository.

### 2. Add Database
1.  In the project view, click **"New"** -> **"Database"** -> **"PostgreSQL"**.
2.  Wait for it to initialize.

### 3. Configure Variables
1.  Click on your **App Service** card.
2.  Go to **"Variables"**.
3.  Add `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`.
4.  Add `PORT` = `8080`.

### 4. Verify
Railway will redeploy and provide a public URL.

---

## Important Notes for Cloud Deployment

### Database Persistence
*   **VPS**: Data is stored in the `postgres_data` Docker volume on the server disk. It persists across restarts.
*   **PaaS**: Use the platform's managed database service. Do NOT use the local SQLite file or a containerized Postgres inside the app container, as PaaS filesystems are ephemeral (reset on every deploy).

### Environment Variables
Always override these in production:
*   `POSTGRES_PASSWORD`: Use a strong, random password.
*   `SECRET_KEY`: If you add JWT/Sessions later, ensure this is secure.
