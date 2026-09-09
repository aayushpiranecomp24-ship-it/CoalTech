# Coaltech
### AI-Powered Smart Governance, Compliance & Risk Intelligence Platform for Coal Mines

Coaltech is a centralized, closed-loop governance platform designed for coal mines. It addresses fragmented reporting, compliance gaps, and safety coordination barriers across organizational hierarchies—from on-site workers to area managers, safety inspectors, and corporate operations executives.

---

## 🚀 Getting Started

The platform is built using React 18, Vite, TypeScript, and Tailwind CSS. The local server is actively running in the workspace.

### Running Locally
To run or preview the project manually:
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your web browser.

---

## 🔑 Demo Access Credentials

The login screen features **Demo Quick Logins** for immediate access. For reference, here are the seeded accounts:

| Role Profile | Name | Demo Login Email | Scope / Area |
| :--- | :--- | :--- | :--- |
| **Coal Mine Manager** | Rajesh Kumar | `corporate@coaltech.in` | Corporate (All Areas) |
| **Area Manager** | Amitabh Sen | `area.north@coaltech.in` | North Area (Jharia) |
| **Mine Head** | Sanjay Sharma | `head.mine.a@coaltech.in` | Jharia Deep Mine A |
| **Safety Officer** | Sunil Patil | `safety.mine.a@coaltech.in` | Jharia Deep Mine A |
| **Inspector** | Devendra Joshi | `inspector@coaltech.in` | Statutory Board |
| **Environment Officer** | Vikram Singh | `env.mine.a@coaltech.in` | Jharia Deep Mine A |
| **Corrective Officer** | Rahul Verma | `corrective.mine.a@coaltech.in` | Jharia Deep Mine A |
| **Contractor Manager** | Pankaj Gupta | `contractor@abcmining.in` | ABC Mining Services |
| **Worker** | Anil Yadav | `anil.yadav@coaltech.in` | Jharia Deep Mine A |
| **Regulatory Authority** | Dr. Satish Deshmukh | `regulator@dgms.gov.in` | DGMS Regulatory Board |

---

## 🛠️ Sandbox Demo Scenarios

The platform includes a **Sandbox Demo Controls** panel on the right sidebar of the desktop interface to showcase the platform's features:

### Scenario 1: Closed-Loop Corrective Action
- **Step 1**: Click *"1. Worker reports electrical hazard"*. Dispatches a critical water logged report near transformer in Zone 4. Risk score becomes **87 (CRITICAL)**.
- **Step 2**: Click *"2. Assign Rahul Verma"*. Dispatches task to corrective officer with 24h deadline.
- **Step 3**: Click *"3. Submit Action Proof"*. Simulates repairs completion and uploads before/after photo evidence.
- **Step 4**: Click *"4. Inspector Rejects"*. Simulates safety inspector Devendra Joshi rejecting the work due to dampness, shifting the status to `REWORK_REQUIRED` and keeping the risk high.
- **Step 5**: Click *"5. Correct Rework & Resubmit"*. Resolves the dampness issues and uploads new proof.
- **Step 6**: Click *"6. Approve Closure & Anchor"*. Inspector approves the closure. Status changes to `CLOSED`, mine risk level decreases, and the transaction is anchored to the permissioned blockchain ledger.

### Scenario 2: Multilingual Hindi Voice reporting
- Click *"Simulate Hindi Speech Report"*. Simulates on-site voice recording in Hindi (*"मशीन के पास पानी जमा है..."*), translates it, and auto-populates the worker reporting form with structured hazard variables.

### Scenario 3: Offline PWA Queue
- Click *"Go Offline"* to simulate a network outage. Go to the worker portal, submit a safety report, and verify it gets queued locally. Click *"Sync Queue"* to restore connection and sync the report with the central AI Risk engine.

