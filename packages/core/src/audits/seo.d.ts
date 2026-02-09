import { Issue, PendingCheck } from "../types.js";
import { BrowserPage } from "../browser.js";
/**
 * Run SEO audit
 */
export declare function auditSEO(page: BrowserPage): Promise<{
    issues: Issue[];
    passed: PendingCheck[];
}>;
//# sourceMappingURL=seo.d.ts.map