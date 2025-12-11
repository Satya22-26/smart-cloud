# hashing.py

import hashlib
from fastapi import UploadFile

CHUNK_SIZE = 4 * 1024 * 1024

async def generate_hash(file: UploadFile) -> str:
    """
    Calculates the SHA-256 hash of an uploaded file by reading it in chunks.
    """
    sha256_hash = hashlib.sha256()
    while chunk := await file.read(CHUNK_SIZE):
        sha256_hash.update(chunk)
    file_hash = sha256_hash.hexdigest()
    
    # Reset file pointer to the beginning after reading
    await file.seek(0)
    return file_hash