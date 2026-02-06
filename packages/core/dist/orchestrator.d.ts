import { AuditReport } from "./types.js";
/**
 * Available audit types
 */
export type AuditType = "accessibility" | "performance" | "seo" | "security" | "best-practices" | "pwa";
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
 * Run a specific subset of audits
 */
export declare function runSpecificAudits(url: string, audits: AuditType[], options?: AuditOptions): Promise<AuditReport>;
/**
 * Get audit metadata
 */
export declare function getAuditInfo(auditType: AuditType): {
    name: string;
    description: string;
    category: string;
};
/**
 * Get all available audit types
 */
export declare function getAvailableAudits(): AuditType[];
/**
 * Run all audits on a page
 */
export declare function runAudits(url: string, options?: AuditOptions): Promise<AuditReport>;
//# sourceMappingURL=orchestrator.d.ts.map