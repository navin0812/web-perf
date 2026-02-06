/**
 * Render audit report as an interactive HTML dashboard
 */
export function renderHtmlReport(report) {
    const issuesJson = JSON.stringify(report.issues);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>web-perf Audit Report - ${report.url}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      color: #333;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem 2.5rem;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-info {
      opacity: 0.95;
      font-size: 0.95rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .header-info-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.75rem 1rem;
      border-radius: 6px;
      backdrop-filter: blur(10px);
    }

    .header-info-label {
      font-size: 0.8rem;
      opacity: 0.8;
      margin-bottom: 0.25rem;
    }

    .header-info-value {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .content {
      padding: 2.5rem;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .summary-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .summary-card h3 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1rem;
      color: #555;
    }

    .severity-grid, .category-grid {
      display: grid;
      gap: 0.5rem;
    }

    .severity-item, .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: white;
      border-radius: 6px;
      border-left: 4px solid #ccc;
    }

    .severity-item.critical { border-left-color: #d32f2f; }
    .severity-item.serious { border-left-color: #f57c00; }
    .severity-item.moderate { border-left-color: #7b1fa2; }
    .severity-item.minor { border-left-color: #0288d1; }

    .severity-item .badge {
      background: #eee;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .severity-item.critical .badge { background: #ffcdd2; color: #d32f2f; }
    .severity-item.serious .badge { background: #ffe0b2; color: #f57c00; }
    .severity-item.moderate .badge { background: #e1bee7; color: #7b1fa2; }
    .severity-item.minor .badge { background: #b3e5fc; color: #0288d1; }

    .filters {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
      margin-bottom: 2rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }

    .filter-group {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .filter-label {
      font-weight: 600;
      font-size: 0.9rem;
      color: #555;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .filter-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-box input {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .search-box input:focus {
      outline: none;
      border-color: #667eea;
    }

    .issues-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .issue-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      padding: 1.5rem;
      transition: all 0.3s;
      border-left: 6px solid #ccc;
    }

    .issue-card:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .issue-card.critical { border-left-color: #d32f2f; }
    .issue-card.serious { border-left-color: #f57c00; }
    .issue-card.moderate { border-left-color: #7b1fa2; }
    .issue-card.minor { border-left-color: #0288d1; }

    .issue-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .issue-title {
      flex: 1;
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }

    .issue-badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge.critical { background: #ffcdd2; color: #d32f2f; }
    .badge.serious { background: #ffe0b2; color: #f57c00; }
    .badge.moderate { background: #e1bee7; color: #7b1fa2; }
    .badge.minor { background: #b3e5fc; color: #0288d1; }
    .badge.category { background: #e8eaf6; color: #3f51b5; }

    .issue-description {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .issue-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .issue-section-title {
      font-weight: 600;
      font-size: 0.9rem;
      color: #555;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .element-info {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .element-selector {
      font-family: 'Courier New', monospace;
      color: #0288d1;
      background: white;
      padding: 0.5rem;
      border-radius: 4px;
      margin: 0.5rem 0;
      word-break: break-all;
    }

    .element-html {
      font-family: 'Courier New', monospace;
      color: #666;
      background: white;
      padding: 0.5rem;
      border-radius: 4px;
      margin: 0.5rem 0;
      font-size: 0.85rem;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .wcag-info {
      background: #e3f2fd;
      padding: 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .fix-guidance {
      background: #e8f5e9;
      padding: 1rem;
      border-radius: 6px;
    }

    .fix-description {
      color: #2e7d32;
      margin-bottom: 0.75rem;
      font-weight: 500;
    }

    .code-block {
      background: #263238;
      color: #aed581;
      padding: 1rem;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      overflow-x: auto;
      margin: 0.5rem 0;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .learn-more {
      margin-top: 0.75rem;
      font-size: 0.9rem;
    }

    .learn-more a {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
    }

    .learn-more a:hover {
      text-decoration: underline;
    }

    .passed-section {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f1f8f4;
      border-radius: 10px;
      border-left: 6px solid #4caf50;
    }

    .passed-section h2 {
      color: #2e7d32;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .passed-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 0.75rem;
    }

    .passed-item {
      background: white;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .no-issues {
      text-align: center;
      padding: 4rem 2rem;
      font-size: 1.5rem;
      color: #4caf50;
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      color: #999;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }

      .header h1 {
        font-size: 1.8rem;
      }

      .content {
        padding: 1.5rem;
      }

      .summary {
        grid-template-columns: 1fr;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group {
        flex-direction: column;
        align-items: stretch;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔍 web-perf Audit Report</h1>
      <div class="header-info">
        <div class="header-info-item">
          <div class="header-info-label">URL</div>
          <div class="header-info-value" style="font-size: 0.9rem; word-break: break-all;">${report.url}</div>
        </div>
        <div class="header-info-item">
          <div class="header-info-label">Timestamp</div>
          <div class="header-info-value">${new Date(report.timestamp).toLocaleString()}</div>
        </div>
        <div class="header-info-item">
          <div class="header-info-label">Duration</div>
          <div class="header-info-value">${report.duration}ms</div>
        </div>
        <div class="header-info-item">
          <div class="header-info-label">Total Issues</div>
          <div class="header-info-value">${report.summary.total}</div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="summary">
        <div class="summary-card">
          <h3>📊 Severity Breakdown</h3>
          <div class="severity-grid">
            ${Object.entries(report.summary.bySeverity)
        .map(([sev, count]) => `
              <div class="severity-item ${sev}">
                <span>${sev.charAt(0).toUpperCase() + sev.slice(1)}</span>
                <span class="badge">${count}</span>
              </div>
            `)
        .join("")}
          </div>
        </div>

        <div class="summary-card">
          <h3>📁 Category Breakdown</h3>
          <div class="category-grid">
            ${Object.entries(report.summary.byCategory)
        .filter(([_, count]) => count > 0)
        .map(([cat, count]) => `
              <div class="category-item">
                <span>${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <span class="badge">${count}</span>
              </div>
            `)
        .join("")}
          </div>
        </div>
      </div>

      ${report.issues.length > 0
        ? `
      <div class="filters">
        <div class="filter-group">
          <span class="filter-label">Severity:</span>
          <button class="filter-btn active" data-severity="all">All</button>
          <button class="filter-btn" data-severity="critical">Critical</button>
          <button class="filter-btn" data-severity="serious">Serious</button>
          <button class="filter-btn" data-severity="moderate">Moderate</button>
          <button class="filter-btn" data-severity="minor">Minor</button>
        </div>
        <div class="filter-group">
          <span class="filter-label">Category:</span>
          <button class="filter-btn active" data-category="all">All</button>
          ${Array.from(new Set(report.issues.map((i) => i.category)))
            .map((cat) => `<button class="filter-btn" data-category="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>`)
            .join("")}
        </div>
        <div class="search-box">
          <span class="filter-label">🔍</span>
          <input type="text" id="searchInput" placeholder="Search issues...">
        </div>
      </div>

      <div class="issues-container" id="issuesContainer"></div>
      <div class="no-results" id="noResults" style="display: none;">
        No issues match your filters
      </div>
      `
        : `
      <div class="no-issues">
        🎉 No issues found! Your website passed all checks.
      </div>
      `}

      ${report.passed.length > 0
        ? `
      <div class="passed-section">
        <h2>✅ Passed Checks (${report.passed.length})</h2>
        <div class="passed-grid">
          ${report.passed
            .map((check) => `
            <div class="passed-item">
              <span style="color: #4caf50;">✓</span>
              <span>${check.name}</span>
            </div>
          `)
            .join("")}
        </div>
      </div>
      `
        : ""}
    </div>
  </div>

  <script>
    const issues = ${issuesJson};
    let currentFilters = { severity: 'all', category: 'all', search: '' };

    function renderIssues() {
      const container = document.getElementById('issuesContainer');
      const noResults = document.getElementById('noResults');
      
      const filteredIssues = issues.filter(issue => {
        const matchesSeverity = currentFilters.severity === 'all' || issue.severity === currentFilters.severity;
        const matchesCategory = currentFilters.category === 'all' || issue.category === currentFilters.category;
        const matchesSearch = !currentFilters.search || 
          issue.message.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          issue.description.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          issue.ruleId.toLowerCase().includes(currentFilters.search.toLowerCase());
        
        return matchesSeverity && matchesCategory && matchesSearch;
      });

      if (filteredIssues.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
      }

      container.style.display = 'flex';
      noResults.style.display = 'none';

      container.innerHTML = filteredIssues.map((issue, index) => {
        let html = \`
          <div class="issue-card \${issue.severity}">
            <div class="issue-header">
              <div class="issue-title">\${issue.message}</div>
              <div class="issue-badges">
                <span class="badge \${issue.severity}">\${issue.severity}</span>
                <span class="badge category">\${issue.category}</span>
              </div>
            </div>
            <div class="issue-description">\${issue.description || ''}</div>
        \`;

        // Element information
        if (issue.element) {
          html += \`
            <div class="issue-section">
              <div class="issue-section-title">🎯 Element Information</div>
              <div class="element-info">
                <div><strong>Selector:</strong></div>
                <div class="element-selector">\${issue.element.selector}</div>
                \${issue.element.html ? \`
                  <div style="margin-top: 0.75rem;"><strong>HTML:</strong></div>
                  <div class="element-html">\${escapeHtml(issue.element.html)}</div>
                \` : ''}
                \${issue.element.failureSummary ? \`
                  <div style="margin-top: 0.75rem;"><strong>Failure:</strong> \${issue.element.failureSummary}</div>
                \` : ''}
              </div>
            </div>
          \`;
        }

        // WCAG information
        if (issue.wcag && issue.wcag.id !== 'N/A' && issue.wcag.id !== 'Unknown') {
          html += \`
            <div class="issue-section">
              <div class="issue-section-title">📋 WCAG Guideline</div>
              <div class="wcag-info">
                <strong>WCAG \${issue.wcag.id}</strong> (Level \${issue.wcag.level})<br>
                \${issue.wcag.name}<br>
                <small style="color: #666;">\${issue.wcag.description}</small>
              </div>
            </div>
          \`;
        }

        // Fix guidance
        if (issue.fix) {
          html += \`
            <div class="issue-section">
              <div class="issue-section-title">🔧 Fix Guidance</div>
              <div class="fix-guidance">
                <div class="fix-description">\${issue.fix.description}</div>
                \${issue.fix.code ? \`
                  <div><strong>Code Example:</strong></div>
                  <div class="code-block">\${escapeHtml(issue.fix.code)}</div>
                \` : ''}
                \${issue.fix.learnMoreUrl ? \`
                  <div class="learn-more">
                    <a href="\${issue.fix.learnMoreUrl}" target="_blank" rel="noopener">Learn more →</a>
                  </div>
                \` : ''}
              </div>
            </div>
          \`;
        }

        html += '</div>';
        return html;
      }).join('');
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Filter buttons
    document.querySelectorAll('[data-severity]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-severity]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilters.severity = btn.dataset.severity;
        renderIssues();
      });
    });

    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilters.category = btn.dataset.category;
        renderIssues();
      });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        renderIssues();
      });
    }

    // Initial render
    if (issues.length > 0) {
      renderIssues();
    }
  </script>
</body>
</html>`;
}
//# sourceMappingURL=html.js.map