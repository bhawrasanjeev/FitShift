# FitShift — Backend Service (Phase 5)

Foundational Express backend for **FitShift**, a routine-first, budget-realistic fitness and nutrition planning application.

---

## Tech Stack

- **Runtime:** Node.js (v24+)
- **Framework:** Express.js (v5)
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
│   ├── config/             # Environment & domain configuration
│   │   ├── env.js
│   │   ├── nutrition.config.js
│   │   └── diet.config.js
│   ├── routes/             # API route definitions
│   │   ├── health.routes.js
│   │   ├── data.routes.js
│   │   ├── nutrition.routes.js
│   │   ├── diet.routes.js
│   │   └── index.js
│   ├── controllers/        # Request handling and HTTP responses
│   │   ├── health.controller.js
│   │   ├── data.controller.js
│   │   ├── nutrition.controller.js
│   │   └── diet.controller.js
│   ├── services/           # Domain operations & dataset orchestration
│   │   ├── dataset.service.js
│   │   ├── nutrition.service.js
│   │   └── diet.service.js
│   ├── algorithms/         # Fitness & nutrition calculation engines
│   │   ├── nutrition/
│   │   │   ├── bmr.js
│   │   │   ├── tdee.js
│   │   │   ├── calorieTarget.js
│   │   │   ├── proteinTarget.js
│   │   │   └── index.js
│   │   └── diet/
│   │       ├── proteinCost.js
│   │       ├── foodFilter.js
│   │       ├── foodRanker.js
│   │       ├── optimizer.js
│   │       └── index.js
│   ├── repositories/       # In-memory cached data access layer
│   │   ├── exercise.repository.js
│   │   ├── foodPrice.repository.js
│   │   ├── cleanStaples.repository.js
│   │   └── nutrition.repository.js
│   ├── middleware/         # Custom Express middleware (errors, 404, etc.)
│   │   ├── errorHandler.js
│   │   └── notFoundHandler.js
│   ├── validators/         # Structural & input validation rules
│   │   ├── dataset.validators.js
│   │   ├── nutrition.validators.js
│   │   └── diet.validators.js
│   ├── utils/              # RFC 4180 CSV parser & file loaders
│   │   └── fileLoader.js
│   ├── app.js              # Express app configuration & middleware pipeline
│   └── server.js           # Server entry point & HTTP listener
│
├── data/
│   ├── raw/                # Source datasets (exercises.json, price.csv, nutrition.csv)
│   └── processed/          # Processed datasets (clean_staples.csv)
│
├── tests/                  # Automated unit, repository & API integration tests
│   ├── api.test.js
│   ├── fileLoader.test.js
│   ├── validators.test.js
│   ├── repositories.test.js
│   ├── dataStatusApi.test.js
│   ├── nutrition.test.js
│   └── diet.test.js
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
| `DATA_DIR` | Base directory containing raw/ and processed/ datasets | `server/data` |
| `EXERCISES_DATA_PATH` | Path to `exercises.json` | `<DATA_DIR>/raw/exercises.json` |
| `FOOD_PRICES_DATA_PATH`| Path to raw food prices CSV | `<DATA_DIR>/raw/price.csv` |
| `CLEAN_STAPLES_DATA_PATH`| Path to clean staples CSV | `<DATA_DIR>/processed/clean_staples.csv` |
| `NUTRITION_DATA_PATH` | Path to nutrition CSV | `<DATA_DIR>/raw/nutrition.csv` |

---

## Scripts

All commands should be executed from within the `server/` directory:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts server with automatic reload on changes via Nodemon |
| `npm start` | Starts the Express server in production/normal mode |
| `npm test` | Runs automated smoke, unit, repository, and integration tests |

---

## Budget Diet Optimizer (Phase 5)

FitShift's deterministic **Budget Diet Optimizer** accepts daily protein and calorie targets and generates practical, budget-aware Indian staple food plans.

### Core Mathematical & Business Rules

#### 1. Protein Cost Formula
To objectively measure affordability per unit of protein:
$$\text{cost\_per\_10g\_protein} = \left(\frac{\text{price\_per\_100g}}{\text{protein\_per\_100g}}\right) \times 10$$

Foods are ranked in ascending order of cost per 10g protein.

#### 2. Food Eligibility & Dietary Restrictions
- **`vegetarian`**: Permits Legumes, Dairy, Plant Dairy (Tofu), Nuts & Seeds, and Spreads. Excludes Meat, Fish, and Poultry (eggs).
- **`eggetarian`**: Permits all vegetarian foods plus Poultry (eggs). Excludes Meat and Fish.
- **`non_vegetarian`**: Permits all food categories including Chicken, Fish, and Liver.

#### 3. Supplement Rules
- **`no_supplements`**: Strictly excludes whey protein and supplement products; fulfills protein via whole foods.
- **`open_to_supplements`**: Considers whey protein within normal serving limits (1–2 scoops max).
- **`unsure`**: Ranks whole foods ahead of supplements, using supplements only if whole foods cannot satisfy the target within budget.

#### 4. Soya Safety Rules
- **Maximum dry soya:** Hard engineering ceiling of **50g/day**.
- **No duplicate soya products:** Soya Chunks and Soya Granules are never combined on the same day.

#### 5. Staple Carbohydrate Exclusion Rule
Raw staple carbohydrates (`Grains` such as wheat atta, rice, dalia, poha; `Tubers` such as potatoes; `Fruits` such as bananas) are excluded from the concentrated protein optimization pool.

