import { DOMWindow } from "jsdom";
export type BrowserPage = {
    document: Document;
    window: DOMWindow;
    html: string;
    url: string;
};
/**
 * Load a URL using jsdom with Shadow DOM support
 */
export declare function loadPage(url: string, options?: {
    timeout?: number;
    maxSize?: number;
    allowJs?: boolean;
}): Promise<BrowserPage>;
/**
 * Get all elements including shadow DOM
 */
export declare function getAllElements(element: Element): Element[];
export declare function buildSelector(element: Element): string;
//# sourceMappingURL=browser.d.ts.map