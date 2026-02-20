const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * @param {File} file
 * @param {string} [folder] - optional Cloudinary folder
 * @returns {Promise<string>} secure_url of the uploaded asset
 */
export async function uploadToCloudinary(file, folder = 'loudkitchen') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        { method: 'POST', body: formData }
    );

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Cloudinary upload failed');
    }

    const data = await res.json();
    return data.secure_url;
}
