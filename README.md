# AIVOA – AI-Powered Customer Complaint Management System

AIVOA is an AI-powered complaint management system built for pharmaceutical companies to simplify the process of logging and managing customer complaints.

Instead of manually filling lengthy complaint forms, users can describe the issue in plain English, upload a complaint document, or edit an existing complaint using natural language. The AI extracts the required information, fills the complaint form, and generates a basic risk assessment to assist quality teams.

## Features

- AI-powered complaint logging
- Extract complaint details from PDFs, DOCX files, and images
- Edit complaints using natural language
- Automatic AI-based risk assessment
- Complaint management dashboard

## Tech Stack

**Frontend**
- React
- Redux Toolkit
- Tailwind CSS

**Backend**
- FastAPI
- PostgreSQL
- SQLAlchemy

**AI**
- LangGraph
- LangChain
- Groq (Llama 3.3)

## Getting Started

### Backend

```bash
cd backend

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

npm install
npm start
```

## Environment Variables

Create a `.env` file inside the `backend` folder.

```env
DATABASE_URL=your_database_url
GROQ_API_KEY=your_groq_api_key
```


