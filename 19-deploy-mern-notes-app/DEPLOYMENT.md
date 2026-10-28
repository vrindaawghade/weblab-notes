# Deploy to Render + MongoDB Atlas (free tier)

Express serves the React frontend from /public, so ONE web service = frontend + backend.

## 1. Database (MongoDB Atlas)
1. Create a free cluster at https://cloud.mongodb.com
2. Database Access -> add a user (username + password).
3. Network Access -> add IP 0.0.0.0/0 (allow from anywhere).
4. Connect -> Drivers -> copy the connection string, e.g.
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/weblab_notes

## 2. Push code to GitHub
    git init && git add . && git commit -m "first commit"
    git remote add origin <your-repo-url> && git push -u origin main

## 3. Create the web service on Render (https://render.com)
- New -> Web Service -> connect your repo
- Build command : npm install
- Start command : npm start
- Environment variables:
    MONGO_URI  = <Atlas connection string from step 1>
    CLIENT_URL = *   (or your frontend URL if hosted separately)
  (PORT is set by Render automatically.)
  (render.yaml in this folder can also be used as a Blueprint.)

## 4. Frontend / backend URLs
- Same service (default): leave public/config.js as  window.API_URL = "";
- Separate frontend (Netlify/Vercel): upload the /public folder there and set
  window.API_URL = "https://<your-backend>.onrender.com"; and set CLIENT_URL on the backend to the frontend URL.

## 5. Verify after deployment
- Add a note on the live site, refresh the page, and confirm it is still listed.
- Delete a note and confirm it disappears.
- Open https://<your-app>.onrender.com/api/health -> {"ok":true}
- Note: the free tier sleeps when idle; the first request may take ~50 seconds.
