# Contributing to Web-Perf

Thank you for your interest in contributing to Web-Perf! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/web-perf.git
   cd web-perf
   ```
3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/navin0812/web-perf.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
./test-sites.sh
```

### Running Locally

```bash
# Run CLI tool
node packages/cli/bin/cli.js --url https://example.com

# With all options
node packages/cli/bin/cli.js \
  --url https://example.com \
  --format all \
  --output-dir ./reports \
  --threshold critical:0 error:5
```

## Project Structure

```
web-perf/
├── packages/
│   ├── core/              # Core audit engine
│   │   └── src/
│   │       ├── audits/    # 6 audit modules
│   │       ├── reporters/ # Output formatters
│   │       └── *.ts       # Core utilities
│   └── cli/               # CLI interface
│       ├── bin/           # Executable
│       └── src/           # CLI logic
├── .github/
│   └── workflows/         # GitHub Action examples
├── action.yml             # GitHub Action definition
├── test-sites.sh          # Test script
└── docs/                  # Documentation
```

### Reporting Bugs

Before creating a bug report:

1. Check [existing issues](https://github.com/navin0812/web-perf/issues)
2. Verify the bug exists in the latest version
3. Collect relevant information (version, OS, error messages)

When creating a bug report, include:

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error messages
- Environment details (Node version, OS, etc.)

**Bug Report Template:**

```markdown
## Description

[Clear description of the bug]

## Steps to Reproduce

1. Run command: `node packages/cli/bin/cli.js --url https://example.com`
2. Observe error...

## Expected Behavior

[What should happen]

## Actual Behavior

[What actually happens]

## Environment

- Web-Perf version: 1.0.0
- Node version: 18.0.0
- OS: macOS 14.0
```

### Suggesting Features

Feature suggestions are welcome! Please:

1. Check [existing feature requests](https://github.com/navin0812/web-perf/issues?q=label%3Aenhancement)
2. Clearly describe the problem your feature would solve
3. Explain your proposed solution
4. Consider alternative solutions

**Feature Request Template:**

```markdown
## Problem Statement

[Describe the problem or limitation]

## Proposed Solution

[Describe your proposed feature]

## Alternatives Considered

[Other approaches you've thought about]

## Additional Context

[Any other relevant information]
```

### Contributing Code

#### Areas for Contribution

- **New Audits:** Add more accessibility, performance, or security checks
- **Reporters:** Create new output formats (PDF, XML, etc.)
- **Performance:** Optimize existing audits
- **Documentation:** Improve guides and examples
- **Tests:** Add test coverage
- **Bug Fixes:** Fix reported issues
- **Examples:** Add workflow examples

#### Contribution Workflow

1. **Create an issue** first to discuss major changes
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Make your changes** following coding standards
4. **Test thoroughly** using the test script
5. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add new accessibility audit for aria-labels"
   ```
6. **Push to your fork:**
   ```bash
   git push origin feature/my-new-feature
   ```
7. **Create a Pull Request** on GitHub

## Coding Standards

### TypeScript Style

- Use TypeScript for all new code
- Enable strict mode
- Define explicit types (avoid `any`)
- Use interfaces for object shapes
- Document public APIs with JSDoc comments

**Example:**

```typescript
/**
 * Runs accessibility audit on the provided document
 * @param document - jsdom document to audit
 * @param url - URL being audited
 * @returns Array of accessibility issues
 */
export async function runAccessibilityAudit(
  document: Document,
  url: string,
): Promise<Issue[]> {
  // Implementation
}
```

### Code Organization

- One class/function per file (when practical)
- Group related functionality in directories
- Export public APIs through index.ts
- Keep functions focused and small (<100 lines)
- Use descriptive variable names

### Error Handling

- Always handle errors gracefully
- Provide meaningful error messages
- Log errors appropriately
- Don't swallow exceptions silently

**Example:**

```typescript
try {
  const result = await fetchPage(url);
  return result;
} catch (error) {
  console.error(`Failed to fetch ${url}:`, error.message);
  throw new Error(`Page load failed: ${error.message}`);
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions or updates
- `chore:` Build process or auxiliary tool changes

**Examples:**

```bash
feat: add PDF report generator
fix: correct threshold checking for warning level
docs: update CLI options in README
perf: optimize DOM traversal in accessibility audit
refactor: simplify reporter interface
test: add tests for security audit module
```

## Testing

### Running Tests

```bash
# Run full test suite
./test-sites.sh

# Test specific website
node packages/cli/bin/cli.js --url https://example.com --format all

# Test with thresholds
node packages/cli/bin/cli.js \
  --url https://example.com \
  --threshold critical:0 error:5 \
  --format json
```

### Writing Tests

When adding new features:

1. Add test cases to `test-sites.sh`
2. Test edge cases and error conditions
3. Verify all output formats work
4. Check threshold validation
5. Test with various websites

### Test Coverage

Aim to test:

- Happy path (normal operation)
- Edge cases (empty pages, large pages)
- Error conditions (network failures, timeouts)
- All output formats
- Threshold scenarios
- Skip audit functionality

## Submitting Changes

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows TypeScript style guidelines
- [ ] All tests pass (`./test-sites.sh`)
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main:
  ```bash
  git fetch upstream
  git rebase upstream/main
  ```
- [ ] No merge conflicts
- [ ] PR description explains changes clearly
- [ ] CI checks pass (automated on PR creation):
  - ✅ Validate: TypeScript compilation & package structure
  - ✅ Test: Full test suite execution
  - ✅ Integration: Multiple URL/format combinations
  - ✅ Dependencies: Security audit
  - ✅ Commits: Conventional format check
  - ✅ Size: Package size monitoring

**Note:** CI checks run automatically when you create a PR. You can see the status in the PR checks section.

### Pull Request Template

```markdown
## Description

[Clear description of what this PR does]

## Motivation

[Why is this change needed?]

## Changes Made

- Added X feature
- Fixed Y bug
- Updated Z documentation

## Testing

- [ ] Tested on example.com
- [ ] Tested on github.com
- [ ] All formats working (JSON, HTML, Terminal)
- [ ] Thresholds validated

## Screenshots (if applicable)

[Add screenshots of new features or UI changes]

## Related Issues

Fixes #123
Relates to #456
```

### Review Process

1. **CI Checks run automatically** - Your PR must pass all automated checks:
   - Code validation and compilation
   - Test suite
   - Integration tests
   - Dependency audit
   - Commit message format
2. **Maintainers will review** your PR within 1-2 weeks
3. **Address any feedback** or requested changes
4. **CI checks must pass** before merge
5. Once approved and checks pass, a maintainer will merge your PR
6. Your contribution will be included in the next release

**Tip:** You can view CI check details by clicking on the status in your PR.

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards compatible)
- **PATCH** version for bug fixes (backwards compatible)

### Release Steps (Maintainers Only)

1. Update version in package.json files
2. Update CHANGELOG.md
3. Commit changes: `git commit -m "chore: release v1.1.0"`
4. Create git tag: `git tag -a v1.1.0 -m "Release v1.1.0"`
5. Push to GitHub: `git push && git push --tags`
6. Create GitHub Release with notes from CHANGELOG
7. Publish to npm: `npm publish --workspaces`

## Questions?

- **General Questions:** [GitHub Discussions](https://github.com/navin0812/web-perf/discussions)
- **Bug Reports:** [GitHub Issues](https://github.com/navin0812/web-perf/issues)
- **Security Issues:** Email maintainers privately

## Recognition

Contributors will be:

- Listed in release notes
- Credited in CHANGELOG.md
- Added to GitHub contributors page

Thank you for contributing to make the web more accessible and performant! 🚀
