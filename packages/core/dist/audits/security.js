import fetch from "node-fetch";
/**
 * Run security audit
 */
export async function auditSecurity(page) {
    const issues = [];
    const passed = [];
    // Check HTTPS
    const httpsCheck = checkHTTPS(page);
    if (httpsCheck)
        issues.push(httpsCheck);
    else
        passed.push({
            id: "sec-https",
            name: "HTTPS Enabled",
            category: "technical",
            description: "Page is served over HTTPS",
        });
    // Check mixed content
    const mixedCheck = checkMixedContent(page);
    mixedCheck.forEach((issue) => issues.push(issue));
    if (mixedCheck.length === 0)
        passed.push({
            id: "sec-mixed",
            name: "No Mixed Content",
            category: "technical",
            description: "No HTTP resources on HTTPS page",
        });
    // Check security headers
    const headerChecks = await checkSecurityHeaders(page);
    headerChecks.forEach((issue) => issues.push(issue));
    // Check for password fields over HTTP
    const pwCheck = checkPasswordFieldsSecurity(page);
    if (pwCheck)
        issues.push(pwCheck);
    else
        passed.push({
            id: "sec-password",
            name: "Password Fields Secure",
            category: "technical",
            description: "Password fields are on HTTPS",
        });
    // Check for external links
    const extLinkCheck = checkExternalLinks(page);
    if (extLinkCheck)
        issues.push(extLinkCheck);
    else
        passed.push({
            id: "sec-ext-links",
            name: "External Links Secure",
            category: "technical",
            description: "External links have security attributes",
        });
    return { issues, passed };
}
function checkHTTPS(page) {
    if (!page.url.startsWith("https://")) {
        return {
            id: `sec-https-${Date.now()}`,
            ruleId: "sec-https",
            severity: "critical",
            category: "technical",
            message: "Page is not served over HTTPS",
            description: "HTTPS encrypts data between browser and server",
            helpUrl: "https://developers.google.com/web/fundamentals/security/encrypt-in-transit",
            wcag: {
                id: "4.1.1",
                level: "A",
                name: "Parsing",
                description: "Security is maintained",
            },
            element: {
                selector: "body",
                html: "<body>...</body>",
                failureSummary: `URL: ${page.url}`,
            },
            fix: {
                description: "Enable HTTPS on your web server",
                code: "RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]",
                learnMoreUrl: "https://developers.google.com/web/fundamentals/security/encrypt-in-transit",
            },
        };
    }
    return null;
}
function checkMixedContent(page) {
    const issues = [];
    const mixedElements = [
        ...page.document.querySelectorAll('script[src^="http://"]'),
        ...page.document.querySelectorAll('link[href^="http://"]'),
        ...page.document.querySelectorAll('img[src^="http://"]'),
        ...page.document.querySelectorAll('iframe[src^="http://"]'),
    ];
    if (page.url.startsWith("https://") && mixedElements.length > 0) {
        issues.push({
            id: `sec-mixed-${Date.now()}`,
            ruleId: "sec-mixed",
            severity: "serious",
            category: "technical",
            message: `Found ${mixedElements.length} HTTP resource(s) on HTTPS page`,
            description: "Mixed content weakens HTTPS security",
            helpUrl: "https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content",
            wcag: {
                id: "4.1.1",
                level: "A",
                name: "Parsing",
                description: "Security is maintained",
            },
            element: {
                selector: "body",
                html: "<body>...</body>",
                failureSummary: `${mixedElements.length} mixed content resources`,
            },
            fix: {
                description: "Update all resource URLs to use HTTPS",
                code: '<!-- Change from -->\n<script src="http://example.com/script.js"></script>\n<!-- To -->\n<script src="https://example.com/script.js"></script>',
                learnMoreUrl: "https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content",
            },
        });
    }
    return issues;
}
async function checkSecurityHeaders(page) {
    const issues = [];
    const headers = [
        { name: "Content-Security-Policy", severity: "serious" },
        { name: "Strict-Transport-Security", severity: "serious" },
        { name: "X-Frame-Options", severity: "serious" },
        { name: "X-Content-Type-Options", severity: "moderate" },
    ];
    try {
        const response = await fetch(page.url, { method: "HEAD" });
        for (const header of headers) {
            if (!response.headers.get(header.name)) {
                issues.push({
                    id: `sec-header-${header.name.toLowerCase()}-${Date.now()}`,
                    ruleId: `sec-header-${header.name.toLowerCase()}`,
                    severity: header.severity,
                    category: "technical",
                    message: `Missing ${header.name} header`,
                    description: `The ${header.name} header helps protect against security vulnerabilities`,
                    helpUrl: "https://owasp.org/www-project-secure-headers/",
                    wcag: {
                        id: "4.1.1",
                        level: "A",
                        name: "Parsing",
                        description: "Security headers are set",
                    },
                    element: {
                        selector: "body",
                        html: "<body>...</body>",
                        failureSummary: `${header.name} not found`,
                    },
                    fix: {
                        description: `Add the ${header.name} header to your server configuration`,
                        code: getHeaderFixCode(header.name),
                        learnMoreUrl: "https://owasp.org/www-project-secure-headers/",
                    },
                });
            }
        }
    }
    catch (error) {
        // Silent fail - can't check headers
    }
    return issues;
}
function getHeaderFixCode(headerName) {
    switch (headerName) {
        case "Content-Security-Policy":
            return `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`;
        case "Strict-Transport-Security":
            return `Strict-Transport-Security: max-age=31536000; includeSubDomains`;
        case "X-Frame-Options":
            return `X-Frame-Options: DENY`;
        case "X-Content-Type-Options":
            return `X-Content-Type-Options: nosniff`;
        default:
            return "";
    }
}
function checkPasswordFieldsSecurity(page) {
    const passwordFields = page.document.querySelectorAll('input[type="password"]');
    if (passwordFields.length > 0 && page.url.startsWith("http://")) {
        return {
            id: `sec-password-http-${Date.now()}`,
            ruleId: "sec-password-http",
            severity: "critical",
            category: "technical",
            message: "Password fields on non-HTTPS page",
            description: "Password fields should never be on HTTP pages",
            helpUrl: "https://owasp.org/www-project-web-security-testing-guide/",
            wcag: {
                id: "4.1.1",
                level: "A",
                name: "Parsing",
                description: "Security is maintained",
            },
            element: {
                selector: 'input[type="password"]',
                html: passwordFields[0].outerHTML,
                failureSummary: "Password field over HTTP",
            },
            fix: {
                description: "Enable HTTPS for all pages with password fields",
                code: "RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]",
                learnMoreUrl: "https://owasp.org/www-project-web-security-testing-guide/",
            },
        };
    }
    return null;
}
function checkExternalLinks(page) {
    const externalLinks = Array.from(page.document.querySelectorAll('a[target="_blank"]')).filter((link) => {
        if (!(link instanceof page.window.HTMLAnchorElement))
            return false;
        const rel = link.getAttribute("rel") || "";
        return !rel.includes("noopener") || !rel.includes("noreferrer");
    });
    if (externalLinks.length > 0) {
        return {
            id: `sec-ext-links-${Date.now()}`,
            ruleId: "sec-ext-links",
            severity: "moderate",
            category: "technical",
            message: `${externalLinks.length} external link(s) missing rel="noopener noreferrer"`,
            description: 'Links with target="_blank" should prevent reverse tabnabbing',
            helpUrl: "https://owasp.org/www-community/attacks/Reverse_Tabnabbing",
            wcag: {
                id: "4.1.2",
                level: "A",
                name: "Name, Role, Value",
                description: "Links are safe",
            },
            element: {
                selector: 'a[target="_blank"]',
                html: externalLinks[0]?.outerHTML || "",
                failureSummary: `${externalLinks.length} unsafe external links`,
            },
            fix: {
                description: 'Add rel="noopener noreferrer" to all target="_blank" links',
                code: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>',
                learnMoreUrl: "https://owasp.org/www-community/attacks/Reverse_Tabnabbing",
            },
        };
    }
    return null;
}
//# sourceMappingURL=security.js.map