from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class AnalyzeResponse(BaseModel):
    text: str
    raw_label: str
    confidence: float
    kawn_label: str
    emoji: str
