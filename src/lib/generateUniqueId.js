// Utility function to generate unique IDs
export const generateUniqueId = (page, index) => {
  return `${page}-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};