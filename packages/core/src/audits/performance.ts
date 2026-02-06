import { Issue, PendingCheck } from "../types.js";
import { BrowserPage, buildSelector } from "../browser.js";

/**
 * Check resource counts and sizes
 */
function checkResources(page: BrowserPage): Issue[] {
  const issues: Issue[] = [];
  const document = page.document;

  // Count various resource types
  const scripts = document.querySelectorAll("script[src]");
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');

  // Too many scripts
  if (scripts.length > 20) {
    issues.push({
      id: `perf-too-many-scripts-${Date.now()}`,
      ruleId: "excessive-scripts",
      severity: "moderate",
      category: "technical",
      message: `Page loads ${scripts.length} external scripts`,
      description: `The page loads ${scripts.length} external JavaScript files, which can significantly impact performance. Consider bundling and minimizing the number of HTTP requests.`,
      helpUrl:
        "https://web.dev/reduce-javascript-payloads-with-code-splitting/",
      wcag: {
        id: "N/A",
        level: "AAA",
        name: "Performance Best Practice",
        description: "Minimize HTTP requests and bundle resources",
      },
      element: {
        selector: "script[src]",
        html: `${scripts.length} script tags`,
        failureSummary: `${scripts.length} external scripts found`,
      },
      fix: {
        description: "Bundle JavaScript files and use code splitting",
        code: "// Use webpack, rollup, or vite to bundle\n// Implement dynamic imports for code splitting\nimport('./module.js').then(module => {\n  // Use module\n});",
        learnMoreUrl:
          "https://web.dev/reduce-javascript-payloads-with-code-splitting/",
      },
    });
  }

  // Too many stylesheets
  if (stylesheets.length > 5) {
    issues.push({
      id: `perf-too-many-css-${Date.now()}`,
      ruleId: "excessive-stylesheets",
      severity: "moderate",
      category: "technical",
      message: `Page loads ${stylesheets.length} external stylesheets`,
      description: `The page loads ${stylesheets.length} external CSS files. Each stylesheet requires a separate HTTP request, which can delay rendering.`,
      helpUrl: "https://web.dev/extract-critical-css/",
      wcag: {
        id: "N/A",
        level: "AAA",
        name: "Performance Best Practice",
        description: "Minimize CSS files",
      },
      element: {
        selector: 'link[rel="stylesheet"]',
        html: `${stylesheets.length} stylesheet links`,
        failureSummary: `${stylesheets.length} external stylesheets found`,
      },
      fix: {
        description: "Combine CSS files and inline critical CSS",
        code: '<!-- Inline critical CSS -->\n<style>\n  /* Critical above-the-fold styles */\n</style>\n<!-- Load remaining CSS asynchronously -->\n<link rel="preload" href="styles.css" as="style" onload="this.rel=\'stylesheet\'">',
        learnMoreUrl: "https://web.dev/extract-critical-css/",
      },
    });
  }

  return issues;
}

/**
 * Check image optimization
 */
function checkImages(page: BrowserPage): Issue[] {
  const issues: Issue[] = [];
  const document = page.document;

  const images = document.querySelectorAll("img");

  images.forEach((img, index) => {
    const src = img.getAttribute("src") || "";
    const width = img.getAttribute("width");
    const height = img.getAttribute("height");
    const loading = img.getAttribute("loading");

    // Missing dimensions
    if (!width || !height) {
      issues.push({
        id: `perf-img-no-dimensions-${index}`,
        ruleId: "image-missing-dimensions",
        severity: "moderate",
        category: "images",
        message: "Image missing width and height attributes",
        description:
          "Images without explicit dimensions can cause layout shifts as they load, negatively impacting Cumulative Layout Shift (CLS).",
        helpUrl: "https://web.dev/optimize-cls/#images-without-dimensions",
        wcag: {
          id: "N/A",
          level: "AAA",
          name: "Performance Best Practice",
          description: "Specify image dimensions to prevent layout shifts",
        },
        element: {
          selector: buildSelector(img),
          html: img.outerHTML,
          failureSummary: "Image does not have width and height attributes",
        },
        fix: {
          description: "Add width and height attributes to the image",
          code: `<img src="${src}" width="800" height="600" alt="...">`,
          learnMoreUrl:
            "https://web.dev/optimize-cls/#images-without-dimensions",
        },
      });
    }

    // Not using lazy loading for below-fold images
    if (!loading && index > 2) {
      issues.push({
        id: `perf-img-no-lazy-${index}`,
        ruleId: "image-no-lazy-loading",
        severity: "minor",
        category: "images",
        message: "Below-fold image not using lazy loading",
        description:
          "Images that appear below the fold should use lazy loading to improve initial page load performance.",
        helpUrl: "https://web.dev/lazy-loading-images/",
        wcag: {
          id: "N/A",
          level: "AAA",
          name: "Performance Best Practice",
          description: "Use lazy loading for off-screen images",
        },
        element: {
          selector: buildSelector(img),
          html: img.outerHTML,
          failureSummary: "Image does not use loading='lazy' attribute",
        },
        fix: {
          description: "Add loading='lazy' attribute to below-fold images",
          code: `<img src="${src}" loading="lazy" alt="...">`,
          learnMoreUrl: "https://web.dev/lazy-loading-images/",
        },
      });
    }

    // Check for modern image formats
    if (src && /\.(jpe?g|png)$/i.test(src)) {
      issues.push({
        id: `perf-img-format-${index}`,
        ruleId: "image-legacy-format",
        severity: "minor",
        category: "images",
        message: "Image uses legacy format",
        description:
          "Modern image formats like WebP and AVIF provide better compression than JPEG and PNG, reducing file sizes by 25-35%.",
        helpUrl: "https://web.dev/uses-webp-images/",
        wcag: {
          id: "N/A",
          level: "AAA",
          name: "Performance Best Practice",
          description: "Use modern image formats",
        },
        element: {
          selector: buildSelector(img),
          html: img.outerHTML,
          failureSummary: `Image uses ${src.match(/\.(jpe?g|png)$/i)?.[0]} format`,
        },
        fix: {
          description: "Use WebP or AVIF with fallback to legacy formats",
          code: `<picture>\n  <source srcset="image.avif" type="image/avif">\n  <source srcset="image.webp" type="image/webp">\n  <img src="${src}" alt="...">\n</picture>`,
          learnMoreUrl: "https://web.dev/uses-webp-images/",
        },
      });
    }
  });

  return issues;
}

