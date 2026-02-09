import { buildSelector } from "../browser.js";
/**
 * Run best practices audit
 */
export async function auditBestPractices(page) {
    const issues = [];
    const passed = [];
    // DOCTYPE check
    const doctypeIssue = checkDoctype(page);
    if (doctypeIssue) {
        issues.push(doctypeIssue);
    }
    else {
        passed.push({
            id: "bp-doctype",
            name: "DOCTYPE Declaration",
            category: "document",
            description: "Page has a valid HTML5 DOCTYPE",
        });
    }
    // Character encoding
    const charsetIssue = checkCharset(page);
    if (charsetIssue) {
        issues.push(charsetIssue);
    }
    else {
        passed.push({
            id: "bp-charset",
            name: "Character Encoding",
            category: "document",
            description: "Page specifies UTF-8 character encoding",
        });
    }
    // HTML lang attribute
    const langIssue = checkHtmlLang(page);
    if (langIssue) {
        issues.push(langIssue);
    }
    else {
        passed.push({
            id: "bp-html-lang",
            name: "HTML Language",
            category: "document",
            description: "HTML element has valid lang attribute",
        });
    }
    // Deprecated elements
    const deprecatedIssues = checkDeprecatedElements(page);
    deprecatedIssues.forEach((issue) => issues.push(issue));
    if (deprecatedIssues.length === 0) {
        passed.push({
            id: "bp-deprecated",
            name: "No Deprecated Elements",
            category: "structure",
            description: "Page does not use deprecated HTML elements",
        });
    }
    // Duplicate IDs
    const duplicateIdIssues = checkDuplicateIds(page);
    duplicateIdIssues.forEach((issue) => issues.push(issue));
    if (duplicateIdIssues.length === 0) {
        passed.push({
            id: "bp-duplicate-ids",
            name: "Unique IDs",
            category: "technical",
            description: "All element IDs are unique",
        });
    }
    // Broken images
    const brokenImageIssues = checkBrokenImages(page);
    brokenImageIssues.forEach((issue) => issues.push(issue));
    if (brokenImageIssues.length === 0) {
        passed.push({
            id: "bp-images",
            name: "Image Sources",
            category: "images",
            description: "All images have valid src attributes",
        });
    }
    // Invalid links
    const linkIssues = checkLinks(page);
    linkIssues.forEach((issue) => issues.push(issue));
    if (linkIssues.length === 0) {
        passed.push({
            id: "bp-links",
            name: "Link Validity",
            category: "interactive",
            description: "All links have valid href attributes",
        });
    }
    // Meta refresh
    const metaRefreshIssue = checkMetaRefresh(page);
    if (metaRefreshIssue) {
        issues.push(metaRefreshIssue);
    }
    else {
        passed.push({
            id: "bp-meta-refresh",
            name: "No Meta Refresh",
            category: "document",
            description: "Page does not use meta refresh redirects",
        });
    }
    // Vulnerable libraries
    const vulnLibIssues = checkVulnerableLibraries(page);
    vulnLibIssues.forEach((issue) => issues.push(issue));
    if (vulnLibIssues.length === 0) {
        passed.push({
            id: "bp-vulnerable-libs",
            name: "Library Security",
            category: "technical",
            description: "No known vulnerable libraries detected",
        });
    }
    // Password paste prevention
    const passwordPasteIssues = checkPasswordPaste(page);
    passwordPasteIssues.forEach((issue) => issues.push(issue));
    if (passwordPasteIssues.length === 0) {
        passed.push({
            id: "bp-password-paste",
            name: "Password Paste Allowed",
            category: "forms",
            description: "Password fields allow pasting",
        });
    }
    // Intrusive permissions
    const permissionIssues = checkIntrusivePermissions(page);
    permissionIssues.forEach((issue) => issues.push(issue));
    if (permissionIssues.length === 0) {
        passed.push({
            id: "bp-permissions",
            name: "Non-Intrusive Permissions",
            category: "technical",
            description: "No intrusive permission requests detected",
        });
    }
    return { issues, passed };
}
/**
 * Check for valid DOCTYPE
 */
