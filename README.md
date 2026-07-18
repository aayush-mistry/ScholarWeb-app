# ScholarWeb: AI-Powered Educational Operating System

ScholarWeb is a modern educational operating system designed to synthesize course syllabi, textbooks, and past exam papers into an interactive, personalized cognitive blueprint called **ScholarDNA**. 

The system leverages **Google Gemini AI** for structured mapping and is wrapped in a premium, high-tech dark slate visual theme accented with neon lime green and sky cyan details.

---

## 🚀 Core Features & Modules

### 1. ScholarDNA Upload Engine
* **Multiphase Ingestion**: Ingests syllabus PDFs, past year questions (PYQs), and lecture notes.
* **Topic Weight Extraction**: Automatically matches syllabus topics to past exam occurrences to calculate priority percentages.
* **Prerequisite Mapping**: Uses Gemini to build parent-child logical dependency edges between course concepts.

### 2. Syllabus-Aware Content Search
* **Contextual Relevancy Ranks**: Searches web, YouTube, and Wikipedia sources, ranking results by exam importance and student mastery gaps.
* **Integrity Shield Lock**: Slides down a glowing red alert lock panel blocking out-of-syllabus queries (e.g. travel, food, games) to prevent study distractions.
* **Quick Sync Mastery**: Enables students to log progress, instantly updating the global sync telemetry indices.

### 3. Live Knowledge Graph
* **React Flow Networks**: Maps course topics to custom circular nodes featuring circular SVG progress rings.
* **Glow Halos & Edge Feeds**: Nodes are color-coded by understanding level:
  * **Completely Understood** (Neon Green glow, >= 80% mastery)
  * **Partially Understood** (Neon Yellow/Amber glow, 30-79% mastery)
  * **Not Understood** (Neon Red glow, < 30% mastery)
* **Animated Connections**: dashed paths represent flowing conceptual signals between prerequisites.
* **Understanding Toggles**: Right-hand telemetry panel lets users classify understanding to update visual progress rings and status colors on the fly.

### 4. Video Lecture Analyzer
* **Timeline Seeks**: Syncs transcript timestamps to seek playheads for interactive video indexing.
* **Syllabus Unit Grids**: Maps video timelines to specific units and topics in the active ScholarDNA.
* **Markdown Study Guides**: Generates and downloads detailed lecture notes, takeaways, and equations as `.md` files.
* **Syllabus Check Quizzes**: Interactive questions dynamically reward topic mastery on completion.

### 5. Truth Integrity Guard
* **Factual Auditing**: Checks pasted text or uploaded files against the textbook facts stored in the active ScholarDNA.
* **Animated Underline Highlighter**: 
  * *Pulsing Green Underline*: Represents verified, fact-accurate text.
  * *Vibrating Red Underline*: Alerts the student to misinformation, showing detailed reference corrections.

### 6. Exam Countdown & Tracker
* **Countdown Clock**: Dynamic exam deadlines linked directly to syllabus modules.
* **AI Prioritized Docket**: Generates checklist tasks prioritized by `Days Remaining / Mastery %`. Checking tasks dynamically increments node mastery.

---

## 📁 Repository Structure

```text
ScholarWeb-app/
├── client/                     # Frontend: React + Vite + Tailwind CSS
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable HUD & Graph elements
│   │   ├── context/            # ScholarDNA state provider
│   │   ├── layouts/            # Sidebar, Topbar HUD scaffolding
│   │   ├── pages/              # 6 Active Operating views
│   │   └── index.css           # Global theme variables & scrollbars
│   ├── tailwind.config.js      # Custom theme color mappings & glows
│   └── package.json
│
└── server/                     # Backend: Node.js + Express + Mongoose
    ├── src/
    │   ├── config/             # DB configurations
    │   ├── controllers/        # Request handling logic
    │   ├── models/             # Mongoose schemas (User, ScholarDNA, etc.)
    │   ├── routes/             # RESTful API route declarations
    │   └── services/           # PDF parsers & Gemini SDK pipeline
    └── package.json
```

---

## 🛠️ Setup & Local Installation

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** (running locally on port 27017 or Atlas connection string)

### Step 1: Install Dependencies
Navigate to the root directory `ScholarWeb-app` and install monorepo dependencies:
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the server folder (`/server`) and add your configurations:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/scholarweb
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(Note: If no Gemini API key is configured, the server automatically defaults to high-fidelity simulated parsing pipelines, keeping the system fully functional for demo purposes.)*

### Step 3: Run Dev Servers
Start the Express backend and Vite frontend concurrently:
```bash
# Run server
npm run dev --workspace=server

# Run client (In another terminal or inside client folder)
cd client
npm run dev
```

---

## 🎨 Visual Design Guidelines
* **Primary Accent Color**: Neon Lime Green (`#A3E635`), used for high-impact calls-to-action, active indices, and highlights.
* **Secondary Accent Color**: Sky Cyan (`#00F0FF`), used for secondary details, edges, and progress trackers.
* **Backdrop Surface**: Solid dark slate (`#07080A` background with `#0F1118` cards) utilizing a clean `1.5rem` (`rounded-2xl`) border-radius and thin borders to ensure a premium visual layout.
