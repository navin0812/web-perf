// Result types
export type Issue = {
  id: string;
  ruleId: string;
  severity: "critical" | "serious" | "moderate" | "minor";
  category:
    | "images"
    | "interactive"
    | "forms"
    | "color"
    | "document"
    | "structure"
    | "aria"
    | "technical";
  message: string;
  description: string;
  helpUrl: string;
  wcag: {
    id: string;
    level: "A" | "AA" | "AAA";
    name: string;
    description: string;
  };
  element: {
    selector: string;
    html: string;
    failureSummary: string;
  };
  fix: {
    description: string;
    code: string;
    learnMoreUrl: string;
  };
};

export type Summary = {
  total: number;
  bySeverity: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  byCategory: {
    images: number;
    interactive: number;
    forms: number;
    color: number;
    document: number;
    structure: number;
    aria: number;
    technical: number;
  };
  passed: number;
};

export type AuditReport = {
  url: string;
  timestamp: number;
  duration: number;
  issues: Issue[];
  passed: PendingCheck[];
  incomplete: Issue[];
  summary: Summary;
};

export type PendingCheck = {
  id: string;
  name: string;
  category: string;
  description: string;
};

export type ThresholdConfig = {
  critical?: number;
  serious?: number;
  moderate?: number;
  minor?: number;
};

export type CliOptions = {
  url: string;
  outputDir?: string;
  format?: "json" | "html" | "terminal" | "all";
  threshold?: ThresholdConfig;
  skipAudits?: string[];
};

// Type guards
export function isIssue(obj: unknown): obj is Issue {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "ruleId" in obj &&
    "severity" in obj
  );
}

export function isAuditReport(obj: unknown): obj is AuditReport {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "url" in obj &&
    "issues" in obj &&
    Array.isArray((obj as AuditReport).issues)
  );
}

export function isSummary(obj: unknown): obj is Summary {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "total" in obj &&
    "bySeverity" in obj
  );
}

export function isPendingCheck(obj: unknown): obj is PendingCheck {
  return (
    typeof obj === "object" && obj !== null && "id" in obj && "name" in obj
  );
}

export function isThresholdConfig(obj: unknown): obj is ThresholdConfig {
  return (
    typeof obj === "object" &&
    obj !== null &&
    ("critical" in obj ||
      "serious" in obj ||
      "moderate" in obj ||
      "minor" in obj)
  );
}

export function isCliOptions(obj: unknown): obj is CliOptions {
  return typeof obj === "object" && obj !== null && "url" in obj;
}
