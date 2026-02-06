/**
 * Efficient ID generator for issues
 * Uses incremental counter instead of Date.now() for better performance
 */
/**
 * Reset the issue counter (useful for testing)
 */
export declare function resetIssueCounter(): void;
/**
 * Generate a unique issue ID
 * @param prefix - Prefix for the ID (e.g., "a11y", "perf", "bp")
 * @returns Unique ID string
 */
export declare function generateIssueId(prefix: string): string;
/**
 * Generate ID with additional context
 * @param prefix - Prefix for the ID
 * @param context - Additional context (e.g., rule ID, element index)
 * @returns Unique ID string
 */
export declare function generateContextualId(prefix: string, context: string): string;
//# sourceMappingURL=id-generator.d.ts.map