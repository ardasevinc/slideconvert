import aiohttp
import io
import os
from fastapi import HTTPException
from app.config.env import UNOSERVER_URL
from urllib.parse import urljoin

ENDPOINT = "/request"


async def convert_file_with_unoserver(
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
    async with aiohttp.ClientSession() as session:
        # Build the multipart form data
        form = aiohttp.FormData()

        # Get the filename from the path
        filename = os.path.basename(file_path)

        # Add the file from the path
        with open(file_path, "rb") as f:
            file_data = f.read()

        form.add_field("file", file_data, filename=filename)
        form.add_field("convert-to", convert_to)
        if opts:
            for opt in opts:
                form.add_field("opts[]", opt)

        # Send the POST request to unoserver
        async with session.post(urljoin(UNOSERVER_URL, ENDPOINT), data=form) as resp:
            if resp.status != 200:
                raise HTTPException(
                    status_code=500, detail="unoserver conversion failed"
                )
            return io.BytesIO(await resp.read())
