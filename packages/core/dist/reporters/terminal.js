/**
 * Render audit report to terminal (colored output)
 */
export function renderTerminalReport(report) {
    // Simple colored output using ANSI codes
    // (In CLI, use chalk or colorette for better UX)
    const color = (code, str) => `\x1b[${code}m${str}\x1b[0m`;
    const bold = (str) => `\x1b[1m${str}\x1b[0m`;
    console.log(bold("\nweb-perf Audit Report"));
    console.log(`URL: ${report.url}`);
    console.log(`Duration: ${report.duration}ms`);
    console.log(`Total Issues: ${report.summary.total}`);
    // Severity table
    console.log("\nSeverity Counts:");
    Object.entries(report.summary.bySeverity).forEach(([sev, count]) => {
        let sevColor = "37";
        if (sev === "critical")
            sevColor = "31";
        else if (sev === "serious")
            sevColor = "33";
        else if (sev === "moderate")
            sevColor = "35";
        else if (sev === "minor")
            sevColor = "36";
        console.log(`  ${color(sevColor, sev.padEnd(8))}: ${count}`);
    });
    // Category table
    console.log("\nCategory Counts:");
    Object.entries(report.summary.byCategory).forEach(([cat, count]) => {
        console.log(`  ${cat.padEnd(12)}: ${count}`);
    });
    // Top issues
    if (report.issues.length) {
        console.log("\nTop Issues:");
        report.issues.slice(0, 10).forEach((issue) => {
            const sevColor = issue.severity === "critical"
                ? "31"
                : issue.severity === "serious"
                    ? "33"
                    : issue.severity === "moderate"
                        ? "35"
                        : "36";
            console.log(`${color(sevColor, `[${issue.severity.toUpperCase()}]`)} ${issue.message} (${issue.category})`);
            if (issue.description) {
                console.log(`    ${color("90", issue.description)}`);
            }
            if (issue.wcag) {
                console.log(`    ${color("36", "WCAG:")} ${issue.wcag.id} (Level ${issue.wcag.level}) - ${issue.wcag.name}`);
            }
            if (issue.fix?.description) {
                console.log(`    ${color("32", "Fix:")} ${issue.fix.description}`);
            }
        });
    }
    else {
        console.log("\nNo issues found! 🎉");
    }
    // Passed checks
    if (report.passed.length) {
        console.log("\nPassed Checks:");
        report.passed.slice(0, 10).forEach((check) => {
            console.log(`  ${color("32", check.name)} (${check.category})`);
        });
    }
    // Threshold violations
    if (report.summary.total === 0) {
        console.log(color("32", "\nAll checks passed!"));
    }
}
//# sourceMappingURL=terminal.js.map