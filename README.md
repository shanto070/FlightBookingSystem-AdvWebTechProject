# Flight Booking System

Full-stack flight booking application with NestJS backend, Next.js frontend, and PostgreSQL database.

## Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL v12+
- npm v9+

### 1. Create Database

```bash
psql -U postgres
CREATE DATABASE flight_booking_db;
\q
```

### 2. Backend Setup

```bash
cd backend

# Create .env file
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=281975
DB_NAME=flight_booking_db
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USER=your_username
MAIL_PASS=your_password
MAIL_FROM=noreply@flightbooking.com
PORT=3000

# Install & Run
npm install
npm run seed
npm run start:dev
```

✅ Backend runs on: **http://localhost:3000**

### 3. Frontend Setup (New Terminal)

```bash
cd frontend

# Create .env.local file
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Install & Run
npm install --legacy-peer-deps
npm run dev
```

✅ Frontend runs on: **http://localhost:3001**

## Login Credentials

```
Email: customer@flight.com
Password: Customer@123

OR

Email: admin@flight.com
Password: Admin@123

OR

Email: employee@flight.com
Password: Employee@123
```

## URLs

- **App:** http://localhost:3001
- **API Docs:** http://localhost:3000/api/docs

## Common Commands

### Backend
```bash
cd backend
npm install          # Install deps
npm run seed        # Seed database
npm run start:dev   # Start dev server
npm run build       # Build for production
npm start           # Run production
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps    # Install deps
npm run dev                       # Start dev server
npm run build                     # Build for production
npm start                         # Run production
```

## Reset Everything

```bash
# Backend
cd backend
rm -r node_modules package-lock.json
npm install
npm run seed
npm run start:dev

# Frontend (new terminal)
cd frontend
rm -r node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| JWT_SECRET error | Create `.env` in backend with all variables |
| Database not found | Run `psql -U postgres` then `CREATE DATABASE flight_booking_db;` |
| Port 3000 in use | `taskkill /PID <pid> /F` (Windows) or `kill -9 <pid>` (Mac/Linux) |
| Frontend can't connect | Ensure `.env.local` exists in frontend with correct API URL |
| npm install errors | Add flag: `npm install --legacy-peer-deps` |

## Tech Stack

- **Backend:** NestJS, PostgreSQL, TypeORM, JWT
- **Frontend:** Next.js 14, React 19, Tailwind CSS, Socket.io
- **Database:** PostgreSQL
