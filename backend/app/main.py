import logging
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.sentiment_service import (
    MODEL_NAME,
    analyze_sentiment,
    inference_token_configured,
    _local_fallback,
)

logger = logging.getLogger("kawn.sentiment")

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

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
        "inference": "huggingface-inference-api-with-local-fallback",
        "token_configured": inference_token_configured(),
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest):
    text = (payload.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    try:
        result = analyze_sentiment(text)
    except Exception as e:
        logger.exception("Unexpected error during sentiment analysis: %s. Using local fallback.", e)
        result = _local_fallback(text)
    return AnalyzeResponse(text=text, **result)
