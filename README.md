# 🌱 CarbonShield Companion
### Carbon-Aware AI Computing Platform · SUSTAINATHON26

**CarbonShield Companion** is a responsive, sustainability-focused web frontend for carbon-aware AI workload scheduling and compute telemetry. It enables machine learning engineers and enterprise teams to eliminate up to **75% of operational AI compute emissions** by shifting flexible batch tasks (LLM summarization, vector indexing, fine-tuning) into cleaner renewable energy windows on regional power grids.

---

## 🎨 Visual Identity & Design System
- **Background**: Crisp clean white and slate foundation (`bg-slate-50`, `bg-white`).
- **Color Palette**: Dark green (`#064e3b` / `emerald-900`), forest emerald (`emerald-700` / `emerald-800`), and clean teal accents (`teal-700` / `teal-800`).
- **Cards & Structure**: Generously rounded cards (`rounded-2xl`, `rounded-3xl`), subtle slate borders (`border-slate-200/90`), and soft elevation shadows (`shadow-xs`).
- **Typography**: Plus Jakarta Sans for clean readability and JetBrains Mono for telemetry codes.
- **Navigation**: Persistent left sidebar with active route highlighting, user profile chip, and live grid intensity indicator.

---

## 🚀 Key Pages & Features

1. **Home Dashboard (`/dashboard`)**
   - Contextual welcome header with user profile (`Elena Rostova`) and active cluster status.
   - 4 Top KPI cards: Green Points balance & tier progress, Carbon saved in gCO₂e (14,200 gCO₂e), Estimated compute cost saved ($148.60), and Current grid carbon intensity (142 gCO₂/kWh).
   - Green Rewards milestone banner with instant claim action.
   - Interactive **Baseline vs. Optimized Impact Chart** comparing daily unmanaged emissions against CarbonShield scheduled runs.
   - Real-time 24-hour **Grid Carbon Intensity Forecast** highlighting upcoming green windows.
   - Recent AI Tasks table with live status badges.

2. **Submit AI Task (`/submit`)**
   - Task configuration form with quick-fill sample presets (Batch PDF Summarization, Vector DB Embeddings, Codebase Security Audit, Real-time Diagnostics).
   - Priority toggle (**Flexible** for green window queuing vs. **Urgent** for immediate SLA).
   - Model quality preference (**Standard Eco INT4/INT8** vs. **High Fidelity FP16**).
   - Deadline and maximum permitted delay selectors (2h, 6h, 8h, 12h, 24h).
   - **"Generate Recommended Plan"** button with realistic marginal grid optimization engine.
   - Detailed recommendation card showing proposed model, execution window, estimated energy, emissions reduction %, cost, and carbon rationale.
   - **Confirm & Schedule** and **Override Immediate Run** controls.

3. **My Tasks (`/tasks`)**
   - Full task history with real-time text search and multi-criteria filters (Status: All, Scheduled, Deferred, Running, Completed; Priority: Flexible, Urgent).
   - Granular telemetry table displaying models, cloud regions, execution windows, and gCO₂e avoided.
   - Interactive task details modal with full scheduling rationale and instant "Run Now" or "Cancel" actions.

4. **Green Points & Rewards (`/points`)**
   - Balance counter and tier progression track: *Seedling → Eco Pioneer (Current) → Carbon Guardian → Climate Champion*.
   - Activity ledger recording points earned from green scheduling, quantized model selection, and streak bonuses.
   - Rewards Marketplace with redeemable perks: $25 Cloud Compute Vouchers, 5 Mangrove Trees Planted, Certified Eco-Engineer credential, and API credits.
   - Interactive redemption modal generating unique claim codes and updating point balance.

5. **Company Analytics (`/analytics`)**
   - Organization-wide metrics: 1,420 kg CO₂ avoided (-44.2%), 18,450 kWh saved, 48 active engineers.
   - 6-month monthly baseline vs. optimized emission trends.
   - Model usage breakdown across Llama-3-8B, Claude 3.5 Sonnet, Gemini Flash, and Mistral.
   - Department green adoption rates (Applied ML 94%, Data Eng 88%, Core Platform 76%).
   - Engineer leaderboard with impact rankings and badges.

6. **Regional Grid Status (`/grid`)**
   - Real-time regional telemetry for EU-West (Ireland), US-East (N. Virginia), US-West (Oregon), EU-Central (Frankfurt), and AP-South (Mumbai).
   - 24-hour continuous carbon intensity curve highlighting optimal green windows.
   - Live generation mix breakdown (Wind, Solar, Hydro, Nuclear, Natural Gas, Coal).
   - Data attribution documenting Marginal Operating Emissions Rate (MOER).

7. **Settings & Backend API (`/settings`)**
   - Engineer profile details (name, email, role, department, default cloud region).
   - Automated carbon-aware scheduling preferences (auto-defer threshold, quantization consent, Slack notifications).
   - **Backend API Integration Layer**: Base URL input, connection health probe (`/api/v1/health`), and one-click toggle between isolated Demo Mode and Live FastAPI Backend.
   - Complete FastAPI endpoint reference documentation.

---

## ⚡ Backend Integration Architecture

The frontend is built to communicate with a **Python FastAPI + MongoDB + Supabase** backend:

- **Isolated Demo Mode**: To prevent presenting simulated carbon savings as real physical measurements, the frontend runs in an isolated Demo Mode by default with realistic simulation data.
- **Zero Fake Integrations**: No dummy Node.js server or mock servers are introduced.
- **FastAPI API Service Layer** (`src/services/api.js`):
  ```
  VITE_API_BASE_URL (Default: http://localhost:8000)
  ├── GET  /api/v1/health
  ├── GET  /api/v1/dashboard/metrics
  ├── GET  /api/v1/grid/regions
  ├── GET  /api/v1/grid/forecast?region={region_id}
  ├── GET  /api/v1/tasks
  ├── POST /api/v1/tasks/recommend
  ├── POST /api/v1/tasks
  ├── GET  /api/v1/points
  ├── POST /api/v1/points/redeem
  └── GET  /api/v1/analytics
  ```

---

## 🛠️ Local Development & Build

```bash
# Navigate to project directory
cd carbonshield-companion

# Start development server
npm run dev

# Run production build
npm run build
```
Production builds bundle via Vite and Tailwind CSS v4 in under **800ms**.
