import { Issue, PendingCheck } from "../types.js";
import { BrowserPage } from "../browser.js";
/**
 * Run best practices audit
 */
export declare function auditBestPractices(page: BrowserPage): Promise<{
    issues: Issue[];
    passed: PendingCheck[];
}>;
//# sourceMappingURL=best-practices.d.ts.map