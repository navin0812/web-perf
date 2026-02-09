import fs from "fs";
import path from "path";
/**
 * Ensures a directory exists, creating it if necessary
 */
export function ensureDirectory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
/**
 * Writes a file to disk
 */
export function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    ensureDirectory(dir);
    fs.writeFileSync(filePath, content, "utf-8");
}
/**
 * Generates a safe filename from a URL
 */
export function generateFilename(url, extension) {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/[^a-z0-9]/gi, "-");
    const pathname = urlObj.pathname.replace(/[^a-z0-9]/gi, "-");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    let filename = `${hostname}`;
    if (pathname && pathname !== "-") {
        filename += pathname;
    }
    filename += `_${timestamp}.${extension}`;
    return filename;
}
/**
 * Saves a report to disk in the specified format
 */
export function saveReport(report, content, outputDir, format) {
    const extension = format === "html" ? "html" : "json";
    const filename = generateFilename(report.url, extension);
    const filePath = path.join(outputDir, filename);
    writeFile(filePath, content);
    return filePath;
}
//# sourceMappingURL=file-writer.js.map