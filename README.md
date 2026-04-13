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

Requires a free **Hugging Face API token** (`HF_API_TOKEN`). See `backend/.env.example`.

```powershell
cd "C:\Kawn Sentiment Analysis\backend"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
$env:HF_API_TOKEN="hf_your_token"
uvicorn app.main:app --reload
```

**Vercel:** add `HF_API_TOKEN` in the project Environment Variables.
