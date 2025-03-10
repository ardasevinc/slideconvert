from fastapi import FastAPI
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
from fastapi.openapi.utils import get_openapi
from app.config.cors import add_cors_middleware

# Create the FastAPI application instance with documentation settings
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    contact=CONTACT_INFO,
    license_info=LICENSE_INFO,
    openapi_tags=TAGS_METADATA,
    swagger_ui_parameters=get_swagger_ui_settings(),
)


add_cors_middleware(app)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=API_TITLE,
        version=API_VERSION,
        description=API_DESCRIPTION,
        routes=app.routes,
    )

    # Ensure components object exists
    if "components" not in openapi_schema:
        openapi_schema["components"] = {}

    # Add API Key security scheme while preserving existing components
    openapi_schema["components"]["securitySchemes"] = {
        "ApiKeyAuth": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-Key",
            "description": "Enter your API key",
        }
    }

    # Add global security requirement
    openapi_schema["security"] = [{"ApiKeyAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


# Add a root route to redirect to the API documentation
@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    """Redirect root URL to the API documentation."""
    return RedirectResponse(url="/docs")


# Include the router from api.routes to register all API endpoints
app.include_router(router)
