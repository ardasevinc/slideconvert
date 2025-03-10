from pydantic import BaseModel, Field
from enum import Enum


class HealthResponse(BaseModel):
    """Response model for the health check endpoint."""

    status: str = Field(description="Status of the API service", examples=["ok"])


class ConversionResponse(BaseModel):
    """Response model for the slide conversion endpoint."""

    job_id: str = Field(
        description="Unique identifier for the conversion job",
        examples=["9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"],
    )


class JobStatus(str, Enum):
    """Possible states for a conversion job."""

    PROCESSING = "processing"
    DONE = "done"
    FAILED = "failed"


class JobStatusResponseBase(BaseModel):
    """Base response model for job status with common fields."""

    status: JobStatus = Field(description="Current status of the conversion job")


class JobStatusProcessingResponse(JobStatusResponseBase):
    """Response when job is still in progress."""

    status: JobStatus = JobStatus.PROCESSING


class JobStatusDoneResponse(JobStatusResponseBase):
    """Response when job has completed successfully."""

    status: JobStatus = JobStatus.DONE
    url: str = Field(
        description="Presigned URL to download the converted file",
        examples=["https://storage.example.com/file.pdf?token=abc123"],
    )


class JobStatusFailedResponse(JobStatusResponseBase):
    """Response when job has failed."""

    status: JobStatus = JobStatus.FAILED
    error: str = Field(
        description="Error message explaining why the conversion failed",
        examples=["Failed to convert PowerPoint file: Invalid file format"],
    )


# These are the models that will appear in the Swagger documentation
# as possible response types for the status endpoint
JobStatusResponse = (
    JobStatusProcessingResponse | JobStatusDoneResponse | JobStatusFailedResponse
)
