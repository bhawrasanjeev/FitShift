# FitShift — Backend Service (Phase 1)

Foundational Express backend for **FitShift**, a routine-first, budget-realistic fitness and nutrition planning application.

---

## Tech Stack

- **Runtime:** Node.js (v24+)
- **Framework:** Express.js (v4+)
- **Module System:** ES Modules (`"type": "module"`)
- **Security:** Helmet
- **Cross-Origin Requests:** CORS
- **Environment Management:** dotenv
- **Testing:** Node.js Built-in Test Runner (`node:test`, `node:assert`) & Supertest
- **Development Tooling:** Nodemon

---

## Directory Structure

```text
server/
├── src/
│   ├── config/             # Environment and application configuration
│   │   └── env.js
│   ├── routes/             # API route definitions
│   │   ├── health.routes.js
│   │   └── index.js
│   ├── controllers/        # Request handling and HTTP responses
│   │   └── health.controller.js
│   ├── services/           # (Phase 2+) Domain and application operations
│   ├── algorithms/         # (Phase 2+) Fitness & nutrition calculation engines
│   ├── repositories/       # (Phase 2+) Data access logic
│   ├── middleware/         # Custom Express middleware (errors, 404, etc.)
│   │   ├── errorHandler.js
│   │   └── notFoundHandler.js
│   ├── validators/         # (Phase 2+) Request validation schemas
│   ├── utils/              # (Phase 2+) Reusable helpers and utilities
│   ├── app.js              # Express app configuration & middleware pipeline
│   └── server.js           # Server entry point & HTTP listener
│
├── data/
│   ├── raw/                # (Phase 2) Raw datasets (exercises.json, CSVs)
│   └── processed/          # (Phase 2) Cleaned/indexed data artifacts
│
├── tests/                  # Automated API smoke and integration tests
│   └── api.test.js
│
├── .env                    # Local environment variables (git-ignored)
├── .env.example            # Environment template for development
├── .gitignore              # Git ignore configuration
├── package.json            # Node.js project manifest & scripts
└── README.md               # Backend documentation
```

---

## Environment Configuration

Create a `.env` file in the `server/` directory based on `.env.example`:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port number on which the HTTP server listens | `5000` (or `5001` on macOS if AirPlay Receiver uses 5000) |
| `CLIENT_URL` | Allowed origin for CORS requests | `http://localhost:5173` |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | `development` |

> **macOS Note:** On macOS Monterey and later, port 5000 is often reserved by AirPlay Receiver (Control Center). In local development, configure `PORT=5001` in `.env` to prevent `EADDRINUSE` conflicts.

---

## Scripts

All commands should be executed from within the `server/` directory:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts server with automatic reload on changes via Nodemon |
| `npm start` | Starts the Express server in production/normal mode |
| `npm test` | Runs automated smoke and integration tests using Node's native test runner |

---

## Endpoints

### Health Check

- **URL:** `GET /api/health`
- **Description:** Verifies server connectivity and operational status without accessing datasets or calculation engines.
- **Success Response (HTTP 200):**
  ```json
  {
    "success": true,
    "message": "FitShift API is running"
  }
  ```

### Unknown Routes (404)

- **Response (HTTP 404):**
  ```json
  {
    "success": false,
    "error": {
      "message": "Route not found: GET /api/unknown"
    }
  }
  ```

### Central Error Handling (500 / custom)

- **Response (HTTP 500):**
  ```json
  {
    "success": false,
    "error": {
      "message": "Error description"
    }
  }
  ```
