from fastapi import FastAPI, UploadFile, File
from rq import Queue
from redis import Redis
import boto3
from app.config.env import (
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    R2_ENDPOINT_URL,
    R2_ACCESS_KEY,
    R2_SECRET_KEY,
)

app = FastAPI()
redis_conn = Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD)
q = Queue(connection=redis_conn)

s3_client = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT_URL,
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/convert")
async def convert_pptx(file: UploadFile = File(...)):
    pass
