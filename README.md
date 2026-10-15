# AIVOA -- AI-Powered Complaint Management

AIVOA is a full-stack application that helps pharmaceutical teams log
and manage customer complaints using AI-powered form filling, document
extraction, and risk assessment.

## Features

-   **AI complaint logging:** Turn a plain-language description into
    structured complaint details.
-   **Document extraction:** Extract complaint information from uploaded
    documents and images.
-   **AI-assisted editing:** Update complaint fields using
    natural-language instructions.
-   **Risk assessment:** Generate a risk score, severity level,
    root-cause suggestion, CAPA recommendation, and regulatory-reporting
    flag.
-   **Complaint management:** Create, view, update, and delete
    complaints.

## Screenshots

Add your four application screenshots to a `screenshots/` folder in the
repository and use these filenames (or update the paths below):

  ---------------------------------------------------------------------------------
  Dashboard                                 Complaint form
  ----------------------------------------- ---------------------------------------
  ![Dashboard](screenshots/dashboard.png)   ![Complaint
                                            form](screenshots/complaint-form.png)

  ---------------------------------------------------------------------------------

  ----------------------------------------------------------------------------------
  AI tools                            Risk assessment
  ----------------------------------- ----------------------------------------------
  ![AI                                ![Risk
  tools](screenshots/ai-tools.png)    assessment](screenshots/risk-assessment.png)

  ----------------------------------------------------------------------------------

## Tech Stack

-   **Frontend:** React, Redux Toolkit, Tailwind CSS, Axios
-   **Backend:** Python, FastAPI
-   **AI:** LangGraph, Groq
-   **Database:** PostgreSQL, SQLAlchemy, Alembic
-   **Document processing:** pypdf, python-docx, pytesseract, Pillow

## Run Locally

### Prerequisites

Install Node.js, Python, PostgreSQL, and a Groq API key. For image OCR,
install Tesseract OCR.

### 1. Configure the database

Create a PostgreSQL database named `aivoa_complaints`, then configure
the database URL in `backend/.env`.

### 2. Start the backend

``` bash
cd backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
# venv\Scripts\activate

pip install -r requirements.txt
```

Create `backend/.env` with your configuration:

``` env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/aivoa_complaints
GROQ_API_KEY=your_groq_api_key
```

Start the API:

``` bash
uvicorn app.main:app --reload
```

API documentation: http://localhost:8000/docs

### 3. Start the frontend

In a separate terminal:

``` bash
cd frontend
npm install
npm start
```

Open http://localhost:3000.

## Notes

-   AI-generated fields and risk assessments should be reviewed by a
    qualified person before being used in real compliance decisions.
-   OCR results depend on document quality and image clarity.
-   Keep API keys in `.env` and never commit secrets to Git.

## Author

Built by **\[Your Name\]** for the AIVOA AI Product Engineer (Intern)
assignment.
