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
export declare function checkThresholds(report: AuditReport, threshold?: ThresholdConfig): ThresholdResult;
/**
 * Formats threshold violations for display
 */
export declare function formatThresholdViolations(result: ThresholdResult): string | null;
//# sourceMappingURL=threshold-checker.d.ts.map