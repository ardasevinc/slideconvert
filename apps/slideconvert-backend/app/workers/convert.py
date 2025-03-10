from app.utils.unoserver import convert_file_with_unoserver
from app.utils.r2 import upload_to_r2, generate_presigned_url
import os
from datetime import datetime


def process_slide(file_path):
    try:
        # file_ext = os.path.splitext(file_path)[1].lower().lstrip(".")

        # Call convert_file_with_unoserver with the file path and target format
        pdf_io = convert_file_with_unoserver(file_path, "pdf")

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
