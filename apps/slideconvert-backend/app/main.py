from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from app.api.routes import router
from app.schemas.docs import (
    API_TITLE,
    API_DESCRIPTION,
    API_VERSION,
    CONTACT_INFO,
    LICENSE_INFO,
    TAGS_METADATA,
    get_swagger_ui_settings,
)

# Create the FastAPI application instance with documentation settings
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    contact=CONTACT_INFO,
    license_info=LICENSE_INFO,
    openapi_tags=TAGS_METADATA,
    swagger_ui_parameters=get_swagger_ui_settings(),
    # Keep the default docs_url which is /docs
)


# Add a root route to redirect to the API documentation
@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    """Redirect root URL to the API documentation."""
    return RedirectResponse(url="/docs")


# Include the router from api.routes to register all API endpoints
app.include_router(router)
