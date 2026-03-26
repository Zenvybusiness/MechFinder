/**
 * Compresses an image file using the HTML5 Canvas API.
 * @param {File} file - The original image file.
 * @param {number} maxWidthOrHeight - Maximum dimension for width or height.
 * @param {number} quality - JPEG compression quality (0.0 to 1.0).
 * @returns {Promise<File>} - A promise that resolves to the compressed image file.
 */
export const compressImage = async (file, maxWidthOrHeight = 1080, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    img.onload = () => {
      URL.revokeObjectURL(objectUrl); // Clear memory instantly
        let width = img.width;
        let height = img.height;

        // Calculate the new dimensions while preserving aspect ratio
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = Math.round((height *= maxWidthOrHeight / width));
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = Math.round((width *= maxWidthOrHeight / height));
            height = maxWidthOrHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object with the original name and the new Blob data
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob failed.'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (error) => reject(error);
  });
};
