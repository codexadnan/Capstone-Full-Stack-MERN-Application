# JobTrack

> Job Application Management System - a full-stack MERN capstone project.

## Project Overview

JobTrack lets a user create an account and manage every job application from one dashboard: add applications, track their status, search and filter them, and see live statistics. All data is private, so each user can only see and change their own records.

## Problem Statement

Job seekers apply to many companies and quickly lose track of where each application stands, which interviews are coming up and which links or notes belong to which role. JobTrack replaces scattered spreadsheets and emails with one organised, searchable place.

## Features

- Register, log in and log out (JWT stored in an HTTP-only cookie)
- Passwords hashed with bcrypt
- Create, view, edit and delete job applications (full CRUD)
- Search by company or position; filter by status and employment type; sort by newest, oldest or company
- Pagination on the applications list
- Dashboard with live statistics and recent applications
- Client-side and server-side validation
- Loading, error and empty states; success messages; delete confirmation
- Responsive layout (sidebar on desktop, slide-in menu on mobile)
- Protected routes on both frontend and backend

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios, React Hooks, Context API, plain CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth & security | JWT, bcryptjs, cookie-parser, helmet, cors, express-rate-limit, express-validator |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## System Architecture

```
Browser (React SPA)
      |  HTTPS + Axios (withCredentials)
      v
Vercel (static hosting)         Render (Express API)  -->  MongoDB Atlas
                                 /api/auth, /api/applications
```

Request flow for a protected route:
`CORS -> cookie-parser -> protect (verify JWT, load user) -> validators -> controller (query filtered by req.user._id) -> Mongoose -> JSON -> central error handler`

## Project Structure

```
jobtrack/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/   reusable UI (Button, Input, Modal, StatusBadge, ...)
│   │   ├── pages/        Landing, Login, Register, Dashboard, Applications, ...
│   │   ├── layouts/      DashboardLayout (sidebar + top bar)
│   │   ├── hooks/        useAuth, useToast, useDebounce
│   │   ├── context/      AuthContext, ToastContext
│   │   ├── services/     Axios instance and API calls
│   │   ├── utils/        constants, formatters, validators
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json       SPA rewrite so refresh works
│   └── .env.example
├── server/
│   ├── config/           MongoDB connection
│   ├── controllers/      authController, applicationController
│   ├── middleware/       protect, validate, errorHandler
│   ├── models/           User, JobApplication
│   ├── routes/           authRoutes, applicationRoutes
│   ├── validators/       express-validator rules
│   ├── utils/            AppError, token helpers
│   ├── seed/             development-only demo data
│   ├── app.js            Express app setup
│   ├── server.js         DB connection + listen
│   └── .env.example
├── .gitignore
└── README.md
```

## Authentication

1. `POST /api/auth/register` or `/login` verifies input, hashes/compares the password with bcrypt and signs a JWT.
2. The JWT is sent as an **HTTP-only cookie** (`Secure` and `SameSite=None` in production, `Lax` locally), so JavaScript cannot read it.
3. The `protect` middleware reads the cookie, verifies the JWT, loads the user and sets `req.user`. Missing or invalid tokens return `401`.
4. On the frontend, `AuthContext` calls `GET /api/auth/me` on load to restore the session, and `ProtectedRoute` redirects unauthenticated visitors to `/login`.

## API Endpoints

All responses are JSON: `{ "success": true/false, "message": "...", "data": ... }`.

| Method | URL | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Log in |
| POST | `/api/auth/logout` | No | Log out (clears cookie) |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/applications` | Yes | List applications |
| GET | `/api/applications/stats` | Yes | Statistics for the current user |
| GET | `/api/applications/:id` | Yes | One application |
| POST | `/api/applications` | Yes | Create application |
| PUT | `/api/applications/:id` | Yes | Update application |
| DELETE | `/api/applications/:id` | Yes | Delete application |

### Details

**POST /api/auth/register** - body: `{ "name": "Ali Khan", "email": "ali@example.com", "password": "Passw0rd123" }`
Returns `201` with `data.user` and sets the cookie. Errors: `400` validation, `409` email already registered.

**POST /api/auth/login** - body: `{ "email": "...", "password": "..." }`
Returns `200` with `data.user` and sets the cookie. Errors: `400` validation, `401` invalid email or password, `429` too many attempts.

**POST /api/auth/logout** - no body. Returns `200`, clears the cookie.

**GET /api/auth/me** - requires cookie. Returns `200` with `data.user`. Errors: `401`.

**GET /api/applications** - query params (all optional): `search`, `status`, `employmentType`, `sort` (`newest` | `oldest` | `company`), `page`, `limit` (max 50).
Example: `/api/applications?status=Interview&search=Google&sort=company&page=1`
Returns `200`: `{ count, pagination: { page, limit, total, pages }, data: [...] }`. Errors: `401`.

**GET /api/applications/stats** - Returns `200`:
```json
{ "success": true, "data": { "total": 20, "applied": 8, "screening": 4, "interview": 3,
  "technicalTest": 0, "offers": 1, "rejected": 4, "withdrawn": 0 } }
