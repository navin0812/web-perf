import { Issue, PendingCheck } from "../types.js";
import { BrowserPage } from "../browser.js";
/**
 * Run PWA (Progressive Web App) audit
 */
export declare function auditPWA(page: BrowserPage): Promise<{
    issues: Issue[];
    passed: PendingCheck[];
}>;
//# sourceMappingURL=pwa.d.ts.map