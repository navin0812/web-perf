import { Issue, PendingCheck, Summary, AuditReport } from "./types.js";

/**
 * Format audit results into a complete audit report
 */
export function formatResults(
  url: string,
  startTime: number,
  endTime: number,
  allIssues: Issue[],
  allPassed: PendingCheck[],
  allIncomplete: Issue[] = [],
): AuditReport {
  const duration = endTime - startTime;

  // Generate summary statistics
  const summary = generateSummary(allIssues);

  return {
    url,
    timestamp: startTime,
    duration,
    issues: allIssues,
    passed: allPassed,
    incomplete: allIncomplete,
    summary,
  };
}

/**
 * Generate summary statistics from issues
 */
export function generateSummary(issues: Issue[]): Summary {
  const summary: Summary = {
    total: issues.length,
    bySeverity: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    },
    byCategory: {
      images: 0,
      interactive: 0,
      forms: 0,
      color: 0,
      document: 0,
      structure: 0,
      aria: 0,
      technical: 0,
    },
    passed: 0,
  };

  // Count by severity
  issues.forEach((issue) => {
    summary.bySeverity[issue.severity]++;
  });

  // Count by category
  issues.forEach((issue) => {
    if (issue.category in summary.byCategory) {
      summary.byCategory[issue.category]++;
    }
  });

  return summary;
}

/**
 * Merge multiple audit results into a single array
 */
export function mergeAuditResults(
  results: Array<{ issues: Issue[]; passed: PendingCheck[] }>,
): { issues: Issue[]; passed: PendingCheck[] } {
  const allIssues: Issue[] = [];
  const allPassed: PendingCheck[] = [];

  results.forEach((result) => {
    allIssues.push(...result.issues);
    allPassed.push(...result.passed);
  });

  return { issues: allIssues, passed: allPassed };
}

/**
 * Apply threshold checking to determine if audit passed
 */
export function checkThresholds(
  summary: Summary,
  thresholds?: {
    critical?: number;
    serious?: number;
    moderate?: number;
    minor?: number;
  },
): { passed: boolean; violations: string[] } {
  if (!thresholds) {
    return { passed: true, violations: [] };
  }

  const violations: string[] = [];

  if (
    thresholds.critical !== undefined &&
    summary.bySeverity.critical > thresholds.critical
  ) {
    violations.push(
      `Critical issues: ${summary.bySeverity.critical} (threshold: ${thresholds.critical})`,
    );
  }

  if (
    thresholds.serious !== undefined &&
    summary.bySeverity.serious > thresholds.serious
  ) {
    violations.push(
      `Serious issues: ${summary.bySeverity.serious} (threshold: ${thresholds.serious})`,
    );
  }

  if (
    thresholds.moderate !== undefined &&
    summary.bySeverity.moderate > thresholds.moderate
  ) {
    violations.push(
      `Moderate issues: ${summary.bySeverity.moderate} (threshold: ${thresholds.moderate})`,
    );
  }

  if (
    thresholds.minor !== undefined &&
    summary.bySeverity.minor > thresholds.minor
  ) {
    violations.push(
      `Minor issues: ${summary.bySeverity.minor} (threshold: ${thresholds.minor})`,
    );
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Sort issues by severity and then by category
 */
export function sortIssues(issues: Issue[]): Issue[] {
  const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };

  return issues.slice().sort((a, b) => {
    // First sort by severity
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) {
      return severityDiff;
    }

    // Then by category
    return a.category.localeCompare(b.category);
  });
}

/**
 * Group issues by category
 */
export function groupByCategory(issues: Issue[]): Record<string, Issue[]> {
  const grouped: Record<string, Issue[]> = {};

  issues.forEach((issue) => {
    if (!grouped[issue.category]) {
      grouped[issue.category] = [];
    }
    grouped[issue.category].push(issue);
  });

  return grouped;
}

/**
 * Group issues by severity
 */
export function groupBySeverity(issues: Issue[]): Record<string, Issue[]> {
  const grouped: Record<string, Issue[]> = {
    critical: [],
    serious: [],
    moderate: [],
    minor: [],
  };

  issues.forEach((issue) => {
    grouped[issue.severity].push(issue);
  });

  return grouped;
}

/**
 * Filter issues by severity
 */
export function filterBySeverity(
  issues: Issue[],
  severities: Array<"critical" | "serious" | "moderate" | "minor">,
): Issue[] {
  return issues.filter((issue) => severities.includes(issue.severity));
}

/**
 * Filter issues by category
 */
export function filterByCategory(
  issues: Issue[],
  categories: string[],
): Issue[] {
  return issues.filter((issue) => categories.includes(issue.category));
}

/**
 * Get top N issues by severity
 */
export function getTopIssues(issues: Issue[], count: number): Issue[] {
  return sortIssues(issues).slice(0, count);
}

/**
 * Calculate percentage of passed checks
 */
export function calculatePassRate(passed: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((passed / total) * 100);
}