```

**GET /api/applications/:id** - Returns `200` with `data`. Errors: `400` invalid ID, `401`, `404` not found (also returned for another user's record).

**POST /api/applications** - body (required: `company`, `position`):
```json
{ "company": "Google", "position": "Frontend Engineer", "location": "Remote",
  "employmentType": "Full-time", "jobUrl": "https://careers.google.com/jobs/1",
  "salary": 90000, "status": "Applied", "appliedDate": "2026-09-20",
  "interviewDate": "", "notes": "Referred by a friend" }
```
Returns `201`. Errors: `400` validation, `401`.

**PUT /api/applications/:id** - same body as POST. Returns `200`. Errors: `400`, `401`, `404`.

**DELETE /api/applications/:id** - Returns `200`. Errors: `400`, `401`, `404`.

## Database Models

**User** - `name`, `email` (unique, lowercase), `password` (bcrypt hash, `select: false`), `createdAt`, `updatedAt`.

**JobApplication** - `user` (ObjectId ref to User), `company`, `position`, `location`, `employmentType` (Full-time, Part-time, Contract, Internship, Freelance, Remote), `jobUrl`, `salary`, `status` (Applied, Screening, Interview, Technical Test, Offer, Rejected, Withdrawn), `appliedDate`, `interviewDate`, `notes`, `createdAt`, `updatedAt`.

**Relationship:** one User has many JobApplications. Every query is filtered by `{ user: req.user._id }`, and `user` is always taken from the verified token, never from the request body.

## Installation

Requirements: Node.js 18+ (20+ recommended), npm, a free MongoDB Atlas account, Git.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd jobtrack

cd server && npm install && cd ..
cd client && npm install && cd ..
```

## Environment Variables

`server/.env` (copy from `server/.env.example`):

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` locally, `production` on Render |
| `PORT` | API port (5000 locally; Render sets it automatically) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend URL allowed by CORS (no trailing slash) |

`client/.env` (copy from `client/.env.example`):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Local Development

```bash
# Terminal 1 - API
cd server
npm run dev          # http://localhost:5000

# Terminal 2 - frontend
cd client
npm run dev          # http://localhost:5173
```

Optional demo data (development only): `cd server && npm run seed` creates `demo@jobtrack.dev` / `Demo1234` with sample applications. The seed script refuses to run when `NODE_ENV=production`.

## Testing

See [TESTING.md](TESTING.md) for the full manual test checklist and ready-to-use API requests (curl / Thunder Client / Postman).

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step MongoDB Atlas, Render and Vercel instructions, CORS configuration and the production verification checklist.

## Live Demo

Frontend: YOUR_VERCEL_URL

Backend API: YOUR_RENDER_URL

## GitHub Repository

YOUR_GITHUB_REPOSITORY_URL

## Screenshots

Add your screenshots to a `docs/screenshots/` folder and reference them here:

- Landing page: `docs/screenshots/landing.png`
- Dashboard: `docs/screenshots/dashboard.png`
- Applications list: `docs/screenshots/applications.png`
- Add/Edit form: `docs/screenshots/form.png`

## Future Improvements

- Email reminders for upcoming interviews
- Kanban board view of statuses
- File attachments (CV, cover letter)
- Password change and account deletion
- Automated tests (Jest / Supertest / React Testing Library)
- Export applications to CSV

## Author

YOUR_NAME - YOUR_EMAIL_OR_LINKEDIN
