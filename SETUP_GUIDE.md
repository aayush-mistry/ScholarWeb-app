# ScholarWeb - Project Setup & Getting Started

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18+ 
- **npm** v9+
- **MongoDB** (optional - app runs in demo mode if unavailable)

### Installation

#### 1. Clone & Navigate
```bash
cd ScholarWeb-app
```

#### 2. Setup Client
```bash
cd client
npm install
cp .env.example .env.development
npm run dev
```

Client will be available at **http://localhost:3000**

#### 3. Setup Server
```bash
cd ../server
npm install
cp .env.example .env
npm run dev
```

Server will run on **http://localhost:5001**

---

## 📋 Environment Variables

### Client (`client/.env.development`)
```env
VITE_API_URL=http://localhost:5001
VITE_ENVIRONMENT=development
```

### Server (`server/.env`)
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/scholarweb
GEMINI_API_KEY=your_key_here
JWT_SECRET=your_secret_here
YOUTUBE_API_KEY=your_key_here
```

---

## 📁 Project Structure Overview

```
ScholarWeb-app/
├── client/
│   ├── src/
│   │   ├── services/        ✅ API layer (NEW)
│   │   ├── hooks/           ✅ Custom React hooks (NEW)
│   │   ├── utils/           ✅ Helper functions (NEW)
│   │   ├── components/      ✅ Reusable components
│   │   ├── pages/           ✅ Page components
│   │   └── context/         ✅ Global state
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/     ✅ All 4 controllers (NEW: video, guard, exam)
│   │   ├── routes/          ✅ All 5 routes (NEW: video, guard, exam)
│   │   ├── models/          ✅ Database schemas
│   │   ├── services/        ✅ Business logic
│   │   └── app.js           ✅ Express setup
│   └── package.json
│
└── .env files               ✅ Configuration (NEW)
```

---

## ✨ Features Status

### ✅ Implemented
- Dashboard HUD with real-time stats
- ScholarDNA upload & parsing  
- Knowledge graph visualization
- UI with glassmorphism design
- Context-based state management
- API service layer
- Custom hooks
- Utility functions

### 🔄 In Development (Mock Data Ready)
- Video analysis & transcript extraction
- Fact-checking with misinformation guard
- Exam tracker & revision planning
- Syllabus-aware search

### ⚠️ Todo Implementations
- Real YouTube transcript extraction (via youtube-transcript library)
- Gemini-based fact checking & quiz generation
- MongoDB integration for persistence
- JWT authentication
- File upload handling for documents

---

## 🔧 API Endpoints

### DNA Management
- `POST /api/dna/upload` - Upload syllabus & generate ScholarDNA
- `GET /api/dna/:id` - Fetch DNA profile
- `PATCH /api/dna/:id/nodes/:nodeId` - Update node mastery

### Search
- `GET /api/search` - Syllabus-aware search

### Video (NEW)
- `POST /api/video/analyze` - Analyze video
- `POST /api/video/transcript` - Extract transcript
- `GET /api/video/:id/quiz` - Generate quiz

### Guard (NEW)
- `POST /api/guard/verify` - Verify claims
- `POST /api/guard/batch-verify` - Batch verify

### Exam (NEW)
- `POST /api/exam/:dnaId/schedule` - Create exam schedule
- `GET /api/exam/:dnaId/revision-plan` - Get revision plan
- `GET /api/exam/:dnaId/study-tasks` - Get study tasks

---

## 🧪 Testing

### Run Client Dev Server
```bash
cd client
npm run dev
```

### Run Server Dev Server
```bash
cd server
npm run dev
```

### Build for Production
```bash
# Client
cd client && npm run build

# Server
cd server && npm start
```

---

## 🐛 Common Issues & Fixes

### "Cannot find module" errors
```bash
cd client && npm install
cd ../server && npm install
```

### API calls failing
- Ensure server is running on `http://localhost:5001`
- Check `VITE_API_URL` in client `.env.development`

### Database connection warnings
- App runs in demo mode if MongoDB is unavailable
- Optional: Install MongoDB locally or use MongoDB Atlas

---

## 📚 Key Files to Understand

- **Frontend Services**: `client/src/services/*.js`
- **Custom Hooks**: `client/src/hooks/*.js`
- **Utilities**: `client/src/utils/*.js`
- **Backend Routes**: `server/src/routes/*.js`
- **Backend Controllers**: `server/src/controllers/*.js`

---

## 📝 Next Steps

1. Install dependencies
2. Set up environment variables
3. Start client & server dev servers
4. Upload a syllabus PDF to test DNA generation
5. Explore pages: Dashboard, Graph, Video, Guard, Tracker
6. Implement missing TODOs (marked with `// TODO` comments)

---

## 🚀 Production Deployment

### Vercel (Frontend)
```bash
npm run build
# Push to Vercel
```

### Heroku/Railway (Backend)
```bash
git push heroku main
```

Set environment variables in hosting dashboard

---

## 💡 Hackathon Tips

✅ **Working offline**: App uses localStorage fallback with mock data  
✅ **Fast iteration**: Hot reload on both client & server  
✅ **Database optional**: Gemini API and PDFs work without MongoDB  
✅ **UI polished**: Tailwind + Framer Motion for futuristic look  

**Good luck with your hackathon! 🎉**
