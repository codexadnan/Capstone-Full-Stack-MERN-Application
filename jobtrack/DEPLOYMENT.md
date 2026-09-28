# Deployment guide

Order: **MongoDB Atlas -> Render (API) -> Vercel (frontend) -> update CORS on Render.**

## 0. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Before pushing, run `git status` and confirm no `.env` file is listed. Create the GitHub repository as **Public**.

## 1. MongoDB Atlas

1. Sign up at https://www.mongodb.com/cloud/atlas and create a free **M0** cluster.
2. **Database Access** -> Add Database User -> username + password (note them; avoid special characters in the password or URL-encode them).
3. **Network Access** -> Add IP Address -> `0.0.0.0/0` (allow from anywhere; needed for Render's free tier).
4. **Database** -> Connect -> Drivers -> copy the connection string:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/jobtrack?retryWrites=true&w=majority`
   Replace `USER` and `PASSWORD`, and make sure `/jobtrack` (the database name) is before the `?`.

For local development, put this string in `server/.env` as `MONGO_URI`.

## 2. Backend on Render

1. https://render.com -> New -> **Web Service** -> connect your GitHub repository.
2. Settings:
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Environment Variables** (Render dashboard -> Environment):

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | a long random string |
| `CLIENT_URL` | your Vercel URL (add after step 3; no trailing slash) |

   Do **not** set `PORT`: Render provides it.
4. Deploy, then open `https://YOUR-SERVICE.onrender.com/api/health`. You should see `{"success":true,"message":"JobTrack API is running"}`.

The free plan sleeps after inactivity; the first request can take 30-60 seconds. Open the health URL before a demo.

## 3. Frontend on Vercel

1. https://vercel.com -> Add New -> Project -> import the repository.
2. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite (build `npm run build`, output `dist`)
3. **Environment Variable:** `VITE_API_URL` = `https://YOUR-SERVICE.onrender.com/api`
4. Deploy. `client/vercel.json` makes page refreshes work on routes like `/dashboard`.

## 4. CORS

Go back to Render and set `CLIENT_URL` to the exact Vercel URL (for example `https://jobtrack-abc.vercel.app`, no trailing slash), then redeploy. Multiple origins can be comma-separated. The backend allows only these origins and sends `credentials: true`, so the browser accepts the auth cookie.

## Cookie note (Safari / privacy browsers)

Vercel and Render are different domains, so the auth cookie is third-party (`SameSite=None; Secure`). Chrome and Edge allow this; Safari and some privacy settings block it. If login works but `/api/auth/me` returns 401 afterwards, use this fallback that makes the cookie first-party:

1. In `client/vercel.json` replace the contents with:
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://YOUR-SERVICE.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
2. Set `VITE_API_URL` on Vercel to `/api` and redeploy.

## 5. Production verification checklist

- [ ] Frontend URL loads the landing page
- [ ] `/api/health` on the Render URL returns success
- [ ] Register works and the user appears in Atlas
- [ ] Log out and log in work
- [ ] Opening `/dashboard` while logged out redirects to `/login`
- [ ] Create, edit and delete an application
- [ ] Dashboard numbers change after each action
- [ ] Refreshing `/applications` and `/dashboard` does not give a 404
- [ ] Browser DevTools -> Network shows no errors (CORS, 401)
- [ ] No secrets in the repository (`git log -p | grep -i mongodb+srv` returns nothing)
