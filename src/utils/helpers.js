const BASE_URL = 'http://localhost:5023';

/**
 * Ensures an image path is a valid URL by prefixing it with the BASE_URL if needed.
 * @param {string} path - The image path or URL
 * @returns {string} - The full URL to the image
 */
export const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/150';
  
  // If it's already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // Clean the path and combine with BASE_URL
  // Assuming BASE_URL is something like http://localhost:5023
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If the path already includes /api, we might need to adjust
  // But usually static files are served from the root
  return `${BASE_URL}${cleanPath}`;
};
