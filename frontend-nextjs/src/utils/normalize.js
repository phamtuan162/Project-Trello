export const normalizeURL = (url) => {
  const normalized = new URL(url);
  normalized.search = ""; // Loại bỏ query params nếu không cần so sánh
  return normalized.toString();
};
