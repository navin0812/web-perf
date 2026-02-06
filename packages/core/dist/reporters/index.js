import { renderTerminalReport } from "./terminal.js";
import { renderJsonReport } from "./json.js";
import { renderHtmlReport } from "./html.js";
export function renderReport(report, format) {
    switch (format) {
        case "terminal":
            renderTerminalReport(report);
            return;
        case "json":
            return renderJsonReport(report);
        case "html":
            return renderHtmlReport(report);
        default:
            throw new Error(`Unknown reporter format: ${format}`);
    }
}
//# sourceMappingURL=index.js.map