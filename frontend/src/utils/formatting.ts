/**
 * Format a 0–1 confidence score as a percentage string.
 * e.g. 0.882 → "88.2%"
 */
export function formatConfidence(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

/**
 * Convert an ALL_CAPS or SNAKE_CASE class name into a readable title.
 * e.g. "NO_TUMOR" → "No Tumor", "PNEUMONIA" → "Pneumonia"
 */
export function formatClassName(cls: string): string {
  return cls
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalise(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Sort a score map (Record<string, number>) from highest to lowest.
 * Returns an array of [className, score] tuples.
 */
export function sortedScores(
  scores: Record<string, number>,
): [string, number][] {
  return Object.entries(scores).sort(([, a], [, b]) => b - a);
}
