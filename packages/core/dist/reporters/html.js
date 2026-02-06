/**
 * Render audit report as a simple HTML dashboard
 */
export function renderHtmlReport(report) {
    // Simple HTML output (expand as needed)
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>web-perf Audit Report</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; }
    h1 { color: #1a73e8; }
    .critical { color: #d32f2f; }
    .serious { color: #fbc02d; }
    .moderate { color: #7b1fa2; }
    .minor { color: #0288d1; }
    .passed { color: #388e3c; }
    .issue { margin-bottom: 1.2em; }
    .fix { color: #388e3c; font-size: 0.95em; }
    .desc { color: #555; font-size: 0.97em; }
    .cat { font-size: 0.95em; color: #888; }
  </style>
</head>
<body>
  <h1>web-perf Audit Report</h1>
  <div><b>URL:</b> ${report.url}</div>
  <div><b>Duration:</b> ${report.duration}ms</div>
  <div><b>Total Issues:</b> ${report.summary.total}</div>
  <h2>Severity Counts</h2>
  <ul>
    ${Object.entries(report.summary.bySeverity)
        .map(([sev, count]) => `<li class="${sev}">${sev}: ${count}</li>`)
        .join("")}
  </ul>
  <h2>Category Counts</h2>
  <ul>
    ${Object.entries(report.summary.byCategory)
        .map(([cat, count]) => `<li>${cat}: ${count}</li>`)
        .join("")}
  </ul>
  <h2>Top Issues</h2>
  ${report.issues.length
        ? report.issues
            .slice(0, 10)
            .map((issue) => `
    <div class="issue ${issue.severity}">
      <b>[${issue.severity.toUpperCase()}]</b> ${issue.message} <span class="cat">(${issue.category})</span><br>
      <span class="desc">${issue.description || ""}</span><br>
      ${issue.fix?.description ? `<span class="fix">Fix: ${issue.fix.description}</span><br>` : ""}
    </div>
  `)
            .join("")
        : "<div>No issues found! 🎉</div>"}
  <h2>Passed Checks</h2>
  <ul>
    ${report.passed
        .slice(0, 10)
        .map((check) => `<li class="passed">${check.name} (${check.category})</li>`)
        .join("")}
  </ul>
</body>
</html>`;
}
//# sourceMappingURL=html.js.map