#### 6. Feasibility & Transparency
- If the protein target can be achieved within the user's budget: returns `feasible: true`, `gapGrams: 0`.
- If the budget is insufficient: returns `feasible: false` with the honest `achievedGrams`, `gapGrams`, `estimatedCost`, and an explanatory `reason`.

### Distinction of Rules & Assumptions

| Dimension | Type | Description |
| :--- | :--- | :--- |
| **BMR / TDEE** | Nutrition Formula | Mifflin-St Jeor equation and standard physical activity multipliers. |
| **Calorie / Protein Adjustments** | Project Rule / Assumption | Goal adjustments (+300 / -400 / 0 kcal) and protein multipliers (1.7 / 1.9 / 1.5 g/kg) are FitShift design assumptions, not clinical prescriptions. |
| **Soya Limit (50g)** | Engineering Constraint | Imposed to prevent excessive single-source soya reliance in daily diets. |
| **Serving Sizes (Min/Max)** | Engineering Constraint | Bounds (e.g. 50–100g dal, 250–500ml milk, 2–6 eggs) to ensure practical real-world intake. |
| **Food Prices & Protein Densities** | Dataset-Derived | Cleaned Indian market benchmarks loaded from `clean_staples.csv`. |

---

## API Endpoints

### 1. Health Check
- **URL:** `GET /api/health`
- **Response (HTTP 200):** `{"success": true, "message": "FitShift API is running"}`

### 2. Dataset Status
- **URL:** `GET /api/data/status`
- **Response (HTTP 200):** Reports validation status of exercises, food prices, clean staples, and nutrition datasets.

### 3. Nutrition Engine Calculation (Phase 4)
- **URL:** `POST /api/nutrition/calculate`
- **Request Body:**
  ```json
  {
    "age": 22,
    "gender": "male",
    "heightCm": 178,
    "weightKg": 70,
    "goal": "muscle_gain",
    "activityLevel": "moderate"
  }
  ```
- **Response (HTTP 200):**
  ```json
  {
    "success": true,
    "data": {
      "bmr": 1708,
      "tdee": 2647,
      "goal": "muscle_gain",
      "calorieTarget": 2947,
      "proteinTargetGrams": 119,
      "activityLevel": "moderate"
    }
  }
  ```

### 4. Budget Diet Optimizer (Phase 5)
- **URL:** `POST /api/diet/optimize`
- **Request Body:**
  ```json
  {
    "nutrition": {
      "calorieTarget": 2947,
      "proteinTargetGrams": 119
    },
    "dietType": "vegetarian",
    "foodBudget": 80,
    "supplementPreference": "no_supplements"
  }
  ```
- **Success Response — Feasible Plan (HTTP 200):**
  ```json
  {
    "success": true,
    "data": {
      "feasible": true,
      "budget": {
        "dailyLimit": 80,
        "estimatedCost": 79
      },
      "protein": {
        "targetGrams": 119,
        "achievedGrams": 120,
        "gapGrams": 0
      },
      "foods": [
        {
          "name": "Soya Chunks",
          "quantityGrams": 50,
          "estimatedCost": 7,
          "proteinGrams": 26
        },
        {
          "name": "Kala Chana",
          "quantityGrams": 100,
          "estimatedCost": 10,
          "proteinGrams": 20
        },
        {
          "name": "Yellow Moong Dal (Raw)",
          "quantityGrams": 100,
          "estimatedCost": 13,
          "proteinGrams": 24
        },
        {
          "name": "Chana Sattu",
          "quantityGrams": 60,
          "estimatedCost": 9,
          "proteinGrams": 15
        },
        {
          "name": "Raw Peanuts",
          "quantityGrams": 50,
          "estimatedCost": 8,
          "proteinGrams": 13
        },
        {
          "name": "Double Toned Milk",
          "quantityGrams": 500,
          "estimatedCost": 27,
          "proteinGrams": 17
        },
        {
          "name": "Roasted Chana (Bhuna)",
          "quantityGrams": 30,
          "estimatedCost": 5,
          "proteinGrams": 6
        }
      ]
    }
  }
  ```
- **Partial Plan — Insufficient Budget (HTTP 200):**
  ```json
  {
    "success": true,
    "data": {
      "feasible": false,
      "budget": {
        "dailyLimit": 30,
        "estimatedCost": 29
      },
      "protein": {
        "targetGrams": 119,
        "achievedGrams": 66,
        "gapGrams": 53
      },
      "foods": [
        {
          "name": "Soya Chunks",
          "quantityGrams": 50,
          "estimatedCost": 7,
          "proteinGrams": 26
        },
        {
          "name": "Kala Chana",
          "quantityGrams": 100,
          "estimatedCost": 10,
          "proteinGrams": 20
        }
      ],
      "reason": "Protein target cannot be reached within the provided budget using the available foods."
    }
  }
  ```

---

## Architectural Separation & Future Pipeline

The Budget Diet Optimizer consumes the nutrition targets from Phase 4 and datasets from Phase 3:

```text
User Input / Onboarding
         ↓
  Nutrition Engine (Phase 4)
  [BMR, TDEE, Calorie Target, Protein Target]
         ↓
  Budget Diet Optimizer (Phase 5)
  [Staples & Nutrition Datasets, Price/Protein Ratios, Soya & Serving Rules]
         ↓
  Final Customized Meal & Routine Plan (Future Phase)
```
