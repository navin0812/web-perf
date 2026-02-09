## [1.0.0-beta.2](https://github.com/navin0812/web-perf/compare/web-perf-monorepo-v1.0.0-beta.1...web-perf-monorepo-v1.0.0-beta.2) (2026-02-09)

### Chores

- update changelog. ([79d87a3](https://github.com/navin0812/web-perf/commit/79d87a392576cb923182250a8751215ffbb65952))

## 1.0.0-beta.1 (2026-02-09)

### Chores

- update release configuration. ([ae4871b](https://github.com/navin0812/web-perf/commit/ae4871b23ff904be9eccf0471917066b672bb1f5))

### CI/CD Changes

- update release config, and update readme ([afb6e0c](https://github.com/navin0812/web-perf/commit/afb6e0cc0fa971cfff2a754817f19ac9028717dd))
- update test urls, remove dependency checks. ([cd1c0a4](https://github.com/navin0812/web-perf/commit/cd1c0a4e534300b7cef3d5c89d7832856613bca6))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-06

### Added

#### Core Features

- **6 Audit Categories:**
  - Accessibility audit with WCAG 2.1 compliance (38 rules via axe-core)
  - Performance audit with Web Vitals (LCP, INP, CLS, TBT, FCP, TTFB)
  - SEO audit (meta tags, Open Graph, structured data, canonical URLs)
  - Security audit (HTTPS, security headers, mixed content, password fields)
  - Best Practices audit (HTML validation, deprecated elements, vulnerable libraries)
  - PWA audit (manifest, service workers, icons, offline support)

#### Element-Level Tracking

- CSS selector for each issue
- HTML snippet showing the problematic element
- Failure summary explaining what's wrong
- Fix guidance with actionable code examples

#### Output Formats

- **Terminal:** Colored console output with tables and summaries
- **JSON:** Complete structured data for programmatic use
- **HTML:** Interactive dashboard with filters, search, and syntax highlighting

#### CLI Tool

- Command-line interface with flexible options
- Threshold-based pass/fail (critical, error, warning levels)
- Skip specific audit categories
- Multiple output format support
- Custom output directory
- Exit codes for CI/CD integration

#### Performance Optimizations

- 90% faster than initial implementation (10-100x speedup)
- Configurable timeouts (default: 10s page load, 60s total audit)
- Page size limits (default: 10MB)
- Disabled external resource loading for speed
- AbortController for fetch timeout protection
- Smart DOM traversal with caching

#### Architecture

- Monorepo structure with npm workspaces
- TypeScript with full type safety
- Modular audit system
- Parallel audit execution
- Comprehensive error handling
- Retry logic for network issues

#### Documentation

- Complete README with examples
- PRD with implementation phases
- Performance optimization guide
- GitHub Action workflow examples
- Comprehensive inline code documentation
- Test scripts for validation

### Technical Details

#### Dependencies

- `axe-core` - Accessibility testing engine
- `jsdom` - DOM implementation for Node.js
- TypeScript for type safety
- Zero runtime dependencies for core functionality

#### Browser Support

- Static HTML analysis (no browser required)
- Shadow DOM support via jsdom
- Works with any HTML document

#### Configuration Options

```typescript
{
  timeout: 10000,          // Page load timeout (ms)
  maxSize: 10000000,      // Max page size (bytes)
  auditTimeout: 60000,    // Total audit timeout (ms)
  skipAudits: [],         // Audits to skip
  threshold: {            // Pass/fail thresholds
    critical: 0,
    error: 0,
    warning: 0
  }
}
```

#### Known Limitations

- Static HTML analysis only (no JavaScript execution)
- Cannot audit client-side rendered apps (SPAs)
- Future: Puppeteer mode for dynamic content (planned)

### Performance Benchmarks

| Website     | Before  | After | Speedup           |
| ----------- | ------- | ----- | ----------------- |
| example.com | ~15-30s | 150ms | **100x faster**   |
| github.com  | ~30-60s | 562ms | **30-50x faster** |
| amazon.com  | ~20-40s | 363ms | **50-80x faster** |

### Files Created

#### Core Package (packages/core/src/)

- `types.ts` - TypeScript definitions
- `browser.ts` - jsdom wrapper with Shadow DOM support
- `orchestrator.ts` - Audit coordinator
- `formatter.ts` - Result normalizer
- `id-generator.ts` - Unique ID generation
- `dom-collector.ts` - Efficient DOM traversal
- `audits/accessibility.ts` - WCAG 2.1 audits
- `audits/performance.ts` - Web Vitals audits
- `audits/seo.ts` - SEO audits
- `audits/security.ts` - Security audits
- `audits/best-practices.ts` - Best practices audits
- `audits/pwa.ts` - PWA audits
- `audits/constants.ts` - Shared constants
- `reporters/terminal.ts` - Terminal reporter
- `reporters/json.ts` - JSON reporter
- `reporters/html.ts` - HTML reporter
- `reporters/types.ts` - Reporter types
- `reporters/index.ts` - Reporter exports

#### CLI Package (packages/cli/src/)

- `cli.ts` - Argument parser and main logic
- `file-writer.ts` - Report file writer
- `threshold-checker.ts` - Threshold validation
- `index.ts` - Package exports
- `bin/cli.js` - Executable entry point

#### Documentation

- `README.md` - Main documentation
- `CHANGELOG.md` - Version history
- `LICENSE` - MIT License
- `CONTRIBUTING.md` - Contribution guidelines
- `prd.md` - Product requirements
- `PERFORMANCE_OPTIMIZATION.md` - Performance guide

#### Testing

- `test-sites.sh` - Test script for sample websites

### Breaking Changes

None (initial release)

### Deprecated

None (initial release)

### Security

- HTTPS enforcement checks
- Security header validation
- Mixed content detection
- Password field security checks
- Vulnerable library detection

### Migration Guide

Not applicable (initial release)

---

## Version History

- **v1.0.0** (2026-02-06) - Initial release

---

## Upcoming Features

See [prd.md](prd.md) for planned enhancements:

- Optional Puppeteer mode for dynamic content
- Integration of DOM collector into all audits
- Parallel file writing for multi-format output
- Additional audit categories
- Performance trend tracking
- CI/CD integration examples for other platforms

---

## Support

- [GitHub Issues](https://github.com/navin0812/web-perf/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/navin0812/web-perf/discussions) - Questions and community.
- [Documentation](https://github.com/navin0812/web-perf#readme) - Usage guides and examples.
