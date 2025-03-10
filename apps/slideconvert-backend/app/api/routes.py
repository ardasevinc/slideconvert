from fastapi import APIRouter, UploadFile, File, HTTPException, Path, status, Depends
from rq import Queue
from redis import Redis
from app.config.env import REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
from app.workers.convert import process_slide
from app.schemas.models import (
    HealthResponse,
    ConversionResponse,
    JobStatusResponse,
    JobStatusProcessingResponse,
    JobStatusDoneResponse,
    JobStatusFailedResponse,
)
from app.schemas.validators import validate_slide_file
from app.utils.security import get_api_key
from uuid import uuid4
import shutil
import os
from typing import Union

# Initialize the API router
router = APIRouter()

# Set up Redis connection using configuration settings
redis_conn = Redis(host=REDIS_HOST, port=int(REDIS_PORT), password=REDIS_PASSWORD)

# Create a queue for background tasks
q = Queue(connection=redis_conn)


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="API Health Check",
    description="Returns the health status of the API",
    tags=["health"],
    status_code=status.HTTP_200_OK,
)
async def health():
    """
    Check the health of the API server.

    Returns:
        A JSON object with the status "ok" if the server is running properly.
    """
    return {"status": "ok"}


@router.post(
    "/convert",
    response_model=ConversionResponse,
    summary="Convert PowerPoint to PDF",
    description="Upload a PowerPoint file (.ppt or .pptx) to convert it to PDF format. The conversion will be processed asynchronously.",
    tags=["conversion"],
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(get_api_key)],
)
async def convert_slide(file: UploadFile = File(...)):
    """
    Convert a PowerPoint slide to PDF.

    This endpoint:
    - Validates the file type (.ppt or .pptx)
    - Saves the file temporarily
    - Enqueues a background task to process the conversion
    - Returns a job ID to track the status

    Args:
        file: The PowerPoint file to convert

    Returns:
        A JSON object with a job_id to track the conversion status

    Raises:
        HTTPException: If the file type is invalid or if there's an error processing the file
    """
    # Validate the file type
    validate_slide_file(file)

    # Preserve the original file extension
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ""

    # Generate a unique file path for temporary storage
    file_path = f"/tmp/{uuid4()}{file_ext}"

    # Save the uploaded file to the temporary path
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Enqueue the conversion task in the background
    job = q.enqueue(process_slide, file_path)

    # Return the job ID to the client
    return {"job_id": job.id}


@router.get(
    "/status/{job_id}",
    response_model=JobStatusResponse,
    responses={
        200: {
            "model": Union[
                JobStatusProcessingResponse,
                JobStatusDoneResponse,
                JobStatusFailedResponse,
            ],
            "description": "The current status of the job",
        },
        404: {"description": "Job not found"},
    },
    summary="Check Conversion Status",
    description="Check the status of a conversion job by its job ID. Returns the current status and additional information based on the state.",
    tags=["status"],
    dependencies=[Depends(get_api_key)],
)
async def get_status(
    job_id: str = Path(..., description="The ID of the conversion job to check"),
):
    """
    Get the status of a conversion job.

    Args:
        job_id: The ID of the job to check status for

    Returns:
        A JSON object with the status and additional information based on the state:
        - "processing": Job is still in progress
        - "done": Job has completed with a download URL
        - "failed": Job failed with an error message

    Raises:
        HTTPException: If the job with the given ID doesn't exist
    """
    # Fetch the job from the queue using the job ID
    job = q.fetch_job(job_id)

    # If job doesn't exist, return not found
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job not found"
        )

    # Check job status and respond accordingly
    if job.is_finished:
        return {"status": "done", "url": job.result}
    elif job.is_failed:
        return {"status": "failed", "error": str(job.exc_info)}

    return {"status": "processing"}
