import chalk from "chalk";
import { runAudits, renderReport, } from "@navinjoseph/web-perf-core";
import { saveReport } from "./file-writer.js";
import { checkThresholds, formatThresholdViolations, } from "./threshold-checker.js";
/**
 * Main CLI entry point
 */
export async function runAudit(options) {
    console.log(chalk.blue("🔍 Starting web-perf audit...\n"));
    console.log(chalk.gray(`URL: ${options.url}`));
    console.log(chalk.gray(`Format: ${options.format}`));
    console.log(chalk.gray(`Allow JS: ${options.allowJs ? "Yes" : "No"}`));
    if (options.skipAudits && options.skipAudits.length > 0) {
        console.log(chalk.gray(`Skipping: ${options.skipAudits.join(", ")}`));
    }
    if (options.threshold) {
        console.log(chalk.gray(`Threshold: ${JSON.stringify(options.threshold)}`));
    }
    console.log();
    let report;
    try {
        // Run the audits
        console.log(chalk.yellow("⚙️  Running audits..."));
        report = await runAudits(options.url, {
            skipAudits: options.skipAudits,
            allowJs: options.allowJs || false,
        });
        console.log(chalk.green("✓ Audits completed\n"));
    }
    catch (error) {
        console.error(chalk.red("Failed to run audits:"), error instanceof Error ? error.message : error);
        return 1;
    }
    // Generate and output reports
    try {
        await generateReports(report, options);
    }
    catch (error) {
        console.error(chalk.red("Failed to generate reports:"), error instanceof Error ? error.message : error);
        return 1;
    }
    // Print summary
    printSummary(report);
    // Check thresholds
    const thresholdResult = checkThresholds(report, options.threshold);
    if (!thresholdResult.passed) {
        console.log();
        const violations = formatThresholdViolations(thresholdResult);
        if (violations) {
            console.log(chalk.red(violations));
        }
        console.log();
        console.log(chalk.red("❌ Build failed due to threshold violations"));
        return 1;
    }
    console.log();
    if (options.threshold) {
        console.log(chalk.green("✓ All threshold checks passed"));
    }
    console.log(chalk.green("✓ Audit completed successfully"));
    return 0;
}
/**
 * Generates reports in the requested format(s)
 */
async function generateReports(report, options) {
    const formats = options.format === "all" ? ["terminal", "json", "html"] : [options.format];
    for (const format of formats) {
        if (format === "terminal") {
            // Terminal output goes to stdout
            console.log(chalk.blue("📊 Report:\n"));
            renderReport(report, "terminal", options.threshold);
            console.log();
        }
        else {
            // JSON and HTML are saved to files
            console.log(chalk.yellow(`📝 Generating ${format.toUpperCase()} report...`));
            const content = renderReport(report, format, options.threshold);
            if (content) {
                const filePath = saveReport(report, content, options.outputDir, format);
                console.log(chalk.green(`✓ ${format.toUpperCase()} report saved: ${filePath}`));
            }
        }
    }
}
/**
 * Prints a summary of the audit results
 */
function printSummary(report) {
    const { summary } = report;
    console.log(chalk.bold("\n📈 Summary:"));
    console.log(`  Total issues: ${chalk.yellow(summary.total.toString())}`);
    console.log(`  Critical: ${chalk.red(summary.bySeverity.critical.toString())}`);
    console.log(`  Serious: ${chalk.yellow(summary.bySeverity.serious.toString())}`);
    console.log(`  Moderate: ${chalk.blue(summary.bySeverity.moderate.toString())}`);
    console.log(`  Minor: ${chalk.gray(summary.bySeverity.minor.toString())}`);
    console.log(`  Passed checks: ${chalk.green(summary.passed.toString())}`);
    console.log(`  Duration: ${chalk.gray(`${(report.duration / 1000).toFixed(2)}s`)}`);
}
//# sourceMappingURL=index.js.map