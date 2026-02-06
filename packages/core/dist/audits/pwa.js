/**
 * Check web app manifest
 */
async function checkManifest(page) {
    const issues = [];
    const document = page.document;
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
        issues.push({
            id: `pwa-no-manifest-${Date.now()}`,
            ruleId: "manifest-missing",
            severity: "serious",
            category: "document",
            message: "Web app manifest not found",
            description: "A web app manifest is required for Progressive Web Apps. It defines how your app appears to users and enables installation.",
            helpUrl: "https://web.dev/add-manifest/",
            wcag: {
                id: "N/A",
                level: "AAA",
                name: "PWA Requirement",
                description: "Web app manifest must be present",
            },
            element: {
                selector: "head",
                html: '<link rel="manifest" href="/manifest.json">',
                failureSummary: "No manifest link found",
            },
            fix: {
                description: "Add a manifest link in the head section",
                code: '<head>\n  <link rel="manifest" href="/manifest.json">\n</head>',
                learnMoreUrl: "https://web.dev/add-manifest/",
            },
        });
        return issues; // Can't check manifest properties without a manifest
    }
    passed.push({
        id: "pwa-manifest-link",
        name: "Manifest Link Present",
        category: "document",
        description: "Manifest link tag is present",
    });
    // In a real implementation, we would fetch and parse the manifest file
    // For jsdom, we'll check if the link exists and provide guidance
    issues.push({
        id: `pwa-manifest-check-${Date.now()}`,
        ruleId: "manifest-validation",
        severity: "minor",
        category: "document",
        message: "Manifest should be validated",
        description: "Ensure your manifest.json includes required properties: name, icons (192x192 and 512x512), start_url, display, and theme_color.",
        helpUrl: "https://web.dev/add-manifest/",
        wcag: {
            id: "N/A",
            level: "AAA",
            name: "PWA Best Practice",
            description: "Manifest should have all required properties",
        },
        element: {
            selector: 'link[rel="manifest"]',
            html: manifestLink.outerHTML,
            failureSummary: "Manifest properties should be validated",
        },
        fix: {
            description: "Ensure manifest.json has all required properties",
            code: `{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`,
            learnMoreUrl: "https://web.dev/add-manifest/",
        },
    });
    return issues;
}
/**
 * Check service worker registration
 */
function checkServiceWorker(page) {
    const document = page.document;
    // Check for service worker registration in inline scripts
    const scripts = document.querySelectorAll("script:not([src])");
    let hasServiceWorker = false;
    scripts.forEach((script) => {
        const content = script.textContent || "";
        if (content.includes("navigator.serviceWorker.register")) {
            hasServiceWorker = true;
        }
    });
    if (!hasServiceWorker) {
        return {
            id: `pwa-no-service-worker-${Date.now()}`,
            ruleId: "service-worker-missing",
            severity: "serious",
            category: "technical",
            message: "Service worker not registered",
            description: "Service workers enable offline functionality and are a core requirement for Progressive Web Apps. They allow your app to work without a network connection.",
            helpUrl: "https://web.dev/service-workers-cache-storage/",
            wcag: {
                id: "N/A",
                level: "AAA",
                name: "PWA Requirement",
                description: "Service worker should be registered",
            },
            element: {
                selector: "script",
                html: "<script>",
                failureSummary: "No service worker registration found",
            },
            fix: {
                description: "Register a service worker",
                code: `// In your main JavaScript file
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}`,
                learnMoreUrl: "https://web.dev/service-workers-cache-storage/",
            },
        };
    }
    return null;
}
/**
 * Check HTTPS
 */
function checkHTTPS(page) {
    const url = page.url;
    if (!url.startsWith("https://")) {
        return {
            id: `pwa-not-https-${Date.now()}`,
            ruleId: "pwa-requires-https",
            severity: "critical",
            category: "technical",
            message: "PWA requires HTTPS",
            description: "Progressive Web Apps require HTTPS to ensure security. Service workers and many modern web APIs only work over secure connections.",
            helpUrl: "https://web.dev/why-https-matters/",
            wcag: {
                id: "N/A",
                level: "AAA",
                name: "PWA Requirement",
                description: "Must be served over HTTPS",
            },
            element: {
                selector: "html",
                html: url,
                failureSummary: "Page is not served over HTTPS",
            },
            fix: {
                description: "Serve your site over HTTPS",
                code: "// Use a hosting provider that supports HTTPS\n// Or use Let's Encrypt for free SSL certificates\n// https://letsencrypt.org/",
                learnMoreUrl: "https://web.dev/why-https-matters/",
            },
        };
    }
    return null;
}
/**
 * Check viewport meta tag
 */
