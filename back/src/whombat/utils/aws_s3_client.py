import boto3
import logging
from botocore.exceptions import ClientError
from fastapi import HTTPException
from whombat.system import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

class S3Client:
    _s3_client = None 

    def __init__(self):
        """Initialize the S3 client if not already initialized."""
        if not S3Client._s3_client:
            S3Client._s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.aws_access_key_id,
                aws_secret_access_key=settings.aws_secret_access_key,
                region_name=settings.aws_region,
            )

    def get_client(self):
        """Return the initialized S3 client."""
        return S3Client._s3_client

    def list_files(self, bucket_name, prefix):
        """List files in the S3 bucket under the specified prefix."""
        s3 = self.get_client()
        try:
            response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
            if 'Contents' not in response:
                logger.warning(f"No files found in S3 bucket with prefix {prefix}")
                return []
            file_keys = [obj['Key'] for obj in response['Contents']]
            return file_keys
        except ClientError as e:
            logger.error(f"Error accessing S3 bucket: {e}")
            raise HTTPException(status_code=500, detail=f"Error accessing S3 bucket: {str(e)}")

        
    def download_file(self, bucket_name, key, download_path):
        """Download a file from S3 to the specified local path."""
        s3 = self.get_client()
        try:
            s3.download_file(bucket_name, key, download_path)
            logger.info(f"Downloaded file from {bucket_name}/{key} to {download_path}")
            return download_path
        except ClientError as e:
            logger.error(f"Failed to download file from S3 bucket", exc_info=e)
            raise e    