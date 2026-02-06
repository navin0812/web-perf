/**
 * Efficient ID generator for issues
 * Uses incremental counter instead of Date.now() for better performance
 */

let issueCounter = 0;

/**
 * Reset the issue counter (useful for testing)
 */
export function resetIssueCounter(): void {
  issueCounter = 0;
}

/**
 * Generate a unique issue ID
 * @param prefix - Prefix for the ID (e.g., "a11y", "perf", "bp")
 * @returns Unique ID string
 */
export function generateIssueId(prefix: string): string {
  return `${prefix}-${++issueCounter}`;
}

/**
 * Generate ID with additional context
 * @param prefix - Prefix for the ID
 * @param context - Additional context (e.g., rule ID, element index)
 * @returns Unique ID string
 */
export function generateContextualId(prefix: string, context: string): string {
  return `${prefix}-${context}-${++issueCounter}`;
}
