# StaffSync

A modern Employee Management and Attendance Tracking System.

![StaffSync](https://img.shields.io/badge/StaffSync-1.0-00B4DB)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791)

## 🌐 Live Demo

- **Frontend**: https://97rohit.github.io/staffsync
- **Backend API**: https://hrms-lite-api-08mz.onrender.com
- **API Docs**: https://hrms-lite-api-08mz.onrender.com/docs

## 📋 Features

### Core Features
- ✅ **Team Management**
  - Add new team members (ID, Name, Email, Department)
  - View all employees in a card grid
  - Remove team members with confirmation

- ✅ **Check-in Tracking**
  - Mark daily check-ins (Present/Absent)
  - View check-in history
  - Filter by date range

- ✅ **Overview Dashboard**
  - Team size overview
  - Today's check-in summary
  - Department breakdown
  - Recent activity feed

### Technical Features
- RESTful API with proper status codes
- Server-side validation (required fields, email format, duplicates)
- Meaningful error messages
- Loading, empty, and error states in UI
- Responsive design

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Styling | Vanilla CSS |

## 📁 Project Structure

```
staffsync/
├── backend/
│   ├── routes/
│   │   ├── employees.py
│   │   ├── attendance.py
│   │   └── dashboard.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 🚀 Local Development Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (or SQLite for local testing)

### 1. Clone the Repository
```bash
git clone https://github.com/97Rohit/staffsync.git
cd staffsync
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```
Backend will be running at: http://localhost:8000

API Docs available at: http://localhost:8000/docs

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
Frontend will be running at: http://localhost:5173

## 📡 API Endpoints

### Team
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | Get all team members |
| GET | /api/employees/{id} | Get single team member |
| POST | /api/employees | Create new team member |
| DELETE | /api/employees/{id} | Remove team member |

### Check-ins
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/attendance | Get all check-ins (supports date filters) |
| GET | /api/attendance/employee/{id} | Get member's check-ins |
| POST | /api/attendance | Mark check-in |

### Overview
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard/stats | Get overview statistics |

## ⚠️ Notes

1. **Single User Mode**: No authentication (as per requirements)
2. **Focus**: Employee and attendance management only
3. **Date Format**: Check-in dates are in YYYY-MM-DD format

## 👤 Author

Built for Ethara AI Technical Assessment
