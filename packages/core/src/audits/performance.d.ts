import { Issue, PendingCheck } from "../types.js";
import { BrowserPage } from "../browser.js";
/**
 * Run performance audit
 * Note: Uses heuristic-based checks since we're using jsdom, not a real browser
 */
export declare function auditPerformance(page: BrowserPage): Promise<{
    issues: Issue[];
    passed: PendingCheck[];
}>;
//# sourceMappingURL=performance.d.ts.map