import os
from dotenv import load_dotenv
from typing import List

load_dotenv()


class EnvironmentVariableError(Exception):
    """Custom exception for environment variable errors."""

    pass


def check_env_vars(required_vars: List[str]) -> None:
    """
    Check if all required environment variables are set.
    Raises EnvironmentVariableError if any are missing.
    """
    missing_vars = [var for var in required_vars if os.getenv(var) is None]

    if missing_vars:
        raise EnvironmentVariableError(
            f"Missing required environment variables: {', '.join(missing_vars)}"
        )


def get_env_var(var_name: str) -> str:
    """
    Get an environment variable or raise an exception if it's not set.
    """
    value = os.getenv(var_name)
    if value is None:
        raise EnvironmentVariableError(f"Environment variable {var_name} is not set")
    return value


REQUIRED_ENV_VARS = [
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_PASSWORD",
    "R2_ACCESS_KEY",
    "R2_SECRET_KEY",
    "R2_ENDPOINT_URL",
    "R2_BUCKET_NAME",
    "R2_BASE_PATH",
    "UNOSERVER_URL",
]

check_env_vars(REQUIRED_ENV_VARS)

REDIS_HOST = get_env_var("REDIS_HOST")
REDIS_PORT = get_env_var("REDIS_PORT")
REDIS_PASSWORD = get_env_var("REDIS_PASSWORD")
R2_ACCESS_KEY = get_env_var("R2_ACCESS_KEY")
R2_SECRET_KEY = get_env_var("R2_SECRET_KEY")
R2_ENDPOINT_URL = get_env_var("R2_ENDPOINT_URL")
R2_BUCKET_NAME = get_env_var("R2_BUCKET_NAME")
R2_BASE_PATH = get_env_var("R2_BASE_PATH")
UNOSERVER_URL = get_env_var("UNOSERVER_URL")
