import requests
import io
import os
from fastapi import HTTPException
from app.config.env import UNOSERVER_URL
from urllib.parse import urljoin

ENDPOINT = "/request"


def convert_file_with_unoserver(
    file_path: str, convert_to: str, opts: list[str] | None = None
) -> io.BytesIO:
    """
    Sends a file to unoserver for conversion and returns the result as a BytesIO object.

    Args:
        file_path: Path to the file to be converted.
        convert_to: The target format (e.g., "pdf").
        opts: Optional list of conversion options.

    Returns:
        A BytesIO object containing the converted file.

    Raises:
        HTTPException: If the unoserver request fails.
    """
    # Build the form data
    with open(file_path, "rb") as f:
        files = {"file": (os.path.basename(file_path), f)}
        data = {"convert-to": convert_to}
        if opts:
            data["opts[]"] = ",".join(opts)

        # Send the POST request to unoserver
        response = requests.post(
            urljoin(UNOSERVER_URL, ENDPOINT), files=files, data=data
        )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="unoserver conversion failed")

    return io.BytesIO(response.content)
