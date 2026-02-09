export type Issue = {
    id: string;
    ruleId: string;
    severity: "critical" | "serious" | "moderate" | "minor";
    category: "images" | "interactive" | "forms" | "color" | "document" | "structure" | "aria" | "technical";
    message: string;
    description: string;
    helpUrl: string;
    wcag: {
        id: string;
        level: "A" | "AA" | "AAA";
        name: string;
        description: string;
    };
    element: {
        selector: string;
        html: string;
        failureSummary: string;
    };
    fix: {
        description: string;
        code: string;
        learnMoreUrl: string;
    };
};
export type Summary = {
    total: number;
    bySeverity: {
        critical: number;
        serious: number;
        moderate: number;
        minor: number;
    };
    byCategory: {
        images: number;
        interactive: number;
        forms: number;
        color: number;
        document: number;
        structure: number;
        aria: number;
        technical: number;
    };
    passed: number;
};
export type AuditReport = {
    url: string;
    timestamp: number;
    duration: number;
    issues: Issue[];
    passed: PendingCheck[];
    incomplete: Issue[];
    summary: Summary;
};
export type PendingCheck = {
    id: string;
    name: string;
    category: string;
    description: string;
};
export type ThresholdConfig = {
    critical?: number;
    serious?: number;
    moderate?: number;
    minor?: number;
};
export type CliOptions = {
    url: string;
    outputDir?: string;
    format?: "json" | "html" | "terminal" | "all";
    threshold?: ThresholdConfig;
    skipAudits?: string[];
};
export declare function isIssue(obj: unknown): obj is Issue;
export declare function isAuditReport(obj: unknown): obj is AuditReport;
export declare function isSummary(obj: unknown): obj is Summary;
export declare function isPendingCheck(obj: unknown): obj is PendingCheck;
export declare function isThresholdConfig(obj: unknown): obj is ThresholdConfig;
export declare function isCliOptions(obj: unknown): obj is CliOptions;
//# sourceMappingURL=types.d.ts.map