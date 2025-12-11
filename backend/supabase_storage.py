# storage.py
import os
import boto3
from fastapi import UploadFile
from dotenv import load_dotenv
import supabase

load_dotenv()

SUPABASE_S3_ENDPOINT = os.getenv("SUPABASE_S3_ENDPOINT")
SUPABASE_S3_REGION = os.getenv("SUPABASE_S3_REGION")
SUPABASE_S3_ACCESS_KEY_ID = os.getenv("SUPABASE_ACCESS_KEY_ID")
SUPABASE_S3_SECRET_ACCESS_KEY = os.getenv("SUPABASE_SECRET_ACCESS_KEY")
SUPABASE_BUCKET_NAME = os.getenv("SUPABASE_BUCKET_NAME")


s3_client = boto3.client(
    's3',
    endpoint_url=SUPABASE_S3_ENDPOINT,
    aws_access_key_id=SUPABASE_S3_ACCESS_KEY_ID,
    aws_secret_access_key=SUPABASE_S3_SECRET_ACCESS_KEY,
    region_name=SUPABASE_S3_REGION
)

def upload_file_to_storage(file: UploadFile, stored_filename: str) -> bool:
    """Uploads a file object to the bucket using the S3 protocol."""
    try:
        s3_client.upload_fileobj(file.file, SUPABASE_BUCKET_NAME, stored_filename)
        return True
    except Exception as e:
        print(f"Error uploading via S3 protocol: {e}")
        return False

def get_download_url(stored_filename: str) -> str | None:
    """Generates a pre-signed URL that suggests viewing the file inline."""
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': SUPABASE_BUCKET_NAME,
                'Key': stored_filename,
                'ResponseContentDisposition': 'inline'
            },
            ExpiresIn=300
        )
        return url
    except Exception as e:
        print(f"Error generating S3 pre-signed URL: {e}")
        return None
    
def delete_file_from_storage(stored_filename: str) -> bool:
    """Deletes a file from the bucket using the S3 protocol."""
    try:
        s3_client.delete_object(
            Bucket=SUPABASE_BUCKET_NAME,
            Key=stored_filename
        )
        return True
    except Exception as e:
        print(f"Error deleting via S3 protocol: {e}")
        return False