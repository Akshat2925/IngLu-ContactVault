# Deploy ContactVault

## Step 1: MongoDB Atlas (Free Database)
1. Go to https://cloud.mongodb.com and create a free account
2. Create a free cluster (M0)
3. Create a database user (username + password)
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Click "Connect" → "Connect your application"
6. Copy the connection string — looks like:
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/contactmanager

## Step 2: Deploy Backend on Render (Free)
1. Push your code to GitHub
2. Go to https://render.com and sign up
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Set root directory: contact-manager/backend
6. Build command: npm install
7. Start command: npm start
8. Add environment variable:
   - MONGO_URI = (your MongoDB connection string)
9. Click Deploy
10. Copy your backend URL (e.g. https://contactvault-api.onrender.com)

## Step 3: Deploy Frontend on Vercel (Free)
1. Go to https://vercel.com and sign up
2. Click "New Project" → Import your GitHub repo
3. Set root directory: contact-manager/frontend
4. Add environment variable:
   - VITE_API_URL = https://contactvault-api.onrender.com
5. Click Deploy
6. Your live URL will be: https://contactvault.vercel.app

## Step 4: Update vite.config.js for production
In contact-manager/frontend/vite.config.js, the proxy only works locally.
For production, update axios base URL in your components to use VITE_API_URL.

## Local Development
Terminal 1 (Backend):
  cd contact-manager/backend
  npm run dev

Terminal 2 (Frontend):
  cd contact-manager/frontend
  npm run dev

Frontend: http://localhost:5173
Backend:  http://localhost:5000
