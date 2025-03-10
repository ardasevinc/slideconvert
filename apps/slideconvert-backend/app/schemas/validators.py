from fastapi import UploadFile, HTTPException


ALLOWED_EXTENSIONS = {".ppt", ".pptx"}


def validate_slide_file(file: UploadFile) -> None:
    """
    Validate that the uploaded file is a PowerPoint slide file (.ppt or .pptx).

    Args:
        file: The uploaded file object

    Raises:
        HTTPException: If the file is not valid
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="File must have a filename")

    file_extension = get_file_extension(file.filename)
    if file_extension.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Only {', '.join(ALLOWED_EXTENSIONS)} files allowed",
        )


def get_file_extension(filename: str) -> str:
    """
    Extract the file extension from a filename, including the dot.

    Args:
        filename: The name of the file

    Returns:
        The file extension (e.g., ".ppt")
    """
    parts = filename.rsplit(".", 1)
    if len(parts) > 1:
        return f".{parts[1].lower()}"
    return ""
