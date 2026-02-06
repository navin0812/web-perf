import { ThresholdConfig } from "@web-perf/core";
export type CliOptions = {
    url: string;
    format: "json" | "html" | "terminal" | "all";
    outputDir: string;
    threshold?: ThresholdConfig;
    skipAudits?: string[];
};
/**
 * Main CLI entry point
 */
export declare function runAudit(options: CliOptions): Promise<number>;
//# sourceMappingURL=index.d.ts.map