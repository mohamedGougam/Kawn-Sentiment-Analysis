# Kawn Sentiment Analysis Backend

FastAPI service that calls the **Hugging Face Inference API** (no PyTorch in the deploy bundle, so it fits Vercel’s size limits).

## Hugging Face token

1. Create a token: [Hugging Face access tokens](https://huggingface.co/settings/tokens)
2. Local: copy `.env.example` to `.env` and set `HF_API_TOKEN`
3. Vercel: Project → Settings → Environment Variables → `HF_API_TOKEN` (and redeploy)

## Run locally

```powershell
cd "C:\Kawn Sentiment Analysis\backend"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
$env:HF_API_TOKEN="hf_your_token_here"
uvicorn app.main:app --reload
```

## Endpoints

- `GET /health` — includes `token_configured: true/false`
- `POST /analyze`