function checkViewport(page) {
    const document = page.document;
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        return {
            id: `pwa-no-viewport-${Date.now()}`,
            ruleId: "viewport-missing",
            severity: "serious",
            category: "document",
            message: "Viewport meta tag missing",
            description: "The viewport meta tag is essential for responsive design and PWAs. It ensures your app displays correctly on mobile devices.",
            helpUrl: "https://web.dev/viewport/",
            wcag: {
                id: "N/A",
                level: "AAA",
                name: "PWA Requirement",
                description: "Viewport meta tag must be present",
            },
            element: {
                selector: "head",
                html: '<meta name="viewport" content="width=device-width, initial-scale=1">',
                failureSummary: "No viewport meta tag found",
            },
            fix: {
                description: "Add viewport meta tag to the head",
                code: '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n</head>',
                learnMoreUrl: "https://web.dev/viewport/",
            },
        };
    }
    const content = viewport.getAttribute("content") || "";
    if (!content.includes("width=device-width")) {
        return {
            id: `pwa-viewport-invalid-${Date.now()}`,
            ruleId: "viewport-invalid",
            severity: "moderate",
            category: "document",
            message: "Viewport meta tag missing width=device-width",
            description: "The viewport should include width=device-width to ensure proper responsive behavior on mobile devices.",
            helpUrl: "https://web.dev/viewport/",
            wcag: {
                id: "N/A",
                level: "AAA",
                name: "PWA Best Practice",
                description: "Viewport should be properly configured",
            },
            element: {
                selector: 'meta[name="viewport"]',
                html: viewport.outerHTML,
                failureSummary: "Viewport missing width=device-width",
            },
            fix: {
                description: "Update viewport content attribute",
                code: '<meta name="viewport" content="width=device-width, initial-scale=1">',
                learnMoreUrl: "https://web.dev/viewport/",
            },
        };
    }
    return null;
}
/**
 * Check Apple touch icon
 */
function checkAppleTouchIcon(page) {
    const document = page.document;
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
        return {
            id: `pwa-no-apple-icon-${Date.now()}`,
            ruleId: "apple-touch-icon-missing",
            severity: "minor",
            category: "document",
            message: "Apple touch icon not specified",
            description: "Apple touch icons ensure your PWA looks good when added to iOS home screens. Recommended size is 180x180px.",
            helpUrl: "https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html",
            wcag: {
                id: "N/A",
                level: "AAA",
                name: "PWA Best Practice",
                description: "Provide Apple touch icon",
            },
            element: {
                selector: "head",
                html: '<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png">',
                failureSummary: "No apple-touch-icon link found",
            },
            fix: {
                description: "Add apple-touch-icon link",
                code: '<head>\n  <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png">\n</head>',
                learnMoreUrl: "https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html",
            },
        };
    }
    return null;
}
/**
 * Check theme color
 */
function checkThemeColor(page) {
    const document = page.document;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
        return {
            id: `pwa-no-theme-color-${Date.now()}`,
            ruleId: "theme-color-missing",
            severity: "minor",
            category: "document",
            message: "Theme color not specified",
            description: "The theme-color meta tag customizes the browser UI color on mobile devices, providing a more native app-like experience.",
            helpUrl: "https://web.dev/themed-omnibox/",
            wcag: {
                id: "N/A",
                level: "AAA",
                name: "PWA Best Practice",
                description: "Provide theme color",
            },
            element: {
                selector: "head",
                html: '<meta name="theme-color" content="#ffffff">',
                failureSummary: "No theme-color meta tag found",
            },
            fix: {
                description: "Add theme-color meta tag",
                code: '<head>\n  <meta name="theme-color" content="#1a73e8">\n</head>',
                learnMoreUrl: "https://web.dev/themed-omnibox/",
            },
        };
    }
    return null;
}
const passed = [];
/**
 * Run PWA (Progressive Web App) audit
 */
export async function auditPWA(page) {
    const issues = [];
    const passed = [];
    // Web app manifest
    const manifestIssues = await checkManifest(page);
    manifestIssues.forEach((issue) => issues.push(issue));
    if (manifestIssues.length === 0) {
        passed.push({
            id: "pwa-manifest",
            name: "Web App Manifest",
            category: "document",
            description: "Valid web app manifest is present",
        });
    }
    // Service worker
    const swIssue = checkServiceWorker(page);
    if (swIssue) {
        issues.push(swIssue);
    }
    else {
        passed.push({
            id: "pwa-service-worker",
            name: "Service Worker",
            category: "technical",
            description: "Service worker is registered",
        });
    }
    // HTTPS
    const httpsIssue = checkHTTPS(page);
    if (httpsIssue) {
        issues.push(httpsIssue);
    }
    else {
        passed.push({
            id: "pwa-https",
            name: "HTTPS",
            category: "technical",
            description: "Page is served over HTTPS",
        });
    }
    // Viewport
    const viewportIssue = checkViewport(page);
    if (viewportIssue) {
        issues.push(viewportIssue);
    }
    else {
        passed.push({
            id: "pwa-viewport",
            name: "Viewport Meta Tag",
            category: "document",
            description: "Viewport meta tag is properly configured",
        });
    }
    // Apple touch icon
    const appleTouchIconIssue = checkAppleTouchIcon(page);
    if (appleTouchIconIssue) {
        issues.push(appleTouchIconIssue);
    }
    else {
        passed.push({
            id: "pwa-apple-icon",
            name: "Apple Touch Icon",
            category: "document",
            description: "Apple touch icon is specified",
        });
    }
    // Theme color
    const themeColorIssue = checkThemeColor(page);
    if (themeColorIssue) {
        issues.push(themeColorIssue);
    }
    else {
        passed.push({
            id: "pwa-theme-color",
            name: "Theme Color",
            category: "document",
            description: "Theme color is specified",
        });
    }
    return { issues, passed };
}
//# sourceMappingURL=pwa.js.map