from functools import lru_cache
from typing import TypedDict

from transformers import pipeline


MODEL_NAME = "distilbert-base-uncased-finetuned-sst-2-english"
NEUTRAL_CONFIDENCE_THRESHOLD = 0.75


class SentimentResult(TypedDict):
    raw_label: str
    confidence: float
    kawn_label: str
    emoji: str


@lru_cache(maxsize=1)
def get_sentiment_pipeline():
    return pipeline("sentiment-analysis", model=MODEL_NAME)


def analyze_sentiment(text: str) -> SentimentResult:
    classifier = get_sentiment_pipeline()
    result = classifier(text, truncation=True)[0]

    raw_label = str(result["label"]).upper()
    confidence = float(result["score"])

    if confidence < NEUTRAL_CONFIDENCE_THRESHOLD:
        return {
            "raw_label": "NEUTRAL",
            "confidence": confidence,
            "kawn_label": "Neutral",
            "emoji": "😐",
        }

    if raw_label == "POSITIVE":
        return {
            "raw_label": "POSITIVE",
            "confidence": confidence,
            "kawn_label": "Positive vibes",
            "emoji": "😊",
        }

    return {
        "raw_label": "NEGATIVE",
        "confidence": confidence,
        "kawn_label": "Negative vibes",
        "emoji": "😕",
    }
