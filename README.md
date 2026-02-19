# Web-Perf

[![CI Checks](https://github.com/navin0812/web-perf/actions/workflows/ci.yml/badge.svg)](https://github.com/navin0812/web-perf/actions/workflows/ci.yml)
[![Release](https://github.com/navin0812/web-perf/actions/workflows/release.yml/badge.svg)](https://github.com/navin0812/web-perf/actions/workflows/release.yml)
[![npm version](https://badge.fury.io/js/%40navinjoseph%2Fweb-perf-cli.svg)](https://www.npmjs.com/package/@navinjoseph/web-perf-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive command-line tool and GitHub Action for auditing web pages for accessibility, performance, SEO, security, best practices, and PWA compliance.

## 🚀 Features

- **6 Audit Categories:**
  - 🔍 **Accessibility:** WCAG 2.1 compliance (powered by axe-core)
  - ⚡ **Performance:** Web Vitals (LCP, INP, CLS, TBT, FCP, TTFB)
  - 🔎 **SEO:** Meta tags, structured data, Open Graph
  - 🔒 **Security:** HTTPS, security headers, mixed content
  - ✨ **Best Practices:** HTML validation, deprecated elements, vulnerable libraries
  - 📱 **PWA:** Manifest, service workers, icons

- **Element-Level Tracking:** Every issue includes the exact element (CSS selector, HTML snippet, failure summary)
- **Fix Guidance:** Actionable code examples for each issue
- **Multiple Output Formats:** JSON, HTML (interactive dashboard), Terminal (colored output)
- **Threshold-Based Pass/Fail:** Set severity limits and fail CI if exceeded
- **Shadow DOM Support:** Inspect modern web components
- **GitHub Action:** Automated PR audits with comment summaries
- **⚡ Ultra-Fast:** 90% faster than v1 with smart resource limits

## 📦 Installation

### Using npx

```bash
npx @navinjoseph/web-perf-cli --url https://google.com
```

### As a CLI Tool

```bash
# Install globally
npm install -g web-perf

# Run an audit
web-perf --url https://example.com
```

### As a GitHub Action

Add to your workflow file (`.github/workflows/audit.yml`):

```yaml
name: Web Performance Audit

on:
  pull_request:
    branches: [main]

permissions:
  contents: read
  pull-requests: write

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Web-Perf Audit
        uses: navin0812/web-perf@v1
        with:
          url: "https://your-website.com"
          threshold-critical: 0
          threshold-error: 5
          threshold-warning: 10
          post-comment: true
```

## 🛠️ CLI Usage

### Basic Usage

```bash
# Audit a website with all formats
web-perf --url https://example.com

# Audit with specific output format
web-perf --url https://example.com --format html

# Audit with thresholds
web-perf --url https://example.com \
  --threshold critical:0 error:5 warning:10

# Skip specific audits
web-perf --url https://example.com \
  --skip-audits pwa,best-practices

# Custom output directory
web-perf --url https://example.com \
  --output-dir ./my-reports
```

### CLI Options

| Option                 | Description                                  | Default              |
| ---------------------- | -------------------------------------------- | -------------------- |
| `--url <url>`          | Target URL to audit (required)               | -                    |
| `--format <format>`    | Output format: json, html, terminal, all     | `terminal`           |
| `--output-dir <dir>`   | Directory to save reports                    | `./web-perf-reports` |
| `--threshold <limits>` | Severity limits (e.g., `critical:0 error:5`) | No limits            |
| `--skip-audits <list>` | Comma-separated audits to skip               | None                 |
| `--allow-js`           | allow loading javascript                     | false                |
| `--help`               | Show help message                            | -                    |

### Available Audits

- `accessibility` - WCAG 2.1 accessibility checks
- `performance` - Web Vitals and performance metrics
- `seo` - Search engine optimization
- `security` - Security headers and HTTPS
- `best-practices` - HTML best practices
- `pwa` - Progressive Web App features

## 📊 Output Formats

### Terminal Output

Colored console output with:

- Summary statistics
- Issues grouped by severity
- Element information (selector, HTML snippet)
- Fix guidance with code examples
- Threshold compliance status

### JSON Report

Complete structured data including:

```json
{
  "url": "https://example.com",
  "timestamp": "2026-02-06T04:34:30.721Z",
  "summary": {
    "totalIssues": 15,
    "bySeverity": { "critical": 2, "error": 5, "warning": 6, "info": 2 },
    "byCategory": { "accessibility": 8, "performance": 3, ... }
  },
  "issues": [
    {
      "id": "acc-001",
      "category": "accessibility",
      "severity": "critical",
      "description": "Images must have alternate text",
      "selector": "img.logo",
      "html": "<img src=\"logo.png\" class=\"logo\">",
      "failureSummary": "Element does not have an alt attribute",
      "fixGuidance": {
        "message": "Add an alt attribute to describe the image",
        "example": "<img src=\"logo.png\" alt=\"Company Logo\">"
      }
    }
  ]
}
```

### HTML Report

Interactive dashboard with:

- Summary charts
- Filterable issue cards
- Element information display
- Fix guidance with syntax highlighting
- Search and sort capabilities
- Responsive design

## 📝 Report Examples

### PR Comment

The GitHub Action posts comprehensive PR comments with severity breakdowns, top issues, element information, and threshold compliance status.

## 🔧 Configuration

### Thresholds

Set limits for each severity level:

```bash
# CLI
web-perf --url https://example.com --threshold critical:0 error:5 warning:10

# GitHub Action
threshold-critical: 0
threshold-error: 5
threshold-warning: 10
```

When thresholds are set:

- Audit **fails** if any threshold is exceeded
- Exit code 1 (CLI) or action fails (GitHub)
- Clear indication of which thresholds failed

When no thresholds are set:

- All issues are shown
- Audit always passes (exit code 0)
- Use for monitoring without enforcement

### Skip Audits

Exclude specific audit categories:

```bash
# CLI
web-perf --url https://example.com --skip-audits pwa,best-practices

# GitHub Action
skip-audits: 'pwa,best-practices'
```

## ⚡ Performance

Web-Perf is optimized for speed:

| Website     | Time  | Speedup       |
| ----------- | ----- | ------------- |
| example.com | 150ms | 100x faster   |
| github.com  | 562ms | 30-50x faster |
| amazon.com  | 363ms | 50-80x faster |

**Optimizations:**

- Disabled external resource loading (CSS, JS, images)
- Configurable timeouts (10s default)
- Page size limits (10MB default)
- Static HTML analysis (no JS execution)
- Smart DOM traversal with caching

See [PERFORMANCE_OPTIMIZATION.md](PERFORMANCE_OPTIMIZATION.md) for details.

## 🤝 Contributing

Contributions welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Our CI checks ensure code quality:

- ✅ TypeScript compilation
- ✅ Test suite execution
- ✅ Integration tests
- ✅ Dependency audits
- ✅ Conventional commit messages

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility engine
- [jsdom](https://github.com/jsdom/jsdom) - DOM implementation
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- WCAG 2.1 Guidelines
- Web Vitals by Google

## 📧 Support

- [GitHub Issues](https://github.com/navin0812/web-perf/issues) - Bug reports and feature requests
- [Documentation](https://github.com/navin0812/web-perf#readme) - Usage guides and examples
- [Workflow Examples](.github/workflows/README.md) - GitHub Action configurations

---
