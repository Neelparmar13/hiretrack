# HireTrack — Job Application Tracker

A full-stack MERN web application to track job applications with a Kanban board, analytics dashboard, and real-time updates.

🔗 **Live Demo:** [https://hiretrack-seven.vercel.app](https://hiretrack-seven.vercel.app)  
📁 **GitHub:** [https://github.com/Neelparmar13/hiretrack](https://github.com/Neelparmar13/hiretrack)

---

## Features

### Mandatory
- ✅ **CRUD Operations** — Create, View, Update, and Delete job applications
- ✅ **Form Validation** — Required field validation with inline error messages
- ✅ **REST APIs** — Full Express.js REST API with protected routes
- ✅ **MongoDB Integration** — MongoDB Atlas cloud database
- ✅ **Responsive UI** — Works on desktop, tablet, and mobile
- ✅ **Dynamic Updates** — Real-time UI updates without page refresh
- ✅ **Deployed** — Frontend on Vercel, Backend on Render

### Bonus
- ✅ **Filter by Status** — Filter tasks by Applied / Interview / Offer / Rejected
- ✅ **Sort by Date** — Sort tasks by Newest or Oldest first
- ✅ **Toast Notifications** — Instant feedback on Add, Edit, Delete actions
- ✅ **Drag & Drop Kanban** — Move tasks between status columns
- ✅ **Analytics Dashboard** — Charts showing weekly applications and status breakdown
- ✅ **JWT Authentication** — Secure login/register with JSON Web Tokens
- ✅ **Environment Variables** — `.env` used on both client and server
- ✅ **Reusable Components** — Modular components (JobCard, Modal, Navbar, Toast)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 19, Vite, React Router DOM |
| Drag & Drop | @hello-pangea/dnd |
| Charts | Chart.js, React-Chartjs-2 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
hiretrack/
├── client/                     ← React frontend
│   └── src/
│       ├── api/
│       │   └── jobs.js
│       ├── components/
│       │   ├── AddJobModal.jsx
│       │   ├── EditJobModal.jsx
│       │   ├── JobCard.jsx
│       │   ├── KanbanBoard.jsx
│       │   ├── Navbar.jsx
│       │   └── Toast.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           └── Analytics.jsx
│
└── server/                     ← Express backend
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   └── jobController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Job.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── jobRoutes.js
    └── index.js
```

---

## Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### 1. Clone the repo
```bash
git clone https://github.com/Neelparmar13/hiretrack.git
cd hiretrack
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Jobs (Protected — requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | Get all jobs for logged-in user |
| POST | `/api/jobs` | Create a new job |
| PUT | `/api/jobs/:id` | Update a job |
| DELETE | `/api/jobs/:id` | Delete a job |

---

## Deployment

- **Frontend:** Vercel — [https://hiretrack-seven.vercel.app](https://hiretrack-seven.vercel.app)
- **Backend:** Render — [https://hiretrack-api-cr04.onrender.com](https://hiretrack-api-cr04.onrender.com)
- **Database:** MongoDB Atlas

---

## Developer

**Neel Parmar**  
M.Sc. IT — Veer Narmad South Gujarat University, Surat  
GitHub: [github.com/Neelparmar13](https://github.com/Neelparmar13)  
LinkedIn: [linkedin.com/in/neelparmar13](https://linkedin.com/in/neelparmar13)  
Email: neelparmar950@gmail.com