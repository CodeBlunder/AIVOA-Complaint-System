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
Home Page
<img width="1916" height="1043" alt="Screenshot From 2026-10-15 15-31-06" src="https://github.com/user-attachments/assets/48e33db4-f70d-46da-8cb4-15a0f1f4af93" />

Complaint Form
<img width="1919" height="1076" alt="Screenshot From 2026-07-31 19-33-10" src="https://github.com/user-attachments/assets/93ba97fe-7add-462c-a505-d35032d5c301" />

Dashboard
<img width="1919" height="1076" alt="Screenshot From 2026-07-31 19-32-54" src="https://github.com/user-attachments/assets/5cb68a65-97c4-4f10-a5c4-a736f930f9d0" />


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


### 3. Start the frontend

In a separate terminal:

``` bash
cd frontend
npm install
npm start
```



## Notes

-   AI-generated fields and risk assessments should be reviewed by a
    qualified person before being used in real compliance decisions.
-   OCR results depend on document quality and image clarity.
-   Keep API keys in `.env` and never commit secrets to Git.
