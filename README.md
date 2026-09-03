# 🏡 Airbnb Full-Stack (MERN Upgrade)

An upgraded full-stack Airbnb web application featuring a modern **React** frontend, **Node.js + Express.js** REST API backend, **MongoDB (Mongoose)** data persistence, and a **Host Authentication System**.

---

## 🔑 Host Credentials (Pre-Configured)

You can immediately sign in as a host to list homes and manage properties:

- **Host ID / Email:** `host@airbnb.com`
- **Password:** `host123`

*(A **"Quick Fill"** button is also built directly into the UI for 1-click login!)*

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster)

---

### 2. Environment Configuration

Create or update `.env` in the `chapter-airbnb` folder:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/airbnb
JWT_SECRET=airbnb_jwt_secret_key_2026_super_secure
```

> **Using MongoDB Atlas?**
> Replace `MONGODB_URI` with your connection string:
> `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/airbnb?retryWrites=true&w=majority`

---

### 3. Running the Application

#### Option A: Run Both Concurrently (Recommended)
From `chapter-airbnb`:

1. **Start Backend Server:**
   ```bash
   npm start
   # Server runs on http://localhost:4000
   ```

2. **Start React Frontend (Vite Dev Server):**
   ```bash
   cd frontend
   npm run dev
   # React app runs on http://localhost:3000 with live reload & proxy to backend
   ```

#### Option B: Production Build (Single Server Mode)
You can compile the React app into static files served directly by the Express backend:

```bash
# Build React frontend
npm run build:client

# Start Express server
npm start
# Visit http://localhost:4000 to see the full application!
```

---

## 🗄️ Database Seeding

To re-seed the default Host and initial homes (*Cozy Cottage*, *Modern Apartment*):

```bash
npm run seed
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/homes` | List all homes (supports `?search=...`) | Public |
| `GET` | `/api/homes/:id` | Get single home details | Public |
| `POST` | `/api/homes` | Create a new home listing | Host (Bearer Token) |
| `DELETE` | `/api/homes/:id` | Delete a home listing | Host (Bearer Token) |
| `POST` | `/api/auth/login` | Host login with ID & password | Public |
| `POST` | `/api/auth/register`| Register a new host account | Public |
| `GET` | `/api/auth/me` | Fetch authenticated host info | Host (Bearer Token) |

---

## 📁 Project Structure

```
chapter-airbnb/
├── config/
│   └── db.js                 # MongoDB connection & auto-seed
├── data/
│   └── homes.json            # Preserved original seed data
├── middleware/
│   └── auth.js               # JWT Host auth verification
├── models/
│   ├── Home.js               # Mongoose Home model
│   └── Host.js               # Mongoose Host model
├── routes/
│   ├── apiAuthRouter.js      # Host Login & Register API
│   ├── apiHomeRouter.js      # Homes CRUD API
│   ├── hostRouter.js         # Preserved SSR router
│   └── userRouter.js         # Preserved SSR router
├── scripts/
│   └── seed.js               # Database seed script
├── views/                    # Preserved original EJS templates
├── frontend/                 # Upgraded React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddHomeModal.jsx
│   │   │   ├── HomeCard.jsx
│   │   │   ├── HomeDetailsModal.jsx
│   │   │   ├── HomeList.jsx
│   │   │   ├── HostLoginModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .env
├── app.js                    # Express application entry
└── package.json
```
