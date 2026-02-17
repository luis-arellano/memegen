import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucketName = process.env.GCS_BUCKET_NAME;

async function testGCSUpload() {
  console.log('🧪 Testing Google Cloud Storage Upload...\n');

  // Step 1: Check bucket exists
  console.log('Step 1: Checking bucket accessibility...');
  try {
    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();

    if (!exists) {
      console.error(`✗ Bucket ${bucketName} does not exist`);
      console.log('\nTo create the bucket, run:');
      console.log(`  gsutil mb -p ${process.env.GCS_PROJECT_ID} gs://${bucketName}/`);
      console.log('  gsutil iam ch allUsers:objectViewer gs://' + bucketName);
      return false;
    }

    console.log(`✓ Bucket ${bucketName} exists and is accessible\n`);
  } catch (error) {
    console.error('✗ Error accessing bucket:', error.message);
    return false;
  }

  // Step 2: Create a test image
  console.log('Step 2: Creating test image...');
  const testImagePath = path.join(__dirname, '..', 'public', 'test-upload.png');

  // Create a simple 1x1 PNG (smallest valid PNG)
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 pixels
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
    0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x00, 0x03, 0x00, 0x01, 0x8F, 0x22, 0xE5,
    0x64, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
    0x44, 0xAE, 0x42, 0x60, 0x82
  ]);

  fs.writeFileSync(testImagePath, pngData);
  console.log(`✓ Test image created at ${testImagePath}\n`);

  // Step 3: Upload test image
  console.log('Step 3: Uploading test image to GCS...');
  const destination = `test-images/test-${Date.now()}.png`;

  try {
    const bucket = storage.bucket(bucketName);
    await bucket.upload(testImagePath, {
      destination,
      metadata: {
        cacheControl: 'public, max-age=31536000',
        contentType: 'image/png',
      },
      // Note: public: true doesn't work with uniform bucket-level access
      // The bucket itself must be configured for public access
    });

    console.log(`✓ Successfully uploaded to ${destination}\n`);
  } catch (error) {
    console.error('✗ Upload failed:', error.message);
    console.log('\nIf you see uniform bucket-level access errors, run:');
    console.log(`  gsutil iam ch allUsers:objectViewer gs://${bucketName}`);
    return false;
  }

  // Step 4: Verify public URL
  console.log('Step 4: Verifying public URL...');
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
  console.log(`Public URL: ${publicUrl}`);

  try {
    const response = await fetch(publicUrl);
    if (response.ok) {
      console.log(`✓ Image is publicly accessible (Status: ${response.status})\n`);
    } else {
      console.error(`✗ Image not accessible (Status: ${response.status})\n`);
      return false;
    }
  } catch (error) {
    console.error('✗ Failed to fetch public URL:', error.message);
    return false;
  }

  // Step 5: List files in bucket
  console.log('Step 5: Listing recent uploads in bucket...');
  try {
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({ maxResults: 5 });

    console.log(`Total files in bucket: ${files.length > 5 ? '5+' : files.length}`);
    files.forEach(file => {
      console.log(`  - ${file.name}`);
    });
    console.log('');
  } catch (error) {
    console.error('✗ Failed to list files:', error.message);
  }

  // Cleanup
  fs.unlinkSync(testImagePath);
  console.log('✓ Cleaned up test image\n');

  console.log('✅ All GCS upload tests passed!\n');
  console.log('Summary:');
  console.log('  ✓ Bucket is accessible');
  console.log('  ✓ Upload succeeded');
  console.log('  ✓ Public URL is working');
  console.log('  ✓ No authentication errors');

  return true;
}

// Run the test
testGCSUpload()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