/**
 * Check JavaScript performance
 */
function checkJavaScript(page: BrowserPage): Issue[] {
  const issues: Issue[] = [];
  const document = page.document;

  const scripts = document.querySelectorAll("script[src]");

  scripts.forEach((script, index) => {
    const src = script.getAttribute("src") || "";
    const async = script.hasAttribute("async");
    const defer = script.hasAttribute("defer");
    const type = script.getAttribute("type");

    // Scripts without async or defer (except module scripts)
    if (!async && !defer && type !== "module") {
      issues.push({
        id: `perf-script-sync-${index}`,
        ruleId: "script-blocking",
        severity: "serious",
        category: "technical",
        message: "Render-blocking JavaScript detected",
        description:
          "Synchronous scripts block HTML parsing. Use async or defer attributes to load scripts without blocking the page.",
        helpUrl: "https://web.dev/render-blocking-resources/",
        wcag: {
          id: "N/A",
          level: "AAA",
          name: "Performance Best Practice",
          description: "Avoid blocking JavaScript",
        },
        element: {
          selector: buildSelector(script),
          html: script.outerHTML,
          failureSummary: "Script loads synchronously, blocking page rendering",
        },
        fix: {
          description: "Add defer or async attribute to the script tag",
          code: `<!-- Use defer for scripts that need DOM -->\n<script src="${src}" defer></script>\n\n<!-- Use async for independent scripts -->\n<script src="${src}" async></script>`,
          learnMoreUrl: "https://web.dev/render-blocking-resources/",
        },
      });
    }
  });

  // Check for inline scripts in head
  const inlineScripts = document.querySelectorAll("head script:not([src])");
  if (inlineScripts.length > 3) {
    issues.push({
      id: `perf-inline-scripts-${Date.now()}`,
      ruleId: "excessive-inline-scripts",
      severity: "moderate",
      category: "technical",
      message: `${inlineScripts.length} inline scripts in <head>`,
      description:
        "Excessive inline scripts in the head can delay page rendering. Consider moving scripts to external files or to the end of the body.",
      helpUrl: "https://web.dev/efficiently-load-third-party-javascript/",
      wcag: {
        id: "N/A",
        level: "AAA",
        name: "Performance Best Practice",
        description: "Minimize inline scripts",
      },
      element: {
        selector: "head script:not([src])",
        html: `${inlineScripts.length} inline scripts`,
        failureSummary: `${inlineScripts.length} inline scripts found in head`,
      },
      fix: {
        description: "Move inline scripts to external files or end of body",
        code: "<!-- Move scripts to end of body -->\n</body>\n<script>\n  // Your code here\n</script>\n</html>",
        learnMoreUrl:
          "https://web.dev/efficiently-load-third-party-javascript/",
      },
    });
  }

  return issues;
}

/**
 * Check for potential layout shifts
 */
