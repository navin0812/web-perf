# Web-Perf: Web Performance & Accessibility Audit Tool

## Product Overview

**web-Perf** is a command-line tool that audits web pages for accessibility, performance, SEO, and security issues. It can inspect Shadow DOM elements and provides comprehensive reports in multiple formats (JSON, HTML, Terminal). It includes a GitHub Action for CI/CD integration.

**Key Features:**

- Audit 4 categories: Accessibility (WCAG 2.1), Performance (Web Vitals), SEO, Security
- Shadow DOM support for modern web components
- Multiple output formats: JSON, HTML (interactive dashboard), Terminal (colored output)
- Threshold-based pass/fail: Set severity limits and fail CI if exceeded
- Show all results when no thresholds set (full transparency)
- Powered by axe-core npm package for accessibility
- GitHub Action for automated PR audits

---

## Implementation Tasks - Step by Step

### ✅ PHASE 1: CORE AUDIT MODULES (COMPLETED)

**1.1 Project Structure** ✅

- [x] Monorepo with npm workspaces
- [x] packages/core and packages/cli directories
- [x] TypeScript configuration

**1.2 Type System** ✅

- [x] Issue, AuditReport, Summary, ThresholdConfig interfaces
- [x] Complete type safety

**1.3 Browser Module** ✅

- [x] jsdom wrapper with Shadow DOM support
- [x] Page loading with error handling
- [x] Element selector utility

**1.4 Accessibility Audit** ✅

- [x] axe-core npm integration
- [x] 38 WCAG rules configured
- [x] Violation transformation with fix guidance
- [x] WCAG mapping constants

**1.5 SEO Audit** ✅

- [x] Title & meta description validation
- [x] H1, viewport, HTTPS checks
- [x] Open Graph & structured data
- [x] Canonical URL verification

**1.6 Security Audit** ✅

- [x] HTTPS enforcement check
- [x] Mixed content detection
- [x] Security headers validation
- [x] External link safety checks
- [x] Password field security

### 📋 PHASE 2: ADDITIONAL AUDITS & ORCHESTRATOR (COMPLETED) ✅

**2.1 Performance Audit Module** ✅

- [x] Web Vitals: LCP, INP, CLS, TBT, FCP, TTFB (heuristic-based)
- [x] Resource analysis: count, size, images, JavaScript
- [x] Layout-shifting element tracking
- [x] Long task identification
- [x] Performance recommendations

**2.2 Best Practices Audit Module** ✅

- [x] DOCTYPE declaration validation
- [x] Character encoding check
- [x] HTML lang attribute
- [x] Deprecated HTML elements (marquee, blink, font, center)
- [x] Duplicate ID validation
- [x] Broken images detection
- [x] Empty/invalid links
- [x] Meta refresh detection
- [x] Image sizing and aspect ratio
- [x] Vulnerable library detection (jQuery, lodash, Angular 1.x, Bootstrap)
- [x] Password paste prevention
- [x] Intrusive notifications/geolocation

**2.3 PWA Audit Module** ✅

- [x] Web app manifest detection
- [x] Manifest validation (name, icons, start_url, display, theme_color)
- [x] Icon sizes (192x192, 512x512)
- [x] Service worker registration check
- [x] HTTPS requirement
- [x] Viewport meta tag
- [x] Apple touch icon
- [x] Theme color meta tag

**2.4 Result Formatter** ✅

- [x] Normalize results across all 6 audits
- [x] Generate summary statistics
- [x] Transform to Issue objects
- [x] Implement threshold checking

**2.5 Audit Orchestrator** ✅

- [x] Coordinate all 6 audits (accessibility, performance, SEO, security, best-practices, pwa)
- [x] Parallel execution
- [x] Error handling & retry logic
- [x] Timing/duration tracking

### 📋 PHASE 3: OUTPUT REPORTERS (AFTER PHASE 2)

**3.1 Terminal Reporter** (TODO)

- [ ] Colored console output
- [ ] Severity/category tables
- [ ] Summary section with stats
- [ ] Threshold violation warnings
- [ ] Passed checks display

**3.2 JSON Reporter** (TODO)

- [ ] Complete structured export
- [ ] All issue details
- [ ] Summary statistics

**3.3 HTML Reporter** (TODO)

- [ ] Interactive dashboard
- [ ] Issue cards with filters
- [ ] Summary charts
- [ ] Inline CSS styling

### ✅ PHASE 4: CLI TOOL (COMPLETED)

**4.1 CLI Argument Parser** ✅

- [x] --url flag for target URL
- [x] --format [json|html|terminal|all]
- [x] --output-dir for report location
- [x] --threshold for severity limits
- [x] --skip-audits to exclude checks
- [x] Help/usage documentation

**4.2 CLI Entry Point** ✅

- [x] Create bin/cli.js executable
- [x] Main CLI flow implementation
- [x] Error handling & user feedback
- [x] Exit codes (0=pass, 1=fail)

**4.3 Output File Generation** ✅

- [x] Save JSON to disk
- [x] Save HTML to disk
- [x] Print terminal to stdout
- [x] Create directory structure

**4.4 Threshold Logic** ✅

- [x] Parse threshold config
- [x] Check against limits
- [x] Show appropriate messages
- [x] Return correct exit codes

### 📋 PHASE 5: GITHUB ACTION (AFTER PHASE 4)

**5.1 Action Workflow** (TODO)

- [ ] Create .github/workflows/audit.yml
- [ ] Define inputs: url, thresholds, skip-audits, formats

**5.2 Execution** (TODO)

- [ ] Run web-Perf CLI on target
- [ ] Parse results
- [ ] Generate artifacts

**5.3 Failure & Reporting** (TODO)

- [ ] Threshold-based failure logic
- [ ] PR comment with summary
- [ ] Issue table by category
- [ ] Report links

**5.4 Artifact Management** (TODO)

- [ ] Upload JSON artifact
- [ ] Upload HTML artifact
- [ ] 30-day retention

### 📋 PHASE 6: TESTING & DOCUMENTATION (FINAL)

**6.1 Testing** (TODO)

- [ ] Sample websites (google.com, github.com)
- [ ] Shadow DOM detection
- [ ] Compare vs WatchDog extension
- [ ] Threshold validation
- [ ] All output formats

**6.2 Documentation** (TODO)

- [ ] README.md with examples
- [ ] Installation guide
- [ ] CLI options reference
- [ ] GitHub Action guide
- [ ] Troubleshooting

**6.3 Publishing** (TODO)

- [ ] npm package preparation
- [ ] Metadata configuration
- [ ] Release notes
- [ ] npm registry publish

---

## Current Status

**✅ Completed:**

- Phase 1: Core audit modules (accessibility, SEO, security)
- Phase 2: Additional audits & orchestrator (performance, best-practices, PWA, formatter, orchestrator)
- Phase 4: CLI Tool (argument parser, main logic, file generation, threshold validation)
- 11 files created in packages/core/src:
  - types.ts, browser.ts, index.ts
  - audits/accessibility.ts, audits/seo.ts, audits/security.ts
  - audits/performance.ts, audits/best-practices.ts, audits/pwa.ts
  - audits/constants.ts
  - formatter.ts, orchestrator.ts
- 4 files created in packages/cli/src:
  - cli.ts, index.ts, file-writer.ts, threshold-checker.ts

**⏳ Next Phase:**

- Phase 3: Output reporters (Terminal, JSON, HTML) - Note: Reporter stubs exist but need full implementation
- Phase 5: GitHub Action

**Next Action:**
Ready to implement Phase 3 (output reporters) or other phases as needed.
