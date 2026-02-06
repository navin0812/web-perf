import { BrowserPage } from "./browser.js";
/**
 * Cached DOM elements to avoid multiple queries
 * This provides massive performance improvement by traversing DOM once
 */
export type CollectedElements = {
    scripts: HTMLScriptElement[];
    scriptsWithSrc: HTMLScriptElement[];
    inlineScripts: HTMLScriptElement[];
    inlineHeadScripts: HTMLScriptElement[];
    stylesheets: HTMLLinkElement[];
    styleLinks: HTMLLinkElement[];
    fontLinks: HTMLLinkElement[];
    images: HTMLImageElement[];
    links: HTMLAnchorElement[];
    passwordFields: HTMLInputElement[];
    iframes: HTMLIFrameElement[];
    metaCharset: HTMLMetaElement | null;
    metaHttpEquiv: HTMLMetaElement | null;
    metaRefresh: HTMLMetaElement | null;
    metaViewport: HTMLMetaElement | null;
    googleFontsLinks: HTMLLinkElement[];
    googleFontsPreconnect: HTMLLinkElement | null;
    fontPreloads: HTMLLinkElement[];
    marquee: Element[];
    blink: Element[];
    font: Element[];
    center: Element[];
    elementsWithId: Element[];
    allElements: Element[];
};
/**
 * Collect all DOM elements in a single traversal
 * This is much faster than multiple querySelectorAll calls
 */
export declare function collectDOMElements(page: BrowserPage): CollectedElements;
/**
 * Find render-blocking CSS stylesheets
 */
export declare function findBlockingCSS(stylesheets: HTMLLinkElement[]): HTMLLinkElement[];
/**
 * Find duplicate IDs in collected elements
 */
export declare function findDuplicateIds(elementsWithId: Element[]): Map<string, Element[]>;
//# sourceMappingURL=dom-collector.d.ts.map