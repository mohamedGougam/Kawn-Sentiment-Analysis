# Kawn Sentiment Analysis

Presentation-ready sentiment demo with:

- `frontend/`: Next.js, TypeScript, Tailwind CSS, Framer Motion
- `backend/`: FastAPI, Hugging Face Transformers

## Run frontend

```powershell
cd "C:\Kawn Sentiment Analysis\frontend"
npm install
npm run dev
```

## Run backend

```powershell
cd "C:\Kawn Sentiment Analysis\backend"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