function checkLayoutShift(page: BrowserPage): Issue[] {
  const issues: Issue[] = [];
  const document = page.document;

  // Ads or iframes without dimensions
  const iframes = document.querySelectorAll("iframe");
  iframes.forEach((iframe, index) => {
    const width = iframe.getAttribute("width");
    const height = iframe.getAttribute("height");

    if (!width || !height) {
      issues.push({
        id: `perf-iframe-no-dimensions-${index}`,
        ruleId: "iframe-missing-dimensions",
        severity: "moderate",
        category: "technical",
        message: "Iframe missing width and height attributes",
        description:
          "Iframes without explicit dimensions can cause layout shifts when they load, particularly for ads and embeds.",
        helpUrl: "https://web.dev/optimize-cls/",
        wcag: {
          id: "N/A",
          level: "AAA",
          name: "Performance Best Practice",
          description: "Specify iframe dimensions",
        },
        element: {
          selector: buildSelector(iframe),
          html: iframe.outerHTML,
          failureSummary: "Iframe does not have width and height attributes",
        },
        fix: {
          description:
            "Add width and height attributes or use aspect-ratio CSS",
          code: `<iframe src="..." width="560" height="315"></iframe>\n\n<!-- Or use CSS -->\n<style>\n  .video-container {\n    aspect-ratio: 16/9;\n  }\n</style>`,
          learnMoreUrl: "https://web.dev/optimize-cls/",
        },
      });
    }
  });

  // Fonts without font-display
  const fontLinks = document.querySelectorAll(
    'link[rel="stylesheet"][href*="fonts"]',
  );
  if (fontLinks.length > 0) {
    issues.push({
      id: `perf-font-display-${Date.now()}`,
      ruleId: "font-no-display",
      severity: "minor",
      category: "technical",
      message: "Web fonts may cause layout shifts",
      description:
        "Web fonts should use font-display: swap to prevent invisible text and reduce layout shifts.",
      helpUrl: "https://web.dev/font-display/",
      wcag: {
        id: "N/A",
        level: "AAA",
        name: "Performance Best Practice",
        description: "Use font-display for web fonts",
      },
      element: {
        selector: 'link[rel="stylesheet"][href*="fonts"]',
        html: fontLinks[0].outerHTML,
        failureSummary: "Font loading may block rendering",
      },
      fix: {
        description: "Add font-display: swap to @font-face rules",
        code: "@font-face {\n  font-family: 'MyFont';\n  src: url('font.woff2');\n  font-display: swap; /* Show fallback font immediately */\n}",
        learnMoreUrl: "https://web.dev/font-display/",
      },
    });
  }

  return issues;
}

/**
 * Check for render-blocking resources
 */
function checkRenderBlocking(page: BrowserPage): Issue[] {
  const issues: Issue[] = [];
  const document = page.document;

  // CSS in head without media or disabled
  const blockingCSS = Array.from(
    document.querySelectorAll('head link[rel="stylesheet"]'),
  ).filter((link) => {
    const media = link.getAttribute("media");
    const disabled = link.hasAttribute("disabled");
    // Blocking if no media attribute (or media="all") and not disabled
    return !disabled && (!media || media === "all" || media === "screen");
  });

  if (blockingCSS.length > 2) {
    issues.push({
      id: `perf-blocking-css-${Date.now()}`,
      ruleId: "render-blocking-css",
      severity: "serious",
      category: "technical",
      message: `${blockingCSS.length} render-blocking stylesheets detected`,
      description:
        "Multiple render-blocking CSS files delay the First Contentful Paint (FCP). Consider inlining critical CSS and loading non-critical CSS asynchronously.",
      helpUrl: "https://web.dev/render-blocking-resources/",
      wcag: {
        id: "N/A",
        level: "AAA",
        name: "Performance Best Practice",
        description: "Eliminate render-blocking CSS",
      },
      element: {
        selector: 'head link[rel="stylesheet"]',
        html: `${blockingCSS.length} blocking stylesheets`,
        failureSummary: `${blockingCSS.length} CSS files block rendering`,
      },
      fix: {
        description: "Inline critical CSS and defer non-critical styles",
        code: '<!-- Inline critical CSS -->\n<style>\n  /* Critical styles */\n</style>\n\n<!-- Preload non-critical CSS -->\n<link rel="preload" href="styles.css" as="style" onload="this.rel=\'stylesheet\'">\n<noscript><link rel="stylesheet" href="styles.css"></noscript>',
        learnMoreUrl: "https://web.dev/render-blocking-resources/",
      },
    });
  }

  return issues;
}

/**
 * Check font loading optimization
 */
