import { AuditReport } from "../types.js";

/**
 * Render audit report as JSON string
 */
export function renderJsonReport(report: AuditReport): string {
  return JSON.stringify(report, null, 2);
}
