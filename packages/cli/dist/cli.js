#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { runAudit } from "./index.ts";
const program = new Command();
program
    .name("web-perf")
    .description("Web Performance & Accessibility Audit Tool")
    .version("1.0.0")
    .requiredOption("-u, --url <url>", "URL to audit")
    .option("-f, --format <format>", "Output format: json, html, terminal, all", "terminal")
    .option("-o, --output-dir <dir>", "Output directory for reports", "./web-perf-reports")
    .option("-t, --threshold <json>", 'Threshold configuration as JSON (e.g., \'{"critical":0,"serious":5}\')')
    .option("-s, --skip-audits <audits>", "Comma-separated list of audits to skip (accessibility,performance,seo,security,best-practices,pwa)")
    .option("--no-color", "Disable colored output")
    .option("--allow-js", "Allow JavaScript execution during audits")
    .addHelpText("after", `
Examples:
  $ web-perf --url https://example.com
  $ web-perf --url https://example.com --format all --output-dir ./reports
  $ web-perf --url https://example.com --threshold '{"critical":0,"serious":10}'
  $ web-perf --url https://example.com --skip-audits accessibility,pwa
  $ web-perf --url https://example.com --format json --output-dir ./output
  $ web-pref --url https://example.com --allow-js 

Formats:
  terminal    Print colored report to console (default)
  json        Save JSON report to file
  html        Save HTML dashboard to file
  all         Generate all formats

Threshold:
  Set maximum allowed issues by severity. CI will fail if exceeded.
  Format: {"critical":0,"serious":5,"moderate":10,"minor":20}
  If not set, all issues are shown without failing the build.
    `);
program.parse();
const options = program.opts();
// Validate URL
try {
    new URL(options.url);
}
catch (error) {
    console.error(chalk.red(`Error: Invalid URL "${options.url}"`));
    process.exit(1);
}
// Validate format
const validFormats = ["json", "html", "terminal", "all"];
if (!validFormats.includes(options.format)) {
    console.error(chalk.red(`Error: Invalid format "${options.format}". Must be one of: ${validFormats.join(", ")}`));
    process.exit(1);
}
// Parse threshold
let threshold;
if (options.threshold) {
    try {
        threshold = JSON.parse(options.threshold);
        // Validate threshold structure
        const validKeys = ["critical", "serious", "moderate", "minor"];
        for (const key of Object.keys(threshold || {})) {
            if (!validKeys.includes(key)) {
                throw new Error(`Invalid threshold key: ${key}`);
            }
            if (threshold &&
                typeof threshold[key] !== "number") {
                throw new Error(`Threshold value for "${key}" must be a number`);
            }
        }
    }
    catch (error) {
        console.error(chalk.red(`Error: Invalid threshold JSON. ${error instanceof Error ? error.message : "Unknown error"}`));
        process.exit(1);
    }
}
// Parse skip audits
let skipAudits;
if (options.skipAudits) {
    skipAudits = options.skipAudits.split(",").map((s) => s.trim());
    const validAudits = [
        "accessibility",
        "performance",
        "seo",
        "security",
        "best-practices",
        "pwa",
    ];
    if (skipAudits) {
        for (const audit of skipAudits) {
            if (!validAudits.includes(audit)) {
                console.error(chalk.red(`Error: Invalid audit name "${audit}". Must be one of: ${validAudits.join(", ")}`));
                process.exit(1);
            }
        }
    }
}
// Run the audit
runAudit({
    url: options.url,
    format: options.format,
    outputDir: options.outputDir,
    threshold,
    skipAudits,
    allowJs: options.allowJs || false,
})
    .then((exitCode) => {
    process.exit(exitCode);
})
    .catch((error) => {
    console.error(chalk.red("Fatal error:"), error);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map