function checkFonts(page: BrowserPage): Issue[] {
  const issues: Issue[] = [];
  const document = page.document;

  // Check for font preloading
  const fontLinks = document.querySelectorAll(
    'link[rel="stylesheet"][href*="font"]',
  );
  const fontPreloads = document.querySelectorAll(
    'link[rel="preload"][as="font"]',
  );

  if (fontLinks.length > 0 && fontPreloads.length === 0) {
    issues.push({
      id: `perf-no-font-preload-${Date.now()}`,
      ruleId: "font-no-preload",
      severity: "minor",
      category: "technical",
      message: "Web fonts not preloaded",
      description:
        "Preloading critical fonts ensures they're discovered early in the page load, reducing font-loading delays.",
      helpUrl: "https://web.dev/codelab-preload-web-fonts/",
      wcag: {
        id: "N/A",
        level: "AAA",
        name: "Performance Best Practice",
        description: "Preload critical fonts",
      },
      element: {
        selector: 'link[href*="font"]',
        html: fontLinks[0].outerHTML,
        failureSummary: "Fonts are not preloaded",
      },
      fix: {
        description: "Add preload links for critical fonts",
        code: '<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>',
        learnMoreUrl: "https://web.dev/codelab-preload-web-fonts/",
      },
    });
  }

  // Check for Google Fonts without optimization
  const googleFonts = document.querySelectorAll(
    'link[href*="fonts.googleapis.com"]',
  );
  if (googleFonts.length > 0) {
    const hasPreconnect = document.querySelector(
      'link[rel="preconnect"][href*="fonts.googleapis.com"]',
    );

    if (!hasPreconnect) {
      issues.push({
        id: `perf-google-fonts-no-preconnect-${Date.now()}`,
        ruleId: "google-fonts-no-preconnect",
        severity: "minor",
        category: "technical",
        message: "Google Fonts not optimized with preconnect",
        description:
          "Adding preconnect hints for Google Fonts establishes early connections, reducing font loading time.",
        helpUrl: "https://web.dev/optimize-webfont-loading/",
        wcag: {
          id: "N/A",
          level: "AAA",
          name: "Performance Best Practice",
          description: "Preconnect to Google Fonts",
        },
        element: {
          selector: 'link[href*="fonts.googleapis.com"]',
          html: googleFonts[0].outerHTML,
          failureSummary: "Google Fonts link without preconnect",
        },
        fix: {
          description: "Add preconnect links before Google Fonts stylesheet",
          code: '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">',
          learnMoreUrl: "https://web.dev/optimize-webfont-loading/",
        },
      });
    }
  }

  return issues;
}

/**
 * Run performance audit
 * Note: Uses heuristic-based checks since we're using jsdom, not a real browser
 */
export async function auditPerformance(page: BrowserPage): Promise<{
  issues: Issue[];
  passed: PendingCheck[];
}> {
  const issues: Issue[] = [];
  const passed: PendingCheck[] = [];

  // Resource analysis
  const resourceIssues = checkResources(page);
  resourceIssues.forEach((issue) => issues.push(issue));
  if (resourceIssues.length === 0) {
    passed.push({
      id: "perf-resources",
      name: "Resource Efficiency",
      category: "technical",
      description: "Resource count and sizes are reasonable",
    });
  }

  // Image optimization
  const imageIssues = checkImages(page);
  imageIssues.forEach((issue) => issues.push(issue));
  if (imageIssues.length === 0) {
    passed.push({
      id: "perf-images",
      name: "Image Optimization",
      category: "images",
      description: "Images are optimally configured",
    });
  }

  // JavaScript efficiency
  const jsIssues = checkJavaScript(page);
  jsIssues.forEach((issue) => issues.push(issue));
  if (jsIssues.length === 0) {
    passed.push({
      id: "perf-javascript",
      name: "JavaScript Efficiency",
      category: "technical",
      description: "JavaScript is efficiently loaded",
    });
  }

  // Layout shift potential
  const clsIssues = checkLayoutShift(page);
  clsIssues.forEach((issue) => issues.push(issue));
  if (clsIssues.length === 0) {
    passed.push({
      id: "perf-cls",
      name: "Layout Stability",
      category: "technical",
      description: "No elements likely to cause layout shifts",
    });
  }

  // Render-blocking resources
  const renderBlockIssues = checkRenderBlocking(page);
  renderBlockIssues.forEach((issue) => issues.push(issue));
  if (renderBlockIssues.length === 0) {
    passed.push({
      id: "perf-render-blocking",
      name: "Render-Blocking Resources",
      category: "technical",
      description: "No render-blocking resources detected",
    });
  }

  // Font optimization
  const fontIssues = checkFonts(page);
  fontIssues.forEach((issue) => issues.push(issue));
  if (fontIssues.length === 0) {
    passed.push({
      id: "perf-fonts",
      name: "Font Loading",
      category: "technical",
      description: "Fonts are efficiently loaded",
    });
  }

  return { issues, passed };
}
