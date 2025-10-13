# FitLifeTracker - Health & Fitness Dashboard

A comprehensive health and fitness tracking platform built with the PERN stack (PostgreSQL, Express.js, React, Node.js).

## Team: Apex Fitness Solutions

### Team Members:
- Sanjay Rekandar (Project Manager & Full-Stack Lead)
- Lohith (Frontend Developer & UI/UX Designer)
- Manish (Backend Developer & Database Architect)
- Sai Kumar (DevOps Engineer & QA Specialist)

## Project Structure

\\\
FitLifeTracker/
├── backend/          # Node.js/Express.js API
├── frontend/         # React.js application
├── database/         # Database scripts and migrations
├── docs/            # Project documentation
├── deployments/     # Deployment configurations
└── scripts/         # Utility scripts
\\\

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Development Setup

1. **Clone and setup:**
   \\\ash
   cd FitLifeTracker
   \\\

2. **Backend setup:**
   \\\ash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run dev
   \\\

3. **Frontend setup:**
   \\\ash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   \\\

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Docker Development
\\\ash
docker-compose up --build
\\\

## Technology Stack

- **Frontend:** React.js, Vite, CSS3
- **Backend:** Node.js, Express.js, JWT
- **Database:** PostgreSQL, Sequelize ORM
- **Deployment:** Vercel (Frontend), Render (Backend)

## Features

- 📊 Fitness Dashboard
- 🍎 Nutrition Tracking
- 💪 Workout Logging
- 📈 Progress Analytics
- 🔐 User Authentication
- 📱 Responsive Design

## Development Phases

1. **Phase 1:** Project Initiation & Planning ✓
2. **Phase 2:** UI/UX Design & Prototyping
3. **Phase 3:** Core Development
4. **Phase 4:** Testing & QA
5. **Phase 5:** Deployment & Presentation
