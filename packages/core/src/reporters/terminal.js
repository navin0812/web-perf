/**
 * Render audit report to terminal (colored output)
 */
export function renderTerminalReport(report, threshold) {
    // ANSI color codes
    const color = (code, str) => `\x1b[${code}m${str}\x1b[0m`;
    const bold = (str) => `\x1b[1m${str}\x1b[0m`;
    const dim = (str) => `\x1b[2m${str}\x1b[0m`;
    const underline = (str) => `\x1b[4m${str}\x1b[0m`;
    // Header
    console.log("\n" + bold("═".repeat(80)));
    console.log(bold(color("36", "  web-perf Audit Report")));
    console.log(bold("═".repeat(80)));
    console.log(`  ${bold("URL:")} ${report.url}`);
    console.log(`  ${bold("Timestamp:")} ${new Date(report.timestamp).toLocaleString()}`);
    console.log(`  ${bold("Duration:")} ${report.duration}ms`);
    console.log(bold("─".repeat(80)));
    // Summary
    console.log(`\n  ${bold("Total Issues:")} ${color("33", report.summary.total.toString())}`);
    console.log(`  ${bold("Passed Checks:")} ${color("32", report.passed.length.toString())}`);
    // Severity table
    console.log("\n" + bold("  Severity Breakdown:"));
    Object.entries(report.summary.bySeverity).forEach(([sev, count]) => {
        let sevColor = "37";
        let icon = "○";
        if (sev === "critical") {
            sevColor = "31";
            icon = "✖";
        }
        else if (sev === "serious") {
            sevColor = "33";
            icon = "⚠";
        }
        else if (sev === "moderate") {
            sevColor = "35";
            icon = "◆";
        }
        else if (sev === "minor") {
            sevColor = "36";
            icon = "▪";
        }
        const bar = "█".repeat(Math.min(count, 40));
        console.log(`    ${color(sevColor, icon)} ${color(sevColor, sev.padEnd(10))}: ${color(sevColor, count.toString().padStart(3))} ${color(sevColor, bar)}`);
    });
    // Category table
    console.log("\n" + bold("  Category Breakdown:"));
    Object.entries(report.summary.byCategory)
        .filter(([_, count]) => count > 0)
        .forEach(([cat, count]) => {
        const bar = "▓".repeat(Math.min(count, 30));
        console.log(`    ${cat.padEnd(12)}: ${count.toString().padStart(3)} ${color("34", bar)}`);
    });
    // Threshold violations
    if (threshold) {
        console.log("\n" + bold("  Threshold Check:"));
        const violations = [];
        if (threshold.critical !== undefined &&
            report.summary.bySeverity.critical > threshold.critical) {
            violations.push(`Critical: ${report.summary.bySeverity.critical} > ${threshold.critical}`);
        }
        if (threshold.serious !== undefined &&
            report.summary.bySeverity.serious > threshold.serious) {
            violations.push(`Serious: ${report.summary.bySeverity.serious} > ${threshold.serious}`);
        }
        if (threshold.moderate !== undefined &&
            report.summary.bySeverity.moderate > threshold.moderate) {
            violations.push(`Moderate: ${report.summary.bySeverity.moderate} > ${threshold.moderate}`);
        }
        if (threshold.minor !== undefined &&
            report.summary.bySeverity.minor > threshold.minor) {
            violations.push(`Minor: ${report.summary.bySeverity.minor} > ${threshold.minor}`);
        }
        if (violations.length > 0) {
            console.log(color("31", `    ✖ THRESHOLD EXCEEDED:`));
            violations.forEach((v) => console.log(color("31", `      ${v}`)));
        }
        else {
            console.log(color("32", `    ✓ All thresholds passed`));
        }
    }
    // Detailed issues
    if (report.issues.length > 0) {
        console.log("\n" + bold("═".repeat(80)));
        console.log(bold(color("33", "  ISSUES FOUND")));
        console.log(bold("═".repeat(80)));
        report.issues.forEach((issue, index) => {
            const sevColor = issue.severity === "critical"
                ? "31"
                : issue.severity === "serious"
                    ? "33"
                    : issue.severity === "moderate"
                        ? "35"
                        : "36";
            const sevIcon = issue.severity === "critical"
                ? "✖"
                : issue.severity === "serious"
                    ? "⚠"
                    : issue.severity === "moderate"
                        ? "◆"
                        : "▪";
            console.log(`\n${color(sevColor, bold(`  ${sevIcon} Issue #${index + 1}: [${issue.severity.toUpperCase()}] ${issue.message}`))}`);
            console.log(`     ${dim("Category:")} ${issue.category}`);
            console.log(`     ${dim("Rule ID:")} ${issue.ruleId}`);
            if (issue.description) {
                console.log(`     ${dim("Description:")} ${issue.description}`);
            }
            // Element information
            if (issue.element) {
                console.log(`\n     ${bold(underline("Element Information:"))}`);
                console.log(`     ${dim("Selector:")} ${color("36", issue.element.selector)}`);
                if (issue.element.html) {
                    const htmlSnippet = issue.element.html.substring(0, 120);
                    const truncated = issue.element.html.length > 120 ? "..." : "";
                    console.log(`     ${dim("HTML:")} ${color("90", htmlSnippet + truncated)}`);
                }
                if (issue.element.failureSummary) {
                    console.log(`     ${dim("Failure:")} ${color("33", issue.element.failureSummary)}`);
                }
            }
            // WCAG information
            if (issue.wcag &&
                issue.wcag.id !== "N/A" &&
                issue.wcag.id !== "Unknown") {
                console.log(`\n     ${bold(underline("WCAG Guideline:"))}`);
                console.log(`     ${dim("WCAG:")} ${issue.wcag.id} (Level ${issue.wcag.level}) - ${issue.wcag.name}`);
            }
            // Fix guidance
            if (issue.fix) {
                console.log(`\n     ${bold(underline(color("32", "Fix Guidance:")))}`);
                console.log(`     ${issue.fix.description}`);
                if (issue.fix.code) {
                    console.log(`\n     ${dim("Code Example:")}`);
                    // Display code with basic formatting
                    const codeLines = issue.fix.code.split("\n");
                    codeLines.forEach((line) => {
                        console.log(`       ${color("90", line)}`);
                    });
                }
                if (issue.fix.learnMoreUrl) {
                    console.log(`\n     ${dim("Learn more:")} ${color("34", underline(issue.fix.learnMoreUrl))}`);
                }
            }
            console.log(`     ${dim("─".repeat(76))}`);
        });
    }
    else {
        console.log("\n" + color("32", bold("  ✓ No issues found! 🎉")));
    }
    // Passed checks
    if (report.passed.length > 0) {
        console.log("\n" + bold("═".repeat(80)));
        console.log(bold(color("32", "  PASSED CHECKS")));
        console.log(bold("═".repeat(80)));
        const grouped = report.passed.reduce((acc, check) => {
            if (!acc[check.category])
                acc[check.category] = [];
            acc[check.category].push(check);
            return acc;
        }, {});
        Object.entries(grouped).forEach(([category, checks]) => {
            console.log(`\n  ${bold(category.toUpperCase())} (${checks.length} checks)`);
            checks.slice(0, 5).forEach((check) => {
                console.log(`    ${color("32", "✓")} ${check.name}`);
            });
            if (checks.length > 5) {
                console.log(`    ${dim(`... and ${checks.length - 5} more checks passed`)}`);
            }
        });
    }
    // Footer
    console.log("\n" + bold("═".repeat(80)));
    if (report.summary.total === 0) {
        console.log(color("32", bold("  ✓ All checks passed!")));
    }
    else {
        console.log(`  ${color("33", bold("Audit completed with " + report.summary.total + " issue(s)"))}`);
    }
    console.log(bold("═".repeat(80)) + "\n");
}
//# sourceMappingURL=terminal.js.map