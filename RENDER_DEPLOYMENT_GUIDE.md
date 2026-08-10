# 🚀 Render Deployment Guide for Canadian Realtor Backend API

Follow these simple steps to deploy your Express/Node.js backend API to Render.

---

## Option 1: 1-Click Render Blueprint Deployment (Recommended)

1. **Push Changes to GitHub**:
   All build scripts, `tsconfig.server.json`, and `render.yaml` are already committed and pushed to your GitHub repository `Rithvik-krishna/Realtor-Website-Project`.

2. **Log into Render**:
   Go to [https://dashboard.render.com](https://dashboard.render.com) and log in with your GitHub account.

3. **New Blueprint**:
   * Click **New +** $\rightarrow$ Select **Blueprint**.
   * Connect your GitHub repository `Rithvik-krishna/Realtor-Website-Project`.
   * Render will automatically detect the `render.yaml` file in your repository!
   * Click **Apply**.

Render will automatically build and deploy your backend service!

---

## Option 2: Manual Web Service Deployment on Render

If you prefer to configure the Web Service manually on Render:

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your repository: `Rithvik-krishna/Realtor-Website-Project`.
4. Configure the Web Service settings:
   * **Name**: `canadian-realtor-backend`
   * **Region**: Oregon (US West) or closest region
   * **Branch**: `main`
   * **Root Directory**: (Leave blank)
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npm run build:backend`
   * **Start Command**: `npm start`
   * **Instance Type**: `Free`

5. **Environment Variables**:
   Under **Environment Variables**, add:
   * `NODE_ENV` = `production`
   * `PORT` = `10000`
   * `CORS_ORIGIN` = `*`
   * `JWT_SECRET` = `realtor_secret_2026`
   * `TRREB_API_URL` = `https://query.ampre.ca/odata`
   * `TRREB_ACCESS_TOKEN` = `(Optional: your TRREB MLS token)`

6. Click **Create Web Service**.

---

## 🎯 Verification

Once deployed, Render will provide a live public API URL like:
`https://canadian-realtor-backend.onrender.com`

You can test the health endpoint in your browser:
`https://canadian-realtor-backend.onrender.com/health`

It will return:
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "timestamp": "2026-08-07T00:00:00.000Z"
  },
  "message": "Canadian Realtor Backend API is healthy"
}
```
