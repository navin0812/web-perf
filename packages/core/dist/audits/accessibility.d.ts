import { Issue, PendingCheck } from "../types.js";
import { BrowserPage } from "../browser.js";
/**
 * Run accessibility audit using axe-core
 */
export declare function auditAccessibility(page: BrowserPage): Promise<{
    issues: Issue[];
    passed: PendingCheck[];
}>;
//# sourceMappingURL=accessibility.d.ts.map