function checkDoctype(page) {
    const document = page.document;
    const doctype = document.doctype;
    if (!doctype || doctype.name !== "html") {
        return {
            id: `bp-no-doctype-${Date.now()}`,
            ruleId: "doctype-missing",
            severity: "serious",
            category: "document",
            message: "Page missing HTML5 DOCTYPE declaration",
            description: "A valid DOCTYPE is required to ensure browsers render the page in standards mode. Without it, browsers may use quirks mode, leading to inconsistent rendering.",
            helpUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Doctype",
            wcag: {
                id: "N/A",
                level: "A",
                name: "HTML Best Practice",
                description: "Pages should have a valid DOCTYPE",
            },
            element: {
                selector: "html",
                html: "<!DOCTYPE html>",
                failureSummary: "Missing or invalid DOCTYPE declaration",
            },
            fix: {
                description: "Add HTML5 DOCTYPE at the beginning of the document",
                code: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  ...",
                learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Doctype",
            },
        };
    }
    return null;
}
/**
 * Check character encoding
 */
function checkCharset(page) {
    const document = page.document;
    const metaCharset = document.querySelector('meta[charset]');
    const metaHttpEquiv = document.querySelector('meta[http-equiv="Content-Type"]');
    if (!metaCharset && !metaHttpEquiv) {
        return {
            id: `bp-no-charset-${Date.now()}`,
            ruleId: "charset-missing",
            severity: "serious",
            category: "document",
            message: "Page missing character encoding declaration",
            description: "Specifying the character encoding prevents encoding-related rendering issues and potential security vulnerabilities.",
            helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset",
            wcag: {
                id: "N/A",
                level: "A",
                name: "HTML Best Practice",
                description: "Declare character encoding",
            },
            element: {
                selector: "head",
                html: '<meta charset="UTF-8">',
                failureSummary: "No character encoding specified",
            },
            fix: {
                description: "Add charset meta tag in the head section",
                code: '<head>\n  <meta charset="UTF-8">\n  ...',
                learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset",
            },
        };
    }
    const charset = metaCharset?.getAttribute("charset") || "";
    if (charset && charset.toLowerCase() !== "utf-8") {
        return {
            id: `bp-non-utf8-charset-${Date.now()}`,
            ruleId: "charset-not-utf8",
            severity: "moderate",
            category: "document",
            message: `Character encoding is ${charset}, not UTF-8`,
            description: "UTF-8 is the recommended character encoding for HTML documents as it supports all characters and languages.",
            helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset",
            wcag: {
                id: "N/A",
                level: "AA",
                name: "HTML Best Practice",
                description: "Use UTF-8 encoding",
            },
            element: {
                selector: "meta[charset]",
                html: metaCharset?.outerHTML || "",
                failureSummary: `Charset is ${charset} instead of UTF-8`,
            },
            fix: {
                description: "Change charset to UTF-8",
                code: '<meta charset="UTF-8">',
                learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset",
            },
        };
    }
    return null;
}
/**
 * Check HTML lang attribute
 */
function checkHtmlLang(page) {
    const document = page.document;
    const html = document.documentElement;
    const lang = html.getAttribute("lang");
    if (!lang) {
        return {
            id: `bp-no-html-lang-${Date.now()}`,
            ruleId: "html-lang-missing",
            severity: "serious",
            category: "document",
            message: "HTML element missing lang attribute",
            description: "The lang attribute helps screen readers use the correct pronunciation and helps search engines serve language-specific results.",
            helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang",
            wcag: {
                id: "WCAG 3.1.1",
                level: "A",
                name: "Language of Page",
                description: "The default language can be programmatically determined",
            },
            element: {
                selector: "html",
                html: '<html lang="en">',
                failureSummary: "HTML element does not have a lang attribute",
            },
            fix: {
                description: "Add lang attribute to the HTML element",
                code: '<html lang="en">',
                learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang",
            },
        };
    }
    return null;
}
/**
 * Check for deprecated HTML elements
 */
