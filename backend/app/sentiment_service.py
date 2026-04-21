import os
from typing import TypedDict

from huggingface_hub import InferenceClient

# SST-2 is trained on movie reviews and tends to be overconfident on social comments.
# This model is a better fit for short, informal text and includes an explicit neutral class.
MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment-latest"

# We report "confidence" as the gap between the top class probability and the runner-up.
# This is generally more realistic than raw top probability for UI display.
NEUTRAL_CONFIDENCE_THRESHOLD = 0.10


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
            "emoji": "😐",
        }
    if label in {"POSITIVE", "LABEL_2"}:
        return {
            "raw_label": "POSITIVE",
            "confidence": confidence,
            "kawn_label": "Positive vibes",
            "emoji": "😊",
        }
    if label in {"NEUTRAL", "LABEL_1"}:
        return {
            "raw_label": "NEUTRAL",
            "confidence": confidence,
            "kawn_label": "Neutral",
            "emoji": "😐",
        }
    return {
        "raw_label": "NEGATIVE",
        "confidence": confidence,
        "kawn_label": "Negative vibes",
        "emoji": "😕",
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

    # Convert to sortable list (HF may return any order).
    ranked = sorted(outputs, key=lambda x: float(x.score), reverse=True)
    top = ranked[0]
    second = ranked[1] if len(ranked) > 1 else None

    raw_label = str(top.label).upper()
    top_score = float(top.score)
    second_score = float(second.score) if second is not None else 0.0

    # "confidence" = separation from the runner-up, in [0, 1].
    confidence = max(0.0, min(1.0, top_score - second_score))
    return _to_sentiment_result(raw_label, confidence)
