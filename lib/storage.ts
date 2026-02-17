import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucketName = process.env.GCS_BUCKET_NAME || '';
const bucket = storage.bucket(bucketName);

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

/**
 * Upload a file to Google Cloud Storage
 * @param filePath - Local file path to upload
 * @param destination - Destination path in GCS (e.g., 'memes/image.png')
 * @returns Upload result with public URL or error
 */
export async function uploadToGCS(
  filePath: string,
  destination: string
): Promise<UploadResult> {
  try {
    // Upload file to GCS
    await bucket.upload(filePath, {
      destination,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
      // Note: With uniform bucket-level access, the bucket itself must be public
      // Run: gsutil iam ch allUsers:objectViewer gs://BUCKET_NAME
    });

    // Construct public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;

    console.log(`✓ Successfully uploaded ${filePath} to ${destination}`);
    console.log(`✓ Public URL: ${publicUrl}`);

    return {
      success: true,
      publicUrl,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`✗ Upload failed: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Upload a buffer to Google Cloud Storage
 * @param buffer - Buffer containing file data
 * @param destination - Destination path in GCS
 * @param contentType - MIME type of the file
 * @returns Upload result with public URL or error
 */
export async function uploadBufferToGCS(
  buffer: Buffer,
  destination: string,
  contentType: string
): Promise<UploadResult> {
  try {
    const file = bucket.file(destination);

    await file.save(buffer, {
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000',
      },
      // Note: With uniform bucket-level access, the bucket itself must be public
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;

    console.log(`✓ Successfully uploaded buffer to ${destination}`);
    console.log(`✓ Public URL: ${publicUrl}`);

    return {
      success: true,
      publicUrl,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`✗ Upload failed: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Check if the GCS bucket is accessible
 * @returns Boolean indicating if bucket is accessible
 */
export async function checkBucketAccess(): Promise<boolean> {
  try {
    const [exists] = await bucket.exists();
    if (!exists) {
      console.error(`✗ Bucket ${bucketName} does not exist`);
      return false;
    }
    console.log(`✓ Bucket ${bucketName} is accessible`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`✗ Bucket access check failed: ${errorMessage}`);
    return false;
  }
}