function checkDeprecatedElements(page) {
    const issues = [];
    const document = page.document;
    const deprecatedElements = [
        { tag: "marquee", name: "Marquee" },
        { tag: "blink", name: "Blink" },
        { tag: "font", name: "Font" },
        { tag: "center", name: "Center" },
    ];
    deprecatedElements.forEach(({ tag, name }) => {
        const elements = document.querySelectorAll(tag);
        elements.forEach((element, index) => {
            issues.push({
                id: `bp-deprecated-${tag}-${index}`,
                ruleId: `deprecated-${tag}`,
                severity: "moderate",
                category: "structure",
                message: `Deprecated <${tag}> element used`,
                description: `The <${tag}> element is deprecated and should not be used. Use CSS for styling and animations instead.`,
                helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element#deprecated_and_obsolete_elements",
                wcag: {
                    id: "N/A",
                    level: "A",
                    name: "HTML Best Practice",
                    description: "Avoid deprecated elements",
                },
                element: {
                    selector: buildSelector(element),
                    html: element.outerHTML,
                    failureSummary: `${name} element is deprecated`,
                },
                fix: {
                    description: `Replace <${tag}> with modern CSS`,
                    code: tag === "marquee"
                        ? "/* Use CSS animation */\n@keyframes scroll {\n  from { transform: translateX(100%); }\n  to { transform: translateX(-100%); }\n}"
                        : tag === "center"
                            ? "/* Use CSS */\n.centered {\n  text-align: center;\n}"
                            : "/* Use CSS for styling */",
                    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element#deprecated_and_obsolete_elements",
                },
            });
        });
    });
    return issues;
}
/**
 * Check for duplicate IDs
 */
function checkDuplicateIds(page) {
    const issues = [];
    const document = page.document;
    const allElements = document.querySelectorAll("[id]");
    const idCount = new Map();
    allElements.forEach((element) => {
        const id = element.getAttribute("id");
        if (id) {
            if (!idCount.has(id)) {
                idCount.set(id, []);
            }
            idCount.get(id).push(element);
        }
    });
    idCount.forEach((elements, id) => {
        if (elements.length > 1) {
            issues.push({
                id: `bp-duplicate-id-${id}`,
                ruleId: "duplicate-id",
                severity: "serious",
                category: "technical",
                message: `Duplicate ID "${id}" found ${elements.length} times`,
                description: "Element IDs must be unique. Duplicate IDs can cause accessibility issues, JavaScript errors, and unexpected CSS styling.",
                helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id",
                wcag: {
                    id: "WCAG 4.1.1",
                    level: "A",
                    name: "Parsing",
                    description: "Elements have unique IDs",
                },
                element: {
                    selector: `#${id}`,
                    html: elements[0].outerHTML,
                    failureSummary: `ID "${id}" is used ${elements.length} times`,
                },
                fix: {
                    description: "Make each ID unique or use classes instead",
                    code: `<!-- Use unique IDs -->\n<div id="${id}-1">...</div>\n<div id="${id}-2">...</div>\n\n<!-- Or use classes -->\n<div class="${id}">...</div>\n<div class="${id}">...</div>`,
                    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id",
                },
            });
        }
    });
    return issues;
}
/**
 * Check for broken images
 */
function checkBrokenImages(page) {
    const issues = [];
    const document = page.document;
    const images = document.querySelectorAll("img");
    images.forEach((img, index) => {
        const src = img.getAttribute("src");
        if (!src || src.trim() === "") {
            issues.push({
                id: `bp-img-no-src-${index}`,
                ruleId: "image-no-src",
                severity: "serious",
                category: "images",
                message: "Image has empty or missing src attribute",
                description: "Images must have a valid src attribute. Empty src attributes can cause unnecessary HTTP requests and accessibility issues.",
                helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-src",
                wcag: {
                    id: "N/A",
                    level: "A",
                    name: "HTML Best Practice",
                    description: "Images must have valid src",
                },
                element: {
                    selector: buildSelector(img),
                    html: img.outerHTML,
                    failureSummary: "Image src attribute is empty or missing",
                },
                fix: {
                    description: "Add a valid src attribute to the image",
                    code: '<img src="/images/photo.jpg" alt="Description">',
                    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-src",
                },
            });
        }
    });
    return issues;
}
/**
 * Check for invalid links
 */
