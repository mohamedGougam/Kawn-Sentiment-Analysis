import os
from typing import Any, TypedDict

import httpx

MODEL_NAME = "distilbert-base-uncased-finetuned-sst-2-english"
INFERENCE_URL = f"https://api-inference.huggingface.co/models/{MODEL_NAME}"
NEUTRAL_CONFIDENCE_THRESHOLD = 0.75
REQUEST_TIMEOUT = 60.0


class SentimentResult(TypedDict):
    raw_label: str
    confidence: float
    kawn_label: str
    emoji: str


def _api_token() -> str | None:
    return os.environ.get("HF_API_TOKEN") or os.environ.get("HUGGINGFACEHUB_API_TOKEN")


def inference_token_configured() -> bool:
    return bool(_api_token())


def _best_scored_label(candidates: list[Any]) -> dict[str, Any]:
    scored = [
        x
        for x in candidates
        if isinstance(x, dict) and "label" in x and "score" in x
    ]
    if not scored:
        raise ValueError(f"No scored labels in: {candidates!r}")
    return max(scored, key=lambda x: float(x["score"]))


def _pick_top_label(payload: Any) -> dict[str, Any]:
    """Normalize Hugging Face Inference API response shapes."""
    if isinstance(payload, dict) and "label" in payload and "score" in payload:
        return payload

    if isinstance(payload, list) and len(payload) > 0:
        first = payload[0]

        if isinstance(first, list) and len(first) > 0:
            return _best_scored_label(first)

        if isinstance(first, dict) and "label" in first and "score" in first:
            if all(
                isinstance(x, dict) and "score" in x and "label" in x
                for x in payload
            ):
                return _best_scored_label(payload)
            return first

    raise ValueError(f"Unexpected inference response shape: {payload!r}")


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
            "Set HF_API_TOKEN (or HUGGINGFACEHUB_API_TOKEN) for Hugging Face Inference API. "
            "Create a free token at https://huggingface.co/settings/tokens"
        )

    with httpx.Client(timeout=REQUEST_TIMEOUT) as client:
        response = client.post(
            INFERENCE_URL,
            headers={"Authorization": f"Bearer {token}"},
            json={"inputs": text[:5000]},
        )

    if response.status_code == 503:
        raise RuntimeError(
            "Hugging Face model is loading or cold; wait a few seconds and retry."
        )
    if response.status_code == 401:
        raise RuntimeError("Invalid or expired Hugging Face API token.")
    response.raise_for_status()

    data = response.json()
    top = _pick_top_label(data)
    raw_label = str(top["label"]).upper()
    confidence = float(top["score"])
    return _to_sentiment_result(raw_label, confidence)
