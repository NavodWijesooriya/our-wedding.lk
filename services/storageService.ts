import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '@/lib/firebase';

export interface UploadResult {
  url: string;
  filename: string;
}

export async function uploadWeddingImage(
  weddingId: string,
  file: File,
  folder = 'gallery'
): Promise<UploadResult> {
  // Validate file size (max 8MB)
  const MAX_SIZE = 8 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('Image size exceeds 8MB limit. Please upload a smaller image.');
  }

  // Validate type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPG, PNG, WebP).');
  }

  const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;

  if (isFirebaseConfigured && storage) {
    try {
      const storageRef = ref(storage, `weddings/${weddingId}/${folder}/${cleanName}`);
      
      // Wrap upload in an 8-second timeout guard to avoid infinite preflight backoff retries when CORS is not configured
      const uploadPromise = uploadBytes(storageRef, file);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('UPLOAD_TIMEOUT_OR_CORS')), 8000)
      );

      const snapshot = await Promise.race([uploadPromise, timeoutPromise]);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return { url: downloadUrl, filename: cleanName };
    } catch (err: any) {
      if (err?.message === 'UPLOAD_TIMEOUT_OR_CORS' || err?.code === 'storage/unauthorized' || err?.code === 'storage/canceled') {
        console.warn(
          'Firebase Storage upload blocked or timed out (likely CORS not configured on bucket). Falling back to local data URI.\n' +
          'To fix CORS in Firebase Storage permanently, run:\n' +
          'gsutil cors set cors.json gs://weddingsites-8d0bb.firebasestorage.app'
        );
      } else {
        console.warn('Firebase storage upload failed; converting to local data URI:', err);
      }
    }
  }

  // Fallback: Read file as Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        filename: cleanName,
      });
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