function checkLinks(page) {
    const issues = [];
    const document = page.document;
    const links = document.querySelectorAll("a");
    links.forEach((link, index) => {
        const href = link.getAttribute("href");
        // Empty href
        if (!href || href.trim() === "") {
            issues.push({
                id: `bp-link-no-href-${index}`,
                ruleId: "link-no-href",
                severity: "moderate",
                category: "interactive",
                message: "Link has empty or missing href attribute",
                description: "Links should have a valid href attribute. Empty hrefs may confuse users and accessibility tools.",
                helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href",
                wcag: {
                    id: "N/A",
                    level: "A",
                    name: "HTML Best Practice",
                    description: "Links must have valid href",
                },
                element: {
                    selector: buildSelector(link),
                    html: link.outerHTML,
                    failureSummary: "Link href attribute is empty or missing",
                },
                fix: {
                    description: "Add a valid href or use a button instead",
                    code: '<!-- Use a link -->\n<a href="/page">Link text</a>\n\n<!-- Or use a button for actions -->\n<button type="button">Click me</button>',
                    learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href",
                },
            });
        }
        // Empty link text
        const text = link.textContent?.trim() || "";
        const ariaLabel = link.getAttribute("aria-label");
        const title = link.getAttribute("title");
        const hasImgChild = link.querySelector("img[alt]");
        if (!text && !ariaLabel && !title && !hasImgChild) {
            issues.push({
                id: `bp-link-no-text-${index}`,
                ruleId: "link-no-text",
                severity: "serious",
                category: "interactive",
                message: "Link has no accessible name",
                description: "Links must have accessible text for screen readers. Add text content, aria-label, or ensure child images have alt text.",
                helpUrl: "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context",
                wcag: {
                    id: "WCAG 2.4.4",
                    level: "A",
                    name: "Link Purpose",
                    description: "Links have accessible names",
                },
                element: {
                    selector: buildSelector(link),
                    html: link.outerHTML,
                    failureSummary: "Link has no accessible name",
                },
                fix: {
                    description: "Add text content or aria-label",
                    code: '<!-- Add text -->\n<a href="/page">Go to page</a>\n\n<!-- Or aria-label -->\n<a href="/page" aria-label="Go to page">\n  <svg>...</svg>\n</a>',
                    learnMoreUrl: "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context",
                },
            });
        }
    });
    return issues;
}
/**
 * Check for meta refresh
 */
function checkMetaRefresh(page) {
    const document = page.document;
    const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
    if (metaRefresh) {
        return {
            id: `bp-meta-refresh-${Date.now()}`,
            ruleId: "meta-refresh",
            severity: "serious",
            category: "document",
            message: "Page uses meta refresh for redirection",
            description: "Meta refresh redirects are problematic for accessibility, SEO, and user experience. Use server-side redirects (301/302) or JavaScript instead.",
            helpUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#http-equiv",
            wcag: {
                id: "WCAG 2.2.1",
                level: "A",
                name: "Timing Adjustable",
                description: "Avoid automatic redirects",
            },
            element: {
                selector: 'meta[http-equiv="refresh"]',
                html: metaRefresh.outerHTML,
                failureSummary: "Meta refresh redirect detected",
            },
            fix: {
                description: "Use server-side redirect or JavaScript",
                code: "// Server-side (e.g., Apache .htaccess)\nRedirect 301 /old-page /new-page\n\n// Or JavaScript\nwindow.location.href = '/new-page';",
                learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections",
            },
        };
    }
    return null;
}
/**
 * Check for vulnerable JavaScript libraries
 */
function checkVulnerableLibraries(page) {
    const issues = [];
    const document = page.document;
    const vulnerableLibs = [
        { pattern: /jquery[-.@]([0-9.]+)/i, name: "jQuery", maxSafeVersion: "3.5.0" },
        { pattern: /lodash[-.@]([0-9.]+)/i, name: "Lodash", maxSafeVersion: "4.17.21" },
        { pattern: /angular[-.@]1\.([0-9.]+)/i, name: "Angular 1.x", maxSafeVersion: null },
        { pattern: /bootstrap[-.@]([0-9.]+)/i, name: "Bootstrap", maxSafeVersion: "3.4.0" },
    ];
    const scripts = document.querySelectorAll("script[src]");
    scripts.forEach((script) => {
        const src = script.getAttribute("src") || "";
        vulnerableLibs.forEach(({ pattern, name, maxSafeVersion }) => {
            const match = src.match(pattern);
            if (match) {
                const version = match[1];
                let isVulnerable = false;
                if (maxSafeVersion === null) {
                    isVulnerable = true; // e.g., Angular 1.x is always flagged
                }
                else if (version) {
                    isVulnerable = compareVersions(version, maxSafeVersion) < 0;
                }
                if (isVulnerable) {
                    issues.push({
                        id: `bp-vulnerable-lib-${name}-${Date.now()}`,
                        ruleId: "vulnerable-library",
                        severity: "critical",
                        category: "technical",
                        message: `Vulnerable ${name} version detected`,
                        description: `The page uses ${name} ${version || 'unknown version'}, which has known security vulnerabilities. Update to the latest version.`,
                        helpUrl: "https://snyk.io/vuln/",
                        wcag: {
                            id: "N/A",
                            level: "AAA",
                            name: "Security Best Practice",
                            description: "Avoid vulnerable libraries",
                        },
                        element: {
                            selector: buildSelector(script),
                            html: script.outerHTML,
                            failureSummary: `${name} ${version} has known vulnerabilities`,
                        },
                        fix: {
                            description: `Update ${name} to the latest secure version`,
                            code: `// Update to latest version\n// Check https://snyk.io/vuln/ for details\n// npm update ${name.toLowerCase()}`,
                            learnMoreUrl: "https://snyk.io/vuln/",
                        },
                    });
                }
            }
        });
    });
    return issues;
}
/**
 * Check for password paste prevention
 */
