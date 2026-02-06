import { Issue, PendingCheck } from "../types.js";
import { BrowserPage } from "../browser.js";
import { WCAG_MAPPINGS } from "./constants.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const axe = require("axe-core");

const ACCESSIBILITY_RULES = [
  "image-alt",
  "button-name",
  "link-name",
  // "color-contrast", // Disabled - doesn't work reliably in JSDOM
  "label",
  "html-has-lang",
  "document-title",
  "heading-order",
  "region",
  "aria-valid-attr",
  "aria-required-attr",
  "aria-roles",
  "meta-viewport",
  "tabindex",
  "duplicate-id",
  "bypass",
  "scrollable-region-focusable",
  "frame-focusable-content",
  "focus-order-semantics",
  "video-caption",
  "audio-caption",
  "no-autoplay-audio",
  "object-alt",
  "svg-img-alt",
  "td-headers-attr",
  "th-has-data-cells",
  "scope-attr-valid",
  "table-fake-caption",
  "definition-list",
  "list",
  "listitem",
  "nested-interactive",
  "input-image-alt",
  "select-name",
  "autocomplete-valid",
  "frame-title",
  "valid-lang",
  "marquee",
  "blink",
];

const RULE_TO_CATEGORY: Record<string, string> = {
  "image-alt": "images",
  "button-name": "interactive",
  "link-name": "interactive",
  "color-contrast": "color",
  label: "forms",
  "html-has-lang": "document",
  "document-title": "document",
  "heading-order": "structure",
  region: "structure",
  "aria-valid-attr": "aria",
  "aria-required-attr": "aria",
  "aria-roles": "aria",
  "meta-viewport": "document",
  tabindex: "technical",
  "duplicate-id": "technical",
  bypass: "interactive",
  "scrollable-region-focusable": "interactive",
  "frame-focusable-content": "interactive",
  "focus-order-semantics": "interactive",
  "video-caption": "images",
  "audio-caption": "images",
  "no-autoplay-audio": "images",
  "object-alt": "images",
  "svg-img-alt": "images",
  "td-headers-attr": "structure",
  "th-has-data-cells": "structure",
  "scope-attr-valid": "structure",
  "table-fake-caption": "structure",
  "definition-list": "structure",
  list: "structure",
  listitem: "structure",
  "nested-interactive": "interactive",
  "input-image-alt": "forms",
  "select-name": "forms",
  "autocomplete-valid": "forms",
  "frame-title": "document",
  "valid-lang": "document",
  marquee: "technical",
  blink: "technical",
};

const FIX_GUIDANCE: Record<string, (node: any) => string> = {
  "image-alt": () => "Add descriptive alt text that conveys the image content",
  "button-name": (node) =>
    node.html?.includes("aria-label")
      ? "Aria-label is present but may need improvement"
      : "Add text content or aria-label to the button",
  "link-name": () => "Add descriptive text content to the link",
  "color-contrast": () =>
    "Increase contrast ratio to at least 4.5:1 for normal text or 3:1 for large text",
  label: () => "Associate a label with the input using for/id or wrapping",
  "html-has-lang": () => "Add a lang attribute to the html element",
  "document-title": () => "Add a descriptive title to the page",
  "heading-order": () =>
    "Ensure headings follow a logical order without skipping levels",
  region: () => "Wrap content in landmark regions (main, nav, header, footer)",
  "aria-valid-attr": () => "Fix or remove invalid ARIA attributes",
  "aria-required-attr": () =>
    "Add required ARIA attributes for the element role",
  "aria-roles": () => "Use a valid ARIA role value",
  "meta-viewport": () =>
    "Allow users to zoom by setting viewport meta tag correctly",
  tabindex: () => 'Use tabindex="0" or "-1" instead of positive values',
  "duplicate-id": () => "Ensure all id attributes are unique on the page",
  bypass: () => "Add a skip link to bypass repetitive content",
  "scrollable-region-focusable": () =>
    "Make scrollable regions keyboard accessible with tabindex",
  "frame-focusable-content": () =>
    "Ensure iframe content is keyboard accessible",
  "focus-order-semantics": () =>
    "Ensure focus order follows a logical sequence",
  "video-caption": () => "Add captions to video content",
  "audio-caption": () => "Provide a transcript for audio content",
  "no-autoplay-audio": () =>
    "Remove autoplay or provide controls to pause audio",
  "object-alt": () => "Provide alternative text for object elements",
  "svg-img-alt": () => 'Add accessible name to SVG with role="img"',
  "td-headers-attr": () =>
    "Use headers attribute to associate data cells with headers",
  "th-has-data-cells": () => "Ensure table headers have associated data cells",
  "scope-attr-valid": () =>
    "Use valid scope values: row, col, rowgroup, colgroup",
  "table-fake-caption": () =>
    "Use <caption> element instead of fake caption cells",
  "definition-list": () =>
    "Ensure definition lists only contain dt and dd elements",
  list: () => "Ensure lists only contain li elements",
  listitem: () => "Ensure list items are inside ul or ol elements",
  "nested-interactive": () => "Remove nested interactive elements",
  "input-image-alt": () => "Add alt text to image input buttons",
  "select-name": () => "Add an accessible name to the select element",
  "autocomplete-valid": () => "Use valid autocomplete attribute values",
  "frame-title": () => "Add a title attribute to the iframe",
  "valid-lang": () => "Use a valid BCP 47 language code",
  marquee: () => "Replace <marquee> with CSS animations",
  blink: () =>
    "Remove <blink> element - it is deprecated and causes accessibility issues",
};

