# FoodReels

**A full-stack MERN-style food video platform** — users can browse short food videos, like/comment/save them; food partners can create and upload videos using ImageKit CDN. Built with Express, MongoDB (Mongoose), React (Vite), and ImageKit for media delivery.

---

## Table of contents

* [Project overview](#project-overview)
* [Features](#features)
* [Tech stack](#tech-stack)
* [Repository structure](#repository-structure)
* [Environment variables](#environment-variables)
* [Local setup & run](#local-setup--run)
* [API reference (important endpoints)](#api-reference-important-endpoints)
* [Frontend routes / pages](#frontend-routes--pages)
* [Data models (summary)](#data-models-summary)
* [Notable implementation details](#notable-implementation-details)
* [Known issues & TODOs](#known-issues--todos)
* [Deployment notes](#deployment-notes)
* [Contributing](#contributing)
* [License](#license)

---

## Project overview

This project implements a simple social-like platform for short food videos with two user roles:

* **User** — can browse videos, like/unlike, comment, like comments, and save/bookmark videos.
* **Food Partner** — can register, log in, and create/upload food videos.

The backend exposes a REST API and stores video metadata, users, comments, likes, and saves in MongoDB. Video files are uploaded from the backend to ImageKit (using `multer` memory storage and the ImageKit Node SDK) and delivered via an ImageKit CDN URL.

## Features

* Email/password authentication for Users and Food Partners
* JWT-based auth and role-specific middleware
* Video uploads (multer memory storage → ImageKit)
* Likes for videos and comments
* Commenting system with counts
* Save/bookmark videos
* Basic React frontend with routes for register/login, home feed, create food (food partner), profile and saved items

## Tech stack

* Backend: Node.js, Express, Mongoose (MongoDB), Multer, ImageKit
* Frontend: React (via Vite), React Router v7, Axios
* Auth: JWT (HTTP cookie used to store token)

## Repository structure (important parts)

```
Project/
├─ backend/
│  ├─ server.js
│  ├─ src/
│  │  ├─ app.js
│  │  ├─ db/db.js
│  │  ├─ controllers/
│  │  │  ├─ auth.controller.js
│  │  │  └─ food.controlerr.js
│  │  ├─ routes/
│  │  │  ├─ auth.route.js
│  │  │  └─ food.route.js
│  │  ├─ models/  (user, food, comment, like, save, commentLike, foodPartner)
│  │  └─ services/storage.service.js (ImageKit uploads)
├─ frontend/
│  ├─ src/
│  │  ├─ pages/ (auth, general pages, food-partner pages)
│  │  ├─ components/ (CommentSection, HamburgerMenu, Bottom_nav, Reel_actions)
│  │  └─ routes/AppRoutes.jsx
```

## Environment variables

Create a `.env` file (do NOT commit this to Git). The project expects the following variables in the backend:

```
JWT_SECRET=your_jwt_secret
MONGODB_URL=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://<your_imagekit_id>.imagekit.io/<path>
```

**Security note:** The repository currently contains a `.env` file (with keys). Remove/rotate any leaked secrets before publishing the repo.

## Local setup & run

### Prerequisites

* Node.js (v18+ recommended) and npm
* MongoDB (Atlas or local)

### Backend

1. Open terminal and `cd Project/backend`
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the variables shown above.
4. Start the server:

```bash
node server.js
```

The server listens on port `3000` by default (see `server.js`).

> Note: `package.json` in the backend does not include a `start` script — you can add one like:
>
> ```json
> "scripts": {
>   "start": "node server.js",
>   "dev": "nodemon server.js"
> }
> ```

### Frontend

1. Open a new terminal and `cd Project/frontend`
2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

The frontend uses Vite and runs at `http://localhost:5173` by default. The backend CORS is set to allow `http://localhost:5173`.

## API reference (important endpoints)

> Base path: `/api`

### Auth

* `POST /api/auth/user/register` — register a user (`{ name, email, password }`)
* `POST /api/auth/user/login` — login user (`{ email, password }`) — sets `token` cookie
* `POST /api/auth/user/logout` — user logout (clears cookie)
* `POST /api/auth/food-partner/register` — register a food partner
* `POST /api/auth/food-partner/login` — login food partner
* `GET /api/auth/food-partner/logout` — logout food partner

### Food

* `POST /api/food/` — create food (food-partner only). Form-data with `video` file and fields like `name`, `description`.
* `GET /api/food/` — get feed (users)
* `POST /api/food/like` — like/unlike a food item
* `POST /api/food/save` — save/unsave (bookmark) a food item
* `GET /api/food/SavedFoods` — list saved foods
* `POST /api/food/CommentFood` — add a comment
* `GET /api/food/Comments/:foodId` — get comments for a food item
* `POST /api/food/commentLike` — like/unlike a comment

## Frontend routes / pages

(Defined in `src/routes/AppRoutes.jsx`)

* `/` — Home feed (browse videos)
* `/user/register` — User register
* `/user/login` — User login
* `/food-partner/register` — Food partner register
* `/food-partner/login` — Food partner login
* `/Createfood` — Create food (food partner page)
* `/saved` — Saved items
* `/food-partner/:id` — Food partner profile

## Data models (summary)

Important models are in `backend/src/models`:

* `User` — `name`, `email`, `password` (hashed)
* `FoodPartner` — `name`, `email`, `password`, profile related fields
* `Food` — `name`, `video` (ImageKit URL), `description`, `likeCount`, `saveCount`, `commentCount`, owner id
* `Like` — relation of user ↔ food
* `Save` — relation of user ↔ food
* `Comment` — `text`, `userId`, `foodId`, timestamps
* `CommentLike` — relation of user ↔ comment

## Notable implementation details

* **Image upload:** `multer` with `memoryStorage()` is used. Files are uploaded to ImageKit using `@imagekit/nodejs` by converting buffer to base64.
* **Auth:** JWT tokens are issued on login and set as a cookie named `token`. Backend middleware checks role and validates JWT.
* **Frontend:** React + Axios is used; cookie-based auth requires `axios` requests to be sent with `{ withCredentials: true }` when calling protected endpoints.

## Known issues & TODOs (observed in code)

* **Logout cookie clearing bug:** In `auth.controller.js` the logout function contains `res.clearCooki` (likely incomplete). Fix by using `res.clearCookie('token', { path: '/' })` or set cookie expiration to past. Also ensure frontend triggers logout request and removes local state.

* **Comments disappear after refresh:** If comments render immediately but vanish on refresh, probably the frontend is not re-fetching comments from `GET /api/food/Comments/:foodId` on mount, or the backend `getFoodComments` route may require auth and the frontend isn't sending credentials. Add `withCredentials: true` to Axios requests and ensure the backend route is reachable.

* **No backend start script:** Add `start` and `dev` scripts to `backend/package.json` for developer ergonomics.

* **Secrets in repo:** `.env` is currently present in the backend folder with real keys — rotate them and add `.env` to `.gitignore`.

## Deployment notes

* Use environment variables in your hosting provider (Render, Heroku, Vercel (frontend only), Railway, etc.).
* On production, set proper cookie options (`httpOnly`, `secure`, `sameSite`) and configure CORS to the deployed frontend domain.
* For large video files, ensure ImageKit plan and upload limits are appropriate.

## Quick troubleshooting

* If `401 Unauthorized` appears on protected requests:

  * Confirm the cookie `token` is present in browser dev tools
  * Ensure Axios calls set `withCredentials: true` and backend CORS `credentials:true` and `origin` includes your frontend domain
* If uploads fail with ImageKit errors:

  * Verify `IMAGEKIT_*` env variables and that ImageKit account allows server-side uploads with the provided keys

## Contributing

PRs, issue reports and suggestions are welcome. When opening an issue, include reproduction steps and server/frontend logs.

## License

This repo is provided as-is. Add a license file (e.g. MIT) if you plan to open-source it.

---

*If you want, I can:*

* generate a `.gitignore` that excludes `node_modules` and `.env`,
* add a `start`/`dev` script to `backend/package.json`,
* produce short README variations (one-liner for resume or GitHub project card),
* open a focused checklist PR with the bug fixes described above.
