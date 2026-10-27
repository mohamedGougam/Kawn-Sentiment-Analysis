import os
import re
import logging
from typing import TypedDict

logger = logging.getLogger("kawn.sentiment")

try:
    from huggingface_hub import InferenceClient
except ImportError:
    InferenceClient = None

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


# Multilingual Sentiment Lexicon for Fallback / Local Analysis
POSITIVE_WORDS = {
    # English
    "love", "loved", "loving", "loves", "great", "amazing", "excellent", "good", "best",
    "awesome", "cool", "wonderful", "nice", "beautiful", "happy", "wow", "perfect",
    "fire", "lit", "goat", "congrats", "congratulations", "bravo", "thank", "thanks",
    "blessed", "proud", "inspiring", "legend", "favorite", "sweet", "clean", "masterpiece",
    "gem", "superb", "flawless", "brilliant", "solid", "epic", "fan", "positive", "enjoy",
    "enjoyed", "fantastic", "win", "winner",
    # French
    "super", "magnifique", "genial", "génial", "adore", "aime", "top", "beau", "belle",
    "merci", "parfait", "felicitations", "félicitations", "formidable", "splendide",
    "impressionnant", "chouette", "plaisir", "bonheur",
    # Arabic / North African
    "رائع", "جميل", "ممتاز", "حلو", "بطل", "شكرا", "أحسنت", "احسنت", "مبدع", "عظيم",
    "فخم", "توب", "تستاهل", "موفق", "منور", "احبك", "حب", "روعة", "اسطورة", "أسطورة",
    "فنان", "ذوق", "تسلم", "يسلمو", "تحفة", "مبروك", "تبارك", "عسل", "نار", "جامد",
    "كفو", "يعطيك", "جمال", "قمة", "روعه",
}

NEGATIVE_WORDS = {
    # English
    "bad", "terrible", "horrible", "worst", "hate", "hated", "ugly", "fake", "trash",
    "boring", "wrong", "stupid", "suck", "sucks", "poor", "awful", "scam", "disgust",
    "angry", "lie", "liar", "garbage", "crap", "fail", "failed", "loser", "toxic",
    "cheat", "shame", "useless", "disappointing", "disappointed", "pathetic", "clown",
    "annoying", "cringe", "gross", "ridiculous",
    # French
    "nul", "nulle", "mauvais", "mauvaise", "pire", "deteste", "déteste", "moche", "arnaque",
    "faux", "fausse", "degoutant", "dégoûtant", "honte", "ennuyeux", "menteur", "merde",
    "ridicule", "decevant", "décevant",
    # Arabic / North African
    "سيء", "سيئة", "زفت", "خايس", "مقرف", "كذب", "فاشل", "نفاق", "تافه", "سرقة",
    "قبيح", "اكره", "سخيف", "نصاب", "غبي", "عيب", "وسخ", "خسارة", "انحطاط", "خداع",
    "خراب", "منحط", "حقير", "تخلف", "فاشلين", "تافهين",
}

POSITIVE_PHRASES = [
    "ما شاء الله", "تبارك الله", "يعطيك العافية", "يعطيك الصحة", "ربي يحفظك", "الله يبارك",
    "well done", "keep it up", "proud of you", "so good", "very good", "so proud",
]

NEGATIVE_PHRASES = [
    "لا يعجبني", "غير لائق", "حسبي الله", "not good", "waste of time", "so bad", "too bad", "very bad",
]

POSITIVE_EMOJIS = {
    "😊", "😍", "🥰", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎",
    "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🔥", "👏", "👍", "💯", "🌟",
    "✨", "🚀", "🙌", "😁", "😄", "😃", "🤩", "🎉", "🥳", "👑", "💐", "🌸",
}

NEGATIVE_EMOJIS = {
    "😡", "🤬", "👎", "💔", "🤮", "🤢", "😢", "😭", "💩", "🤡", "😠", "👿",
    "🖕", "🤦", "🙄", "😤",
}


def _local_fallback(text: str) -> SentimentResult:
    """
    Self-healing rule-based multilingual sentiment classifier.
    Guarantees that sentiment analysis never throws 500 even if Hugging Face credits are 0
    or external APIs are down.
    """
    clean_text = (text or "").strip()
    if not clean_text:
        return _to_sentiment_result("NEUTRAL", 0.50)

    lower = clean_text.lower()
    words = set(re.findall(r"[\w]+", lower, re.UNICODE))

    pos_score = sum(1.0 for w in words if w in POSITIVE_WORDS)
    neg_score = sum(1.0 for w in words if w in NEGATIVE_WORDS)

    for phrase in POSITIVE_PHRASES:
        if phrase in lower:
            pos_score += 2.0

    for phrase in NEGATIVE_PHRASES:
        if phrase in lower:
            neg_score += 2.0

    for char in clean_text:
        if char in POSITIVE_EMOJIS:
            pos_score += 1.5
        elif char in NEGATIVE_EMOJIS:
            neg_score += 1.5

    if pos_score > neg_score:
        confidence = min(0.95, round(0.65 + 0.08 * (pos_score - neg_score), 2))
        return _to_sentiment_result("POSITIVE", confidence)
    elif neg_score > pos_score:
        confidence = min(0.95, round(0.65 + 0.08 * (neg_score - pos_score), 2))
        return _to_sentiment_result("NEGATIVE", confidence)
    else:
        return _to_sentiment_result("NEUTRAL", 0.50)


def analyze_sentiment(text: str) -> SentimentResult:
    clean_text = (text or "").strip()
    if not clean_text:
        return _to_sentiment_result("NEUTRAL", 0.50)

    token = _api_token()
    if token and InferenceClient is not None:
        try:
            client = InferenceClient(api_key=token)
            outputs = client.text_classification(clean_text[:5000], model=MODEL_NAME)
            if outputs:
                ranked = sorted(outputs, key=lambda x: float(x.score), reverse=True)
                top = ranked[0]
                second = ranked[1] if len(ranked) > 1 else None
                raw_label = str(top.label).upper()
                top_score = float(top.score)
                second_score = float(second.score) if second is not None else 0.0
                confidence = max(0.0, min(1.0, top_score - second_score))
                return _to_sentiment_result(raw_label, confidence)
        except Exception as e:
            logger.warning(
                "Hugging Face Inference call failed (%s). Seamlessly falling back to local multilingual classifier.",
                e,
            )

    return _local_fallback(clean_text)
