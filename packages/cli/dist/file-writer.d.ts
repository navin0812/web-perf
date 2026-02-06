import { AuditReport } from "@web-perf/core";
/**
 * Ensures a directory exists, creating it if necessary
 */
export declare function ensureDirectory(dir: string): void;
/**
 * Writes a file to disk
 */
export declare function writeFile(filePath: string, content: string): void;
/**
 * Generates a safe filename from a URL
 */
export declare function generateFilename(url: string, extension: string): string;
/**
 * Saves a report to disk in the specified format
 */
export declare function saveReport(report: AuditReport, content: string, outputDir: string, format: string): string;
//# sourceMappingURL=file-writer.d.ts.map