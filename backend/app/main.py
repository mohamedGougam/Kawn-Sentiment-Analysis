from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.sentiment_service import (
    MODEL_NAME,
    analyze_sentiment,
    inference_token_configured,
)

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

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
        "inference": "huggingface-inference-api",
        "token_configured": inference_token_configured(),
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest):
    try:
        result = analyze_sentiment(payload.text.strip())
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    return AnalyzeResponse(text=payload.text.strip(), **result)
