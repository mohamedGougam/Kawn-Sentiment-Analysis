"""
Run LIME (Local Interpretable Model-agnostic Explanations) on the same
Hugging Face text-classification model used in production.

Uses the Inference API as a black box (many requests per explanation).

Usage (from backend/):
  .\\.venv\\Scripts\\activate
  pip install -r requirements-explain.txt
  $env:HF_API_TOKEN="hf_..."
  python scripts/lime_sentiment.py "I love this but shipping was terrible."

Requires HF_API_TOKEN (or HUGGINGFACEHUB_API_TOKEN) with Inference Providers access.
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

import numpy as np
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
from lime.lime_text import LimeTextExplainer

# Same model id as app.sentiment_service
MODEL_NAME = "distilbert/distilbert-base-uncased-finetuned-sst-2-english"

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


def _token() -> str:
    t = os.environ.get("HF_API_TOKEN") or os.environ.get("HUGGINGFACEHUB_API_TOKEN")
    if not t:
        print("Set HF_API_TOKEN in backend/.env or the environment.", file=sys.stderr)
        sys.exit(1)
    return t


def _scores_to_neg_pos(outputs: list) -> tuple[float, float]:
    """Map HF text_classification outputs to (P(NEG), P(POS))."""
    by_label = {str(o.label).upper(): float(o.score) for o in outputs}
    neg = by_label.get("NEGATIVE", 0.0)
    pos = by_label.get("POSITIVE", 0.0)
    s = neg + pos
    if s <= 0:
        return 0.5, 0.5
    return neg / s, pos / s


def main() -> None:
    parser = argparse.ArgumentParser(description="LIME explanation for sentiment model")
    parser.add_argument(
        "text",
        nargs="?",
        default="This feature is amazing, I really like it.",
        help="Comment to explain",
    )
    parser.add_argument(
        "--samples",
        type=int,
        default=80,
        help="LIME perturbations (each may call the HF API)",
    )
    parser.add_argument(
        "--features",
        type=int,
        default=12,
        help="Top contributing tokens/phrases to print",
    )
    args = parser.parse_args()

    client = InferenceClient(api_key=_token())

    def predict_proba(texts: list[str]) -> np.ndarray:
        out = np.zeros((len(texts), 2), dtype=np.float64)
        for i, t in enumerate(texts):
            raw = client.text_classification(t[:5000], model=MODEL_NAME)
            neg, pos = _scores_to_neg_pos(raw)
            out[i] = [neg, pos]
        return out

    explainer = LimeTextExplainer(class_names=["negative", "positive"])
    exp = explainer.explain_instance(
        args.text,
        predict_proba,
        num_features=args.features,
        num_samples=args.samples,
    )

    print("Text:", args.text)
    print("\nTop LIME contributions (word/phrase -> weight):")
    for word, w in exp.as_list():
        print(f"  {word!r}: {w:+.4f}")

    out_path = Path(__file__).resolve().parent.parent / "lime_output.html"
    out_path.write_text(exp.as_html(), encoding="utf-8")
    print(f"\nWrote interactive HTML: {out_path}")


if __name__ == "__main__":
    main()