### Scenario 4: Escalation SLA Breaches
- Click *"Simulate SLA Deadline Breach"* to simulate a deadline violation. The system automatically escalates the critical alert to successive operational levels (Mine Head → Area Manager → Coal Mine Manager).

---

## 📂 Project Architecture

```
/sih-2026
├── src
│   ├── components
│   │   ├── common/                # Header, Sidebar, StatCard, DemoControlPanel, NotificationDrawer
│   │   └── GisMap.tsx             # Vector SVG GIS Hotzone coordinates map
│   ├── context
│   │   ├── GovernanceContext.tsx  # Central state manager (11 roles, CRUD, SLA, audits)
│   │   └── I18nContext.tsx        # Bilingual (English/Hindi) state provider
│   ├── data
│   │   ├── seedData.ts            # Enterprise dataset (mines, users, workers, contractors, etc.)
│   │   └── i18nDictionaries.ts   # English and Hindi localization dictionaries
│   ├── features
│   │   ├── ai/                    # AI Risk Engine vs. Deterministic Rule Engine, RAG
│   │   ├── audit/                 # Tamper-Evident Blockchain Ledger & SHA-256 Verifier
│   │   ├── compliance/            # Statutory Compliance Register & CMR 2017 Mandates
│   │   ├── contractors/           # Contractor Risk Scorecard & Payment Clearance Holds
│   │   ├── correctiveActions/     # 7-Step Closed Loop Remediation Pipeline Visualizer
│   │   ├── environment/           # IoT Telemetry Monitoring (CH4, Dust, SPM, Water pH)
│   │   ├── finance/               # Financial Penalties & Statutory Payment Locks
│   │   ├── gis/                   # Vector Spatial Map & Hotzone Risk Overlays
│   │   ├── incidents/             # Field Hazards, Violations & Root-Cause Logs
│   │   ├── inspections/           # Field Inspection Registry & Sweep Logs
│   │   ├── notifications/         # Multi-Channel Alert Center (In-App, SMS, WhatsApp)
│   │   ├── reports/               # Statutory PDF/CSV Export & Document AI OCR Scanning
│   │   ├── settings/              # SLA Timelines & AI Scoring Weight Configuration
│   │   └── workforce/             # Labour Welfare, Roster, Training & Grievances
│   ├── layouts
│   │   └── MainLayout.tsx         # Enterprise responsive desktop shell with sidebar & header
│   ├── pages
│   │   ├── DashboardPage.tsx      # Multi-Role Executive Command Center
│   │   ├── LoginPage.tsx          # 11-Role Quick Selector & MFA Simulator
│   │   ├── MineOverviewPage.tsx   # Sector directory across areas & production capacity
│   │   └── MobileWorkerPage.tsx   # High-fidelity smartphone emulator with offline sync & voice
│   ├── services
│   │   ├── aiRiskService.ts       # Predictive 0-100 risk calculation
│   │   ├── ruleEngineService.ts   # Deterministic statutory rule enforcement (CMR 2017)
│   │   ├── ocrService.ts          # Document AI OCR parser for statutory certificates
│   │   ├── notificationService.ts # In-App, SMS, Email, Voice, WhatsApp dispatcher
│   │   ├── auditBlockchainService.ts # SHA-256 recursive cryptographic chaining
│   │   └── offlineSyncService.ts  # Local queue & background synchronization
│   ├── types
│   │   └── index.ts               # Strict TypeScript definitions for all statutory domains
│   ├── utils
│   │   ├── hashChain.ts           # SHA-256 cryptographic hashing & chain validator
│   │   ├── formatters.ts          # Date, currency, severity badge utilities
│   │   └── exportUtils.ts         # CSV export and print helpers
│   ├── App.tsx                    # Root routing container
│   ├── main.tsx                   # Application bootstrap
│   └── index.css                  # Tailwind CSS import & typography
├── vite.config.ts                 # Vite + React configuration
├── tsconfig.json & tsconfig.app.json # Strict TypeScript configuration
└── package.json                   # Dependencies
```
