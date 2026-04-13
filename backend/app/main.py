from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.sentiment_service import MODEL_NAME, analyze_sentiment


app = FastAPI(
    title="Kawn Sentiment Analysis API",
    version="0.1.0",
    description="FastAPI backend for Kawn Sentiment Analysis using Hugging Face.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://([a-z0-9-]+\.)*vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": MODEL_NAME,
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest):
    result = analyze_sentiment(payload.text.strip())
    return AnalyzeResponse(text=payload.text.strip(), **result)
