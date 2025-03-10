import boto3
from app.config.env import R2_ENDPOINT_URL, R2_ACCESS_KEY, R2_SECRET_KEY, R2_BUCKET_NAME

s3_client = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT_URL,
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
)


def upload_to_r2(file_obj, object_key):
    s3_client.upload_fileobj(file_obj, R2_BUCKET_NAME, object_key)


def generate_presigned_url(object_key):
    return s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": R2_BUCKET_NAME, "Key": object_key},
        ExpiresIn=3600,
    )
