# FitShift

> **Routine-First, Budget-Realistic Fitness & Nutrition Engine**

FitShift is an application crafted for realistic lifestyles, busy schedules, and authentic whole foods.

---

## Repository Structure

```text
FitShift/
├── client/                       # React frontend (Vite, Tailwind CSS, TypeScript)
├── server/                       # Express backend API service (Node.js, ES Modules)
│   ├── src/                      # API source code (config, routes, controllers, middleware)
│   ├── data/                     # Data directory (raw & processed datasets)
│   ├── tests/                    # Automated smoke and integration tests
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend scripts and dependencies
│   └── README.md                 # Backend documentation
└── README.md                     # Root documentation
```

---

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

The API health check endpoint will be available at `http://localhost:5000/api/health` (or `http://localhost:5001/api/health` if port 5000 is occupied).

Run tests:
```bash
npm test
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The client web app will be available at `http://localhost:5173`.
