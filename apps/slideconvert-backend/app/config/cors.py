from app.config.env import ENV
from fastapi.middleware.cors import CORSMiddleware

IS_DEVELOPMENT = ENV.lower() == "development" or ENV.lower() == "test"

# FIXME: added localhost to prod cors temporarily. needs to be removed later on.
if IS_DEVELOPMENT:
    origins = [
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1",
        "http://127.0.0.1:3000",
        "https://slideconvert-web.vercel.app",
        "https://www.slideconvert-web.vercel.app",
    ]
else:
    origins = [
        "https://slideconvert-web.ardasevinc.xyz",
        "https://www.slideconvert-web.ardasevinc.xyz",
        "https://slideconvert-web.vercel.app",
        "https://www.slideconvert-web.vercel.app",
    ]


def add_cors_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
