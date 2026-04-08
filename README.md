# YBEX

Full-stack web application with React frontend and Node.js/Express backend.

## Project Structure

```
YBEX/
├── backend/    # Express + MongoDB API
└── frontend/   # React + Vite client
```

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `EMAIL_USER` / `EMAIL_PASS` - Nodemailer credentials
- `CLIENT_URL` - Frontend URL for CORS

### Frontend (`frontend/.env`)
- `VITE_API_URL` - Backend API base URL
