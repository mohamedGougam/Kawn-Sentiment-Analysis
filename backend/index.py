"""
ASGI entry for Vercel: FastAPI expects a top-level `app` in a supported entry file.
See https://vercel.com/docs/frameworks/backend/fastapi
"""

from app.main import app

__all__ = ["app"]