function checkPasswordPaste(page) {
    const issues = [];
    const document = page.document;
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach((field, index) => {
        const onpaste = field.getAttribute("onpaste");
        if (onpaste && onpaste.includes("return false")) {
            issues.push({
                id: `bp-password-no-paste-${index}`,
                ruleId: "password-paste-blocked",
                severity: "serious",
                category: "forms",
                message: "Password field blocks pasting",
                description: "Preventing password pasting discourages the use of password managers, weakening security. Users should be allowed to paste passwords.",
                helpUrl: "https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords",
                wcag: {
                    id: "N/A",
                    level: "AAA",
                    name: "Security Best Practice",
                    description: "Allow password pasting",
                },
                element: {
                    selector: buildSelector(field),
                    html: field.outerHTML,
                    failureSummary: "Password field prevents pasting",
                },
                fix: {
                    description: "Remove onpaste restriction",
                    code: '<!-- Allow pasting -->\n<input type="password" name="password">',
                    learnMoreUrl: "https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords",
                },
            });
        }
    });
    return issues;
}
/**
 * Check for intrusive permission requests
 */
function checkIntrusivePermissions(page) {
    const issues = [];
    const document = page.document;
    // Check for geolocation API calls in inline scripts
    const inlineScripts = document.querySelectorAll("script:not([src])");
    inlineScripts.forEach((script, index) => {
        const content = script.textContent || "";
        if (content.includes("navigator.geolocation")) {
            issues.push({
                id: `bp-geolocation-${index}`,
                ruleId: "intrusive-geolocation",
                severity: "moderate",
                category: "technical",
                message: "Page may request geolocation on load",
                description: "Requesting geolocation permission immediately on page load is intrusive. Request permissions only when needed and in response to user actions.",
                helpUrl: "https://web.dev/permission-ux/",
                wcag: {
                    id: "N/A",
                    level: "AAA",
                    name: "UX Best Practice",
                    description: "Request permissions contextually",
                },
                element: {
                    selector: buildSelector(script),
                    html: script.outerHTML.substring(0, 200),
                    failureSummary: "Geolocation API called in script",
                },
                fix: {
                    description: "Request geolocation only when user initiates action",
                    code: "// Request on user action\nbutton.addEventListener('click', () => {\n  navigator.geolocation.getCurrentPosition(...);\n});",
                    learnMoreUrl: "https://web.dev/permission-ux/",
                },
            });
        }
        if (content.includes("Notification.requestPermission")) {
            issues.push({
                id: `bp-notification-${index}`,
                ruleId: "intrusive-notification",
                severity: "moderate",
                category: "technical",
                message: "Page may request notification permission on load",
                description: "Requesting notification permission immediately is intrusive and often denied. Request permissions contextually after user engagement.",
                helpUrl: "https://web.dev/permission-ux/",
                wcag: {
                    id: "N/A",
                    level: "AAA",
                    name: "UX Best Practice",
                    description: "Request permissions contextually",
                },
                element: {
                    selector: buildSelector(script),
                    html: script.outerHTML.substring(0, 200),
                    failureSummary: "Notification permission requested in script",
                },
                fix: {
                    description: "Request notification permission in response to user action",
                    code: "// Request on user action\nbutton.addEventListener('click', async () => {\n  const permission = await Notification.requestPermission();\n  // Handle permission\n});",
                    learnMoreUrl: "https://web.dev/permission-ux/",
                },
            });
        }
    });
    return issues;
}
/**
 * Compare semantic versions
 */
function compareVersions(v1, v2) {
    const parts1 = v1.split(".").map(Number);
    const parts2 = v2.split(".").map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const part1 = parts1[i] || 0;
        const part2 = parts2[i] || 0;
        if (part1 < part2)
            return -1;
        if (part1 > part2)
            return 1;
    }
    return 0;
}
//# sourceMappingURL=best-practices.js.map