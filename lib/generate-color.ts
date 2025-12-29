/**
 * Generates a consistent color from a string using a hash function
 * @param str - The reference string (e.g., name, email, id)
 * @returns HSL color string
 */
export function generateColor(str: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate hue (0-360)
  const hue = Math.abs(hash % 360);

  // Use consistent saturation and lightness for better aesthetics
  const saturation = 65; // 65% saturation for vibrant but not overwhelming colors
  const lightness = 50; // 50% lightness for good contrast with white text

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Gets initials from a full name
 * @param name - Full name string
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
