from fastapi import FastAPI
from api.routes import router

# Create the FastAPI application instance
app = FastAPI()

# Include the router from api.routes to register all API endpoints
app.include_router(router)
