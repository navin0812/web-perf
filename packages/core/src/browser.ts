import { JSDOM, DOMWindow, VirtualConsole } from "jsdom";
import fetch from "node-fetch";

export type BrowserPage = {
  document: Document;
  window: DOMWindow;
  html: string;
  url: string;
};

/**
 * Load a URL using jsdom with Shadow DOM support
 */
export async function loadPage(url: string): Promise<BrowserPage> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const html = await response.text();

    // Create virtual console to suppress script errors from external scripts
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("jsdomError", (error) => {
      // Silently ignore JSDOM script errors from external scripts
      // These are typically from third-party scripts that use APIs not supported by JSDOM
      if (!error.message.includes("Could not parse CSS stylesheet")) {
        // Only log non-CSS errors for debugging if needed
        // console.error("JSDOM Error:", error.message);
      }
    });

    // Create jsdom instance with Shadow DOM support
    const dom = new JSDOM(html, {
      url,
      pretendToBeVisual: true,
      resources: "usable",
      runScripts: "dangerously",
      virtualConsole,
      beforeParse(window: DOMWindow) {
        // Polyfill browser APIs not supported by JSDOM
        addBrowserPolyfills(window);

        // Polyfill ShadowDOM if needed
        if (!window.Element.prototype.attachShadow) {
          window.Element.prototype.attachShadow = function (): ShadowRoot {
            return this as unknown as ShadowRoot;
          };
        }
      },
    });

    return {
      document: dom.window.document,
      window: dom.window,
      html,
      url,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load page ${url}: ${message}`);
  }
}

/**
 * Get all elements including shadow DOM
 */
export function getAllElements(element: Element): Element[] {
  const elements: Element[] = [element];

  // Add children
  for (const child of element.children) {
    elements.push(...getAllElements(child));
  }

  // Add shadow DOM children if available
  if (element.shadowRoot) {
    for (const child of element.shadowRoot.children) {
      elements.push(...getAllElements(child));
    }
  }

  return elements;
}

/**
 * Build selector for an element (including shadow DOM path)
 */
/**
 * Add polyfills for browser APIs not supported by JSDOM
 */
function addBrowserPolyfills(window: DOMWindow): void {
  // Polyfill ReadableStream and related APIs
  if (typeof window.ReadableStream === "undefined") {
    (window as any).ReadableStream = class ReadableStream {
      constructor() {
        // Minimal polyfill - just prevents errors
      }
      getReader() {
        return {
          read: () => Promise.resolve({ done: true, value: undefined }),
          releaseLock: () => {},
          closed: Promise.resolve(),
          cancel: () => Promise.resolve(),
        };
      }
    };
  }

  // Polyfill WritableStream
  if (typeof window.WritableStream === "undefined") {
    (window as any).WritableStream = class WritableStream {
      constructor() {}
      getWriter() {
        return {
          write: () => Promise.resolve(),
          close: () => Promise.resolve(),
          abort: () => Promise.resolve(),
          closed: Promise.resolve(),
          ready: Promise.resolve(),
          releaseLock: () => {},
        };
      }
    };
  }

  // Polyfill TransformStream
  if (typeof window.TransformStream === "undefined") {
    (window as any).TransformStream = class TransformStream {
      readable: any;
      writable: any;
      constructor() {
        this.readable = new (window as any).ReadableStream();
        this.writable = new (window as any).WritableStream();
      }
    };
  }

  // Ensure window.window exists (some libraries expect this)
  if (!(window as any).window) {
    (window as any).window = window;
  }

  // Polyfill requestAnimationFrame if needed
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      return window.setTimeout(() => callback(Date.now()), 16);
    };
  }

  // Polyfill cancelAnimationFrame if needed
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id: number) => {
      window.clearTimeout(id);
    };
  }
}

export function buildSelector(element: Element): string {
  const path: string[] = [];
  let current: Element | null = element;

  while (current && current.nodeType === 1) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector += `#${current.id}`;
    } else if (current.className) {
      const classes = current.className.split(/\s+/).slice(0, 2).join(".");
      if (classes) {
        selector += `.${classes}`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(" > ");
}
