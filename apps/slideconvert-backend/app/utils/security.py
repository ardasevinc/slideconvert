from fastapi import HTTPException, Security, status
from fastapi.security.api_key import APIKeyHeader
from app.config.env import API_KEY

# Define the name of the API key header
API_KEY_NAME = "X-API-Key"

# Create the API key header dependency
api_key_auth = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


async def get_api_key(api_key_header: str | None = Security(api_key_auth)):
    """
    Validate the API key provided in the request header.

    Args:
        api_key_header: The API key extracted from the request header.

    Returns:
        The API key if it is valid.

    Raises:
        HTTPException: If the API key is invalid or missing.
    """
    if api_key_header is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key is missing",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    if api_key_header != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    return api_key_header
