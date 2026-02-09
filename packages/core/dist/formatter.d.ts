import { Issue, PendingCheck, Summary, AuditReport } from "./types.js";
/**
 * Format audit results into a complete audit report
 */
export declare function formatResults(url: string, startTime: number, endTime: number, allIssues: Issue[], allPassed: PendingCheck[], allIncomplete?: Issue[]): AuditReport;
/**
 * Generate summary statistics from issues
 */
export declare function generateSummary(issues: Issue[]): Summary;
/**
 * Merge multiple audit results into a single array
 */
export declare function mergeAuditResults(results: Array<{
    issues: Issue[];
    passed: PendingCheck[];
}>): {
    issues: Issue[];
    passed: PendingCheck[];
};
/**
 * Apply threshold checking to determine if audit passed
 */
export declare function checkThresholds(summary: Summary, thresholds?: {
    critical?: number;
    serious?: number;
    moderate?: number;
    minor?: number;
}): {
    passed: boolean;
    violations: string[];
};
/**
 * Sort issues by severity and then by category
 */
export declare function sortIssues(issues: Issue[]): Issue[];
/**
 * Group issues by category
 */
export declare function groupByCategory(issues: Issue[]): Record<string, Issue[]>;
/**
 * Group issues by severity
 */
export declare function groupBySeverity(issues: Issue[]): Record<string, Issue[]>;
/**
 * Filter issues by severity
 */
export declare function filterBySeverity(issues: Issue[], severities: Array<"critical" | "serious" | "moderate" | "minor">): Issue[];
/**
 * Filter issues by category
 */
export declare function filterByCategory(issues: Issue[], categories: string[]): Issue[];
/**
 * Get top N issues by severity
 */
export declare function getTopIssues(issues: Issue[], count: number): Issue[];
/**
 * Calculate percentage of passed checks
 */
export declare function calculatePassRate(passed: number, total: number): number;
//# sourceMappingURL=formatter.d.ts.map