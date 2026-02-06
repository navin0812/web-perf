import { BrowserPage } from "./browser.js";

/**
 * Cached DOM elements to avoid multiple queries
 * This provides massive performance improvement by traversing DOM once
 */
export type CollectedElements = {
  // Scripts
  scripts: HTMLScriptElement[];
  scriptsWithSrc: HTMLScriptElement[];
  inlineScripts: HTMLScriptElement[];
  inlineHeadScripts: HTMLScriptElement[];

  // Styles
  stylesheets: HTMLLinkElement[];
  styleLinks: HTMLLinkElement[];
  fontLinks: HTMLLinkElement[];

  // Images
  images: HTMLImageElement[];

  // Links
  links: HTMLAnchorElement[];

  // Forms
  passwordFields: HTMLInputElement[];

  // Iframes
  iframes: HTMLIFrameElement[];

  // Meta tags
  metaCharset: HTMLMetaElement | null;
  metaHttpEquiv: HTMLMetaElement | null;
  metaRefresh: HTMLMetaElement | null;
  metaViewport: HTMLMetaElement | null;

  // Google Fonts specific
  googleFontsLinks: HTMLLinkElement[];
  googleFontsPreconnect: HTMLLinkElement | null;

  // Font preloads
  fontPreloads: HTMLLinkElement[];

  // Deprecated elements
  marquee: Element[];
  blink: Element[];
  font: Element[];
  center: Element[];

  // Elements with IDs
  elementsWithId: Element[];

  // All elements (for comprehensive checks if needed)
  allElements: Element[];
};

/**
 * Collect all DOM elements in a single traversal
 * This is much faster than multiple querySelectorAll calls
 */
export function collectDOMElements(page: BrowserPage): CollectedElements {
  const doc = page.document;

  // Initialize collections
  const collected: CollectedElements = {
    scripts: [],
    scriptsWithSrc: [],
    inlineScripts: [],
    inlineHeadScripts: [],
    stylesheets: [],
    styleLinks: [],
    fontLinks: [],
    images: [],
    links: [],
    passwordFields: [],
    iframes: [],
    metaCharset: null,
    metaHttpEquiv: null,
    metaRefresh: null,
    metaViewport: null,
    googleFontsLinks: [],
    googleFontsPreconnect: null,
    fontPreloads: [],
    marquee: [],
    blink: [],
    font: [],
    center: [],
    elementsWithId: [],
    allElements: [],
  };

  // Single traversal of all elements
  const allElements = doc.querySelectorAll("*");
  collected.allElements = Array.from(allElements);

  allElements.forEach((element) => {
    const tagName = element.tagName.toLowerCase();

    // Scripts
    if (tagName === "script") {
      const script = element as HTMLScriptElement;
      collected.scripts.push(script);

      if (script.hasAttribute("src")) {
        collected.scriptsWithSrc.push(script);
      } else {
        collected.inlineScripts.push(script);
        if (script.closest("head")) {
          collected.inlineHeadScripts.push(script);
        }
      }
    }

    // Links (stylesheets, fonts, preloads)
    else if (tagName === "link") {
      const link = element as HTMLLinkElement;
      const rel = link.getAttribute("rel");
      const href = link.getAttribute("href") || "";

      if (rel === "stylesheet") {
        collected.stylesheets.push(link);
        collected.styleLinks.push(link);

        // Font links
        if (href.includes("font")) {
          collected.fontLinks.push(link);
        }

        // Google Fonts
        if (href.includes("fonts.googleapis.com")) {
          collected.googleFontsLinks.push(link);
        }
      }

      // Font preloads
      if (rel === "preload" && link.getAttribute("as") === "font") {
        collected.fontPreloads.push(link);
      }

      // Google Fonts preconnect
      if (
        rel === "preconnect" &&
        (href.includes("fonts.googleapis.com") ||
          href.includes("fonts.gstatic.com"))
      ) {
        collected.googleFontsPreconnect = link;
      }
    }

    // Images
    else if (tagName === "img") {
      collected.images.push(element as HTMLImageElement);
    }

    // Anchors
    else if (tagName === "a") {
      collected.links.push(element as HTMLAnchorElement);
    }

    // Iframes
    else if (tagName === "iframe") {
      collected.iframes.push(element as HTMLIFrameElement);
    }

    // Input fields
    else if (tagName === "input") {
      const input = element as HTMLInputElement;
      if (input.type === "password") {
        collected.passwordFields.push(input);
      }
    }

    // Meta tags
    else if (tagName === "meta") {
      const meta = element as HTMLMetaElement;
      const charset = meta.getAttribute("charset");
      const httpEquiv = meta.getAttribute("http-equiv");
      const name = meta.getAttribute("name");

      if (charset) {
        collected.metaCharset = meta;
      }
      if (httpEquiv === "Content-Type") {
        collected.metaHttpEquiv = meta;
      }
      if (httpEquiv === "refresh") {
        collected.metaRefresh = meta;
      }
      if (name === "viewport") {
        collected.metaViewport = meta;
      }
    }

    // Deprecated elements
    else if (tagName === "marquee") {
      collected.marquee.push(element);
    } else if (tagName === "blink") {
      collected.blink.push(element);
    } else if (tagName === "font") {
      collected.font.push(element);
    } else if (tagName === "center") {
      collected.center.push(element);
    }

    // Elements with IDs
    if (element.hasAttribute("id")) {
      collected.elementsWithId.push(element);
    }
  });

  return collected;
}

/**
 * Find render-blocking CSS stylesheets
 */
export function findBlockingCSS(
  stylesheets: HTMLLinkElement[],
): HTMLLinkElement[] {
  return stylesheets.filter((link) => {
    const media = link.getAttribute("media");
    const disabled = link.hasAttribute("disabled");
    // Blocking if no media attribute (or media="all") and not disabled
    return !disabled && (!media || media === "all" || media === "screen");
  });
}

/**
 * Find duplicate IDs in collected elements
 */
export function findDuplicateIds(
  elementsWithId: Element[],
): Map<string, Element[]> {
  const idCount = new Map<string, Element[]>();

  elementsWithId.forEach((element) => {
    const id = element.getAttribute("id");
    if (id) {
      if (!idCount.has(id)) {
        idCount.set(id, []);
      }
      idCount.get(id)!.push(element);
    }
  });

  // Filter to only duplicates
  const duplicates = new Map<string, Element[]>();
  idCount.forEach((elements, id) => {
    if (elements.length > 1) {
      duplicates.set(id, elements);
    }
  });

  return duplicates;
}
