// Type guards
export function isIssue(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        "id" in obj &&
        "ruleId" in obj &&
        "severity" in obj);
}
export function isAuditReport(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        "url" in obj &&
        "issues" in obj &&
        Array.isArray(obj.issues));
}
export function isSummary(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        "total" in obj &&
        "bySeverity" in obj);
}
export function isPendingCheck(obj) {
    return (typeof obj === "object" && obj !== null && "id" in obj && "name" in obj);
}
export function isThresholdConfig(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        ("critical" in obj ||
            "serious" in obj ||
            "moderate" in obj ||
            "minor" in obj));
}
export function isCliOptions(obj) {
    return typeof obj === "object" && obj !== null && "url" in obj;
}
//# sourceMappingURL=types.js.map