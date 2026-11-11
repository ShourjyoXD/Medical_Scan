const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ACCEPTED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an uploaded file for the image analysis workflow.
 * Checks MIME type, extension, and file size.
 */
export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check MIME type
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type "${file.type}". Please upload a PNG or JPEG image.`,
    };
  }

  // Double-check by extension (some browsers may set a generic MIME type)
  const lowerName = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) =>
    lowerName.endsWith(ext),
  );
  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Unsupported file extension. Please upload a file ending in .png, .jpg, or .jpeg.`,
    };
  }

  // Check size
  if (file.size > MAX_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMB} MB). The maximum allowed size is 10 MB.`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty.' };
  }

  return { valid: true };
}

export const ACCEPTED_FORMATS_LABEL = 'PNG, JPG, JPEG';
export const MAX_SIZE_LABEL = '10 MB';
