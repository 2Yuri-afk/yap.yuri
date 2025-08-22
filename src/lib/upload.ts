import { createSupabaseBrowserClient } from './supabase/client';

export async function uploadImage(
  file: File,
  bucket: string = 'media'
): Promise<string | null> {
  const supabase = createSupabaseBrowserClient();

  console.log('Starting upload for file:', file.name, 'to bucket:', bucket);

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `posts/${fileName}`;

  console.log('Upload path:', filePath);

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error details:', {
      error,
      message: error.message,
      bucket,
      filePath,
    });
    return null;
  }

  console.log('Upload successful, data:', data);

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  console.log('Public URL:', publicUrl);

  return publicUrl;
}

export async function deleteImage(
  url: string,
  bucket: string = 'media'
): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();

  // Extract file path from URL
  const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
  if (urlParts.length !== 2) return false;

  const filePath = urlParts[1];
  if (!filePath) return false;

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    return false;
  }

  return true;
}
