from fastapi import APIRouter, UploadFile, File, HTTPException
from rq import Queue
from redis import Redis
from app.config.env import REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
from workers.convert import process_slide
from uuid import uuid4
import shutil
import os

# Initialize the API router
router = APIRouter()

# Set up Redis connection using configuration settings
redis_conn = Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD)

# Create a queue for background tasks
q = Queue(connection=redis_conn)


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/convert")
async def convert_slide(file: UploadFile = File(...)):
    """
    Endpoint to upload a .ppt or .pptx file for conversion.
    - Validates the file type.
    - Saves the file temporarily with a unique name.
    - Enqueues a background task to process the file.
    - Returns a job ID for status tracking.
    """
    # Check if the file has a valid extension
    if not file.filename.lower().endswith((".ppt", ".pptx")):
        raise HTTPException(status_code=400, detail="only .ppt or .pptx files allowed")

    # Preserve the original file extension
    file_ext = os.path.splitext(file.filename)[1]

    # Generate a unique file path for temporary storage
    file_path = f"/tmp/{uuid4()}{file_ext}"

    # Save the uploaded file to the temporary path
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Enqueue the conversion task in the background
    job = q.enqueue(process_slide, file_path)

    # Return the job ID to the client
    return {"job_id": job.id}


@router.get("/status/{job_id}")
async def get_status(job_id: str):
    """
    Endpoint to check the status of a conversion job.
    - Fetches the job from the queue.
    - Returns the status and result (if completed) or error (if failed).
    """
    # Fetch the job from the queue using the job ID
    job = q.fetch_job(job_id)

    # Check job status and respond accordingly
    if job.is_finished:
        return {"status": "done", "url": job.result}
    elif job.is_failed:
        return {"status": "failed", "error": str(job.exc_info)}
    return {"status": "processing"}
