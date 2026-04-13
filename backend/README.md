# Kawn Sentiment Analysis Backend

FastAPI service for live sentiment analysis using Hugging Face Transformers.

## Run locally

```powershell
cd "C:\Kawn Sentiment Analysis\backend"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Endpoints

- `GET /health`
- `POST /analyze`
