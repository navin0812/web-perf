import { BrowserPage, loadPage } from "./browser.js";
import { AuditReport, Issue, PendingCheck } from "./types.js";
import { auditAccessibility } from "./audits/accessibility.js";
import { auditSEO } from "./audits/seo.js";
import { auditSecurity } from "./audits/security.js";
import { auditPerformance } from "./audits/performance.js";
import { auditBestPractices } from "./audits/best-practices.js";
import { auditPWA } from "./audits/pwa.js";
import { formatResults, mergeAuditResults } from "./formatter.js";

/**
 * Available audit types
 */
export type AuditType =
  | "accessibility"
  | "performance"
  | "seo"
  | "security"
  | "best-practices"
  | "pwa";

/**
 * Audit options
 */
export interface AuditOptions {
  /** Audits to skip */
  skipAudits?: AuditType[];
  /** Maximum time to wait for page load in milliseconds */
  timeout?: number;
}

/**
 * Audit result for a single audit type
 */
interface SingleAuditResult {
  type: AuditType;
  issues: Issue[];
  passed: PendingCheck[];
  duration: number;
  error?: string;
}

/**
 * Run a single audit with error handling
 */
async function runSingleAudit(
  page: BrowserPage,
  auditType: AuditType,
): Promise<SingleAuditResult> {
  const startTime = Date.now();

  try {
    let result: { issues: Issue[]; passed: PendingCheck[] };

    switch (auditType) {
      case "accessibility":
        result = await auditAccessibility(page);
        break;
      case "performance":
        result = await auditPerformance(page);
        break;
      case "seo":
        result = await auditSEO(page);
        break;
      case "security":
        result = await auditSecurity(page);
        break;
      case "best-practices":
        result = await auditBestPractices(page);
        break;
      case "pwa":
        result = await auditPWA(page);
        break;
      default:
        throw new Error(`Unknown audit type: ${auditType}`);
    }

    const duration = Date.now() - startTime;

    return {
      type: auditType,
      issues: result.issues,
      passed: result.passed,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      type: auditType,
      issues: [],
      passed: [],
      duration,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Run a specific subset of audits
 */
export async function runSpecificAudits(
  url: string,
  audits: AuditType[],
  options: AuditOptions = {},
): Promise<AuditReport> {
  // Calculate which audits to skip
  const allAudits: AuditType[] = [
    "accessibility",
    "performance",
    "seo",
    "security",
    "best-practices",
    "pwa",
  ];

  const skipAudits = allAudits.filter((audit) => !audits.includes(audit));

  return runAudits(url, { ...options, skipAudits });
}

/**
 * Get audit metadata
 */
export function getAuditInfo(auditType: AuditType): {
  name: string;
  description: string;
  category: string;
} {
  const auditInfo: Record<
    AuditType,
    { name: string; description: string; category: string }
  > = {
    accessibility: {
      name: "Accessibility",
      description:
        "Checks WCAG 2.1 compliance using axe-core, covering images, interactive elements, forms, color contrast, ARIA, and document structure",
      category: "Compliance",
    },
    performance: {
      name: "Performance",
      description:
        "Analyzes page performance including resource optimization, image loading, JavaScript efficiency, and layout stability",
      category: "Speed",
    },
    seo: {
      name: "SEO",
      description:
        "Validates SEO best practices including meta tags, headings, structured data, and crawlability",
      category: "Discoverability",
    },
    security: {
      name: "Security",
      description:
        "Checks security headers, HTTPS usage, mixed content, and password field security",
      category: "Safety",
    },
    "best-practices": {
      name: "Best Practices",
      description:
        "Validates HTML standards, deprecated elements, unique IDs, and modern web development practices",
      category: "Quality",
    },
    pwa: {
      name: "Progressive Web App",
      description:
        "Checks PWA requirements including manifest, service worker, HTTPS, and mobile optimization",
      category: "Installability",
    },
  };

  return auditInfo[auditType];
}

/**
 * Get all available audit types
 */
export function getAvailableAudits(): AuditType[] {
  return [
    "accessibility",
    "performance",
    "seo",
    "security",
    "best-practices",
    "pwa",
  ];
}

/**
 * Run all audits on a page
 */
export async function runAudits(
  url: string,
  options: AuditOptions = {},
): Promise<AuditReport> {
  const startTime = Date.now();
  const skipAudits = options.skipAudits || [];

  // Load the page
  const page = await loadPage(url);

  // Determine which audits to run
  const auditsToRun: AuditType[] = [
    "accessibility",
    "performance",
    "seo",
    "security",
    "best-practices",
    "pwa",
  ].filter((audit) => !skipAudits.includes(audit as AuditType)) as AuditType[];

  // Run all audits in parallel
  const auditPromises = auditsToRun.map((auditType) =>
    runSingleAudit(page, auditType),
  );

  const auditResults = await Promise.all(auditPromises);

  // Merge all results
  const allResults = auditResults.map((result) => ({
    issues: result.issues,
    passed: result.passed,
  }));

  const { issues, passed } = mergeAuditResults(allResults);

  // Handle incomplete audits (audits that errored)
  const incomplete: Issue[] = auditResults
    .filter((result) => result.error)
    .map((result) => ({
      id: `audit-error-${result.type}`,
      ruleId: "audit-error",
      severity: "serious" as const,
      category: "technical" as const,
      message: `${result.type} audit failed`,
      description: `The ${result.type} audit could not complete: ${result.error}`,
      helpUrl: "",
      wcag: {
        id: "N/A",
        level: "A" as const,
        name: "Audit Error",
        description: "Audit could not complete",
      },
      element: {
        selector: "",
        html: "",
        failureSummary: result.error || "Unknown error",
      },
      fix: {
        description: "Check the error message for details",
        code: "",
        learnMoreUrl: "",
      },
    }));

  const endTime = Date.now();

  // Format and return the complete report
  return formatResults(url, startTime, endTime, issues, passed, incomplete);
}
