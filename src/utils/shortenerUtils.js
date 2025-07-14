// URL validation (simple regex)
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Shortcode validation: alphanumeric, 4-12 chars
export function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{4,12}$/.test(code);
}

// Generate a unique shortcode
export function generateShortcode(existingSet) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  do {
    code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  } while (existingSet.has(code));
  return code;
} 