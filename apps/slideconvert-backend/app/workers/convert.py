from utils.unoserver import convert_to_pdf
from utils.r2 import upload_to_r2, generate_presigned_url
import os
from datetime import datetime


def process_slide(file_path):
    try:
        pdf_io = convert_to_pdf(file_path)
        base_name = os.path.basename(file_path).rsplit(".", 1)[0]
        # Create a date-based prefix (e.g., conversions/2025/03/09/)
        date_prefix = datetime.now().strftime("conversions/%Y/%m/%d")
        # Combine into a clean path (e.g., conversions/2025/03/09/<uuid>.pdf)
        object_key = f"{date_prefix}/{base_name}.pdf"
        upload_to_r2(pdf_io, object_key)
        url = generate_presigned_url(object_key)
        return url
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
