from typing import Dict, Any


# API Metadata
API_TITLE = "SlideConvert API"
API_DESCRIPTION = """
# SlideConvert API

This API allows you to convert PowerPoint slides (.ppt, .pptx) to PDF format.

## Features

* **Upload PowerPoint Files**: Convert your PowerPoint presentations to PDF.
* **Asynchronous Processing**: Jobs are processed in the background.
* **Job Status Tracking**: Monitor conversion progress and get download links.

## Workflow

1. Upload a PowerPoint file using the `/convert` endpoint
2. Receive a job ID for the conversion task
3. Check job status using the `/status/{job_id}` endpoint
4. Download the converted PDF when the job is complete

All converted files are stored securely and accessible via presigned URLs.
"""
API_VERSION = "1.0.0"
CONTACT_INFO = {
    "name": "SlideConvert Support",
    "url": "https://slideconvert.example.com/support",
    "email": "support@slideconvert.example.com",
}
LICENSE_INFO = {
    "name": "MIT License",
    "url": "https://opensource.org/licenses/MIT",
}
TAGS_METADATA = [
    {
        "name": "conversion",
        "description": "Operations for converting PowerPoint files to PDF.",
    },
    {
        "name": "status",
        "description": "Operations for checking job status.",
    },
    {
        "name": "health",
        "description": "Health check endpoints.",
    },
]


def get_swagger_ui_settings() -> Dict[str, Any]:
    """
    Configure Swagger UI settings for a better documentation experience.

    Returns:
        Dictionary of Swagger UI configuration options
    """
    return {
        "syntaxHighlight.theme": "monokai",
        "docExpansion": "list",
        "defaultModelsExpandDepth": 3,
        "defaultModelExpandDepth": 3,
        "deepLinking": True,
    }
