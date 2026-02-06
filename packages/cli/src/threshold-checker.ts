import { AuditReport, ThresholdConfig } from "@web-perf/core";

export type ThresholdResult = {
  passed: boolean;
  violations: Array<{
    severity: string;
    count: number;
    threshold: number;
    exceeded: number;
  }>;
};

/**
 * Checks if the audit report passes the specified thresholds
 */
export function checkThresholds(
  report: AuditReport,
  threshold?: ThresholdConfig,
): ThresholdResult {
  // If no threshold is set, always pass
  if (!threshold) {
    return {
      passed: true,
      violations: [],
    };
  }

  const violations: ThresholdResult["violations"] = [];
  const { bySeverity } = report.summary;

  // Check each severity level
  const severityLevels: Array<keyof ThresholdConfig> = [
    "critical",
    "serious",
    "moderate",
    "minor",
  ];

  for (const severity of severityLevels) {
    const thresholdValue = threshold[severity];
    const actualCount = bySeverity[severity];

    if (thresholdValue !== undefined && actualCount > thresholdValue) {
      violations.push({
        severity,
        count: actualCount,
        threshold: thresholdValue,
        exceeded: actualCount - thresholdValue,
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Formats threshold violations for display
 */
export function formatThresholdViolations(
  result: ThresholdResult,
): string | null {
  if (result.passed) {
    return null;
  }

  const lines = ["❌ Threshold violations:"];

  for (const violation of result.violations) {
    lines.push(
      `  - ${violation.severity}: ${violation.count} issues (threshold: ${violation.threshold}, exceeded by ${violation.exceeded})`,
    );
  }

  return lines.join("\n");
}
