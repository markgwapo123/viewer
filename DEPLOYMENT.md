# Deployment Guide

## Option 1: Deploy to Render (FREE - Recommended)

### Step 1: Create GitHub Repository
1. Go to https://github.com and create a new repository
2. Name it: `phone-screen-viewer`
3. Don't initialize with README

### Step 2: Push Code to GitHub
Open PowerShell in your project folder and run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/phone-screen-viewer.git
git push -u origin main
```

### Step 3: Deploy on Render
1. Go to https://render.com and sign up (free account)
2. Click "New" → "Web Service"
3. Connect your GitHub account
4. Select your `phone-screen-viewer` repository
5. Configure:
   - **Name**: phone-screen-viewer
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Click "Create Web Service"

### Step 4: Wait for Deployment
- Render will automatically deploy your app
- You'll get a URL like: `https://phone-screen-viewer.onrender.com`

### Step 5: Access Your App
- Visit your deployed URL
- Login with: admin/admin123 or phone1/phone123

---

## Option 2: Deploy to Railway (FREE)

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Railway
1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect and deploy
5. Click "Generate Domain" to get your public URL

---

## Option 3: Deploy to Fly.io (FREE)

### Step 1: Install Fly CLI
```bash
iwr https://fly.io/install.ps1 -useb | iex
```

### Step 2: Login and Deploy
```bash
fly auth login
fly launch
```
Follow the prompts and your app will be deployed!

---

## Important Notes

### ⚠️ HTTPS Requirement
Screen sharing **requires HTTPS** in production. All these platforms provide free HTTPS automatically.

### 🔒 Security
For production, change default passwords in `server.js`:
```javascript
const users = {
  'youradmin': { password: 'your-secure-password', role: 'viewer' },
  'yourphone': { password: 'another-secure-password', role: 'streamer' }
};
```

### 🌐 Accessing from Phone
1. Deploy to Render/Railway/Fly.io
2. Get your public URL (e.g., https://yourapp.onrender.com)
3. Open that URL on your phone's Chrome browser
4. Login as phone1 and share screen

### 📱 WebRTC and Free Hosting
Free hosting platforms work fine for this app. The video streaming is peer-to-peer (WebRTC), so the server only handles signaling.

---

## Troubleshooting

**Problem**: Screen sharing not working
- **Solution**: Make sure you're using HTTPS (not HTTP)

**Problem**: Can't connect from phone
- **Solution**: Ensure phone is connected to internet (not same network required)

**Problem**: App sleeps on free tier
- **Solution**: Free tiers sleep after inactivity. Upgrade to paid or keep-alive service

---

## Quick Start (Render - Easiest)

1. Create GitHub account if needed
2. Push code to GitHub
3. Sign up at render.com
4. Connect GitHub and deploy
5. Done! Access via provided URL