/**
 * Run accessibility audit using axe-core
 */
export async function auditAccessibility(page: BrowserPage): Promise<{
  issues: Issue[];
  passed: PendingCheck[];
}> {
  const issues: Issue[] = [];
  const passed: PendingCheck[] = [];

  const config = {
    rules: {
      "color-contrast": { enabled: false }, // Doesn't work reliably in JSDOM
    },
    runOnly: {
      type: "rule" as const,
      values: ACCESSIBILITY_RULES,
    },
  };

  try {
    // Inject axe-core into the jsdom window context
    const script = page.document.createElement("script");
    script.textContent = axe.source;
    page.document.head.appendChild(script);

    // Check if axe was injected successfully
    if (!(page.window as any).axe) {
      throw new Error("Failed to inject axe-core into jsdom window");
    }

    // Run axe-core from within the jsdom window context
    const results = await (page.window as any).axe.run(page.document, config);

    console.log("Accessibility audit results:", {
      violations: results.violations.length,
      passes: results.passes.length,
      incomplete: results.incomplete?.length || 0,
      violationIds: results.violations.map((v: any) => v.id)
    });

    // Process violations
    for (const violation of results.violations) {
    for (const node of violation.nodes) {
      // Convert target to string selector
      const selectorArray = Array.isArray(node.target)
        ? node.target
        : [node.target];
      const selector =
        typeof selectorArray[0] === "string" ? selectorArray[0] : "body";
      const element = page.document.querySelector(selector);

      const issue: Issue = {
        id: `a11y-${violation.id}-${Date.now()}`,
        ruleId: violation.id,
        severity: mapAxeSeverityToSeverity(violation.impact),
        category: (RULE_TO_CATEGORY[violation.id] || "technical") as any,
        message: violation.help || violation.id,
        description: violation.description || "",
        helpUrl: violation.helpUrl || "https://dequeuniversity.com",
        wcag: WCAG_MAPPINGS[violation.id] || {
          id: "Unknown",
          level: "A",
          name: violation.id,
          description: violation.description || "",
        },
        element: {
          selector,
          html: element?.outerHTML?.substring(0, 200) || node.html || "",
          failureSummary: node.failureSummary || violation.help || "",
        },
        fix: {
          description:
            FIX_GUIDANCE[violation.id]?.(node) || "See documentation",
          code: generateCodeFix(violation.id, node),
          learnMoreUrl: violation.helpUrl || "https://dequeuniversity.com",
        },
      };

      issues.push(issue);
    }
  }

    // Process passed checks
    for (const pass of results.passes) {
      passed.push({
        id: `pass-${pass.id}`,
        name: pass.help || pass.id,
        category: RULE_TO_CATEGORY[pass.id] || "technical",
        description: pass.description || "",
      });
    }

  } catch (error) {
    console.error("Error in accessibility audit:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    throw error;
  }

  return { issues, passed };
}

function mapAxeSeverityToSeverity(
  impact?: string | null,
): "critical" | "serious" | "moderate" | "minor" {
  switch (impact) {
    case "critical":
      return "critical";
    case "serious":
      return "serious";
    case "moderate":
      return "moderate";
    case "minor":
      return "minor";
    default:
      return "moderate";
  }
}

function generateCodeFix(ruleId: string, node: any): string {
  const html = node.html || "<element>";
  switch (ruleId) {
    case "image-alt":
      return `<img src="image.jpg" alt="[Describe what the image shows]">`;
    case "button-name":
      return `<button>Button text or aria-label="[purpose]">`;
    case "link-name":
      return `<a href="#target">Link text</a>`;
    case "color-contrast":
      return `/* Increase contrast ratio to 4.5:1 (normal text) or 3:1 (large text) */
/* Darken text or lighten background */`;
    case "label":
      return `<label for="input-id">Label text</label>
<input id="input-id" type="text">`;
    case "document-title":
      return `<title>Page Title - Site Name</title>`;
    case "heading-order":
      return `<!-- Follow order: h1 → h2 → h3 → h4 -->
<!-- Don't skip levels -->
<h1>Main heading</h1>
<h2>Subheading</h2>
<h3>Sub-subheading</h3>`;
    case "video-caption":
      return `<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en">
</video>`;
    default:
      return `<!-- Fix the ${ruleId} issue in the element: -->
${html}`;
  }
}
