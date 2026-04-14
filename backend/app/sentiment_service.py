import os
from typing import TypedDict

from huggingface_hub import InferenceClient

MODEL_NAME = "distilbert/distilbert-base-uncased-finetuned-sst-2-english"
NEUTRAL_CONFIDENCE_THRESHOLD = 0.75


class SentimentResult(TypedDict):
    raw_label: str
    confidence: float
    kawn_label: str
    emoji: str


def _api_token() -> str | None:
    return os.environ.get("HF_API_TOKEN") or os.environ.get("HUGGINGFACEHUB_API_TOKEN")


def inference_token_configured() -> bool:
    return bool(_api_token())


def _to_sentiment_result(raw_label: str, confidence: float) -> SentimentResult:
    label = raw_label.upper()
    if confidence < NEUTRAL_CONFIDENCE_THRESHOLD:
        return {
            "raw_label": "NEUTRAL",
            "confidence": confidence,
            "kawn_label": "Neutral",
            "emoji": "\N{NEUTRAL FACE}",
        }
    if label == "POSITIVE":
        return {
            "raw_label": "POSITIVE",
            "confidence": confidence,
            "kawn_label": "Positive vibes",
            "emoji": "\N{SMILING FACE WITH SMILING EYES}",
        }
    return {
        "raw_label": "NEGATIVE",
        "confidence": confidence,
        "kawn_label": "Negative vibes",
        "emoji": "\N{CONFUSED FACE}",
    }


def analyze_sentiment(text: str) -> SentimentResult:
    token = _api_token()
    if not token:
        raise RuntimeError(
            "Set HF_API_TOKEN (or HUGGINGFACEHUB_API_TOKEN) for Hugging Face Inference. "
            "Create a token at https://huggingface.co/settings/tokens"
        )

    client = InferenceClient(api_key=token)
    outputs = client.text_classification(text[:5000], model=MODEL_NAME)
    if not outputs:
        raise ValueError("No classification output returned by Hugging Face.")

    top = max(outputs, key=lambda x: float(x.score))
    raw_label = str(top.label).upper()
    confidence = float(top.score)
    return _to_sentiment_result(raw_label, confidence)
