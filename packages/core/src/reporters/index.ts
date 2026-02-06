import { AuditReport, ThresholdConfig } from "../types.js";
import { renderTerminalReport } from "./terminal.js";
import { renderJsonReport } from "./json.js";
import { renderHtmlReport } from "./html.js";
import { ReporterFormat } from "./types.js";

export function renderReport(
  report: AuditReport,
  format: ReporterFormat,
  threshold?: ThresholdConfig,
): string | void {
  switch (format) {
    case "terminal":
      renderTerminalReport(report, threshold);
      return;
    case "json":
      return renderJsonReport(report);
    case "html":
      return renderHtmlReport(report);
    default:
      throw new Error(`Unknown reporter format: ${format}`);
  }
}
