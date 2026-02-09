function checkTitle(page) {
    const titleEl = page.document.querySelector("title");
    const title = titleEl?.textContent?.trim() || "";
    const length = title.length;
    if (!titleEl || !title) {
        return {
            id: `seo-title-missing-${Date.now()}`,
            ruleId: "seo-title-missing",
            severity: "critical",
            category: "document",
            message: "Page is missing a title tag",
            description: "Every page should have a unique, descriptive title tag for SEO and accessibility",
            helpUrl: "https://developers.google.com/search/docs/appearance/title-link",
            wcag: {
                id: "2.4.2",
                level: "A",
                name: "Page Titled",
                description: "Web pages have titles",
            },
            element: {
                selector: "head",
                html: "<head>...</head>",
                failureSummary: "No title tag found",
            },
            fix: {
                description: "Add a descriptive title tag within the <head> section",
                code: "<title>Your Page Title Here (50-60 characters)</title>",
                learnMoreUrl: "https://developers.google.com/search/docs/appearance/title-link",
            },
        };
    }
    if (length < 30 || length > 60) {
        return {
            id: `seo-title-length-${Date.now()}`,
            ruleId: "seo-title-length",
            severity: "moderate",
            category: "document",
            message: `Title length is ${length} characters (recommended: 50-60)`,
            description: "Page titles should be between 50-60 characters for optimal display",
            helpUrl: "https://developers.google.com/search/docs/appearance/title-link",
            wcag: {
                id: "2.4.2",
                level: "A",
                name: "Page Titled",
                description: "Titles describe topic or purpose",
            },
            element: {
                selector: "title",
                html: titleEl.outerHTML,
                failureSummary: `Title is ${length} chars`,
            },
            fix: {
                description: "Adjust your title to be between 50-60 characters for better SEO",
                code: `<title>${title.substring(0, 60)}...</title>`,
                learnMoreUrl: "https://developers.google.com/search/docs/appearance/title-link",
            },
        };
    }
    return null;
}
function checkMetaDescription(page) {
    const meta = page.document.querySelector('meta[name="description"]');
    const content = meta?.getAttribute("content")?.trim() || "";
    const length = content.length;
    if (!meta || !content) {
        return {
            id: `seo-meta-desc-missing-${Date.now()}`,
            ruleId: "seo-meta-desc-missing",
            severity: "serious",
            category: "document",
            message: "Page is missing a meta description",
            description: "Meta descriptions help search engines understand page content",
            helpUrl: "https://developers.google.com/search/docs/appearance/snippet",
            wcag: {
                id: "2.4.2",
                level: "A",
                name: "Page Titled",
                description: "Pages are properly described",
            },
            element: {
                selector: "head",
                html: "<head>...</head>",
                failureSummary: "No meta description",
            },
            fix: {
                description: "Add a meta description tag within the <head> section",
                code: '<meta name="description" content="A compelling description (150-160 characters)">',
                learnMoreUrl: "https://developers.google.com/search/docs/appearance/snippet",
            },
        };
    }
    if (length < 120 || length > 160) {
        return {
            id: `seo-meta-desc-length-${Date.now()}`,
            ruleId: "seo-meta-desc-length",
            severity: "moderate",
            category: "document",
            message: `Meta description is ${length} characters (recommended: 150-160)`,
            description: "Meta descriptions should be between 150-160 characters",
            helpUrl: "https://developers.google.com/search/docs/appearance/snippet",
            wcag: {
                id: "2.4.2",
                level: "A",
                name: "Page Titled",
                description: "Descriptions are available",
            },
            element: {
                selector: 'meta[name="description"]',
                html: meta.outerHTML,
                failureSummary: `Description is ${length} chars`,
            },
            fix: {
                description: "Adjust your meta description to be between 150-160 characters",
                code: `<meta name="description" content="${content.substring(0, 160)}...">`,
                learnMoreUrl: "https://developers.google.com/search/docs/appearance/snippet",
            },
        };
    }
    return null;
}
function checkH1(page) {
    const h1s = page.document.querySelectorAll("h1");
    const issues = [];
    if (h1s.length === 0) {
        issues.push({
            id: `seo-h1-missing-${Date.now()}`,
            ruleId: "seo-h1-missing",
            severity: "serious",
            category: "structure",
            message: "Page is missing an H1 heading",
            description: "Every page should have exactly one H1 heading",
            helpUrl: "https://developers.google.com/search/docs",
            wcag: {
                id: "1.3.1",
                level: "A",
                name: "Info and Relationships",
                description: "Structure is clear",
            },
            element: {
                selector: "body",
                html: "<body>...</body>",
                failureSummary: "No H1 found",
            },
            fix: {
                description: "Add a single H1 heading that describes your page content",
                code: "<h1>Your Main Page Heading</h1>",
                learnMoreUrl: "https://developers.google.com/search/docs",
            },
        });
    }
    else if (h1s.length > 1) {
        issues.push({
            id: `seo-h1-multiple-${Date.now()}`,
            ruleId: "seo-h1-multiple",
            severity: "moderate",
            category: "structure",
            message: `Page has ${h1s.length} H1 headings (should have exactly 1)`,
            description: "Multiple H1 headings can confuse search engines",
            helpUrl: "https://developers.google.com/search/docs",
            wcag: {
                id: "1.3.1",
                level: "A",
                name: "Info and Relationships",
                description: "Structure is clear",
            },
            element: {
                selector: "h1",
                html: h1s[0].outerHTML,
                failureSummary: `${h1s.length} H1 headings found`,
            },
            fix: {
                description: "Keep only one H1 heading and convert others to H2 or lower",
                code: "<h1>Main Heading</h1>\n<h2>Subheading 1</h2>\n<h2>Subheading 2</h2>",
                learnMoreUrl: "https://developers.google.com/search/docs",
            },
        });
    }
    return issues;
}
function checkViewport(page) {
    const viewport = page.document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        return {
            id: `seo-viewport-missing-${Date.now()}`,
            ruleId: "seo-viewport-missing",
            severity: "serious",
            category: "document",
            message: "Page is missing a viewport meta tag",
            description: "Viewport meta tag is essential for mobile-friendliness",
            helpUrl: "https://developers.google.com/search/docs",
            wcag: {
                id: "1.4.4",
                level: "AA",
                name: "Resize Text",
                description: "Users can zoom",
            },
            element: {
                selector: "head",
                html: "<head>...</head>",
                failureSummary: "No viewport tag",
            },
            fix: {
                description: "Add a viewport meta tag for mobile optimization",
                code: '<meta name="viewport" content="width=device-width, initial-scale=1">',
                learnMoreUrl: "https://developers.google.com/search/docs",
            },
        };
    }
    return null;
}
function checkHTTPS(page) {
    if (!page.url.startsWith("https://")) {
        return {
            id: `seo-https-${Date.now()}`,
            ruleId: "seo-https",
            severity: "critical",
            category: "technical",
            message: "Page is not served over HTTPS",
            description: "HTTPS is a ranking factor and essential for security",
            helpUrl: "https://developers.google.com/search/docs",
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
                description: "Enable HTTPS on your server",
                code: "RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]",
                learnMoreUrl: "https://developers.google.com/search/docs",
            },
        };
    }
    return null;
}
function checkCanonical(page) {
    const canonical = page.document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        return {
            id: `seo-canonical-missing-${Date.now()}`,
            ruleId: "seo-canonical-missing",
            severity: "moderate",
            category: "document",
            message: "Page is missing a canonical URL",
            description: "Canonical URLs help prevent duplicate content issues",
            helpUrl: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
            wcag: {
                id: "4.1.1",
                level: "A",
                name: "Parsing",
                description: "URLs are unique",
            },
            element: {
                selector: "head",
                html: "<head>...</head>",
                failureSummary: "No canonical link",
            },
            fix: {
                description: "Add a canonical link tag to specify the preferred URL",
                code: `<link rel="canonical" href="${page.url}">`,
                learnMoreUrl: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls",
            },
        };
    }
    return null;
}
function checkOpenGraph(page) {
    const issues = [];
    const ogTitle = page.document.querySelector('meta[property="og:title"]');
    const ogImage = page.document.querySelector('meta[property="og:image"]');
    if (!ogTitle) {
        issues.push({
            id: `seo-og-title-${Date.now()}`,
            ruleId: "seo-og-title",
            severity: "moderate",
            category: "document",
            message: "Missing Open Graph title",
            description: "Open Graph tags improve how page appears when shared",
            helpUrl: "https://ogp.me/",
            wcag: {
                id: "2.4.2",
                level: "A",
                name: "Page Titled",
                description: "Pages are titled",
            },
            element: {
                selector: "head",
                html: "<head>...</head>",
                failureSummary: "No og:title",
            },
            fix: {
                description: "Add Open Graph meta tags for better social sharing",
                code: '<meta property="og:title" content="Your Page Title">\n<meta property="og:image" content="https://example.com/image.jpg">',
                learnMoreUrl: "https://ogp.me/",
            },
        });
    }
    if (!ogImage) {
        issues.push({
            id: `seo-og-image-${Date.now()}`,
            ruleId: "seo-og-image",
            severity: "moderate",
            category: "document",
            message: "Missing Open Graph image",
            description: "og:image ensures preview image displays when shared",
            helpUrl: "https://ogp.me/",
            wcag: {
                id: "1.1.1",
                level: "A",
                name: "Non-text Content",
                description: "Images have alternatives",
            },
            element: {
                selector: "head",
                html: "<head>...</head>",
                failureSummary: "No og:image",
            },
            fix: {
                description: "Add an Open Graph image tag",
                code: '<meta property="og:image" content="https://example.com/image.jpg">',
                learnMoreUrl: "https://ogp.me/",
            },
        });
    }
    return issues;
}
function checkStructuredData(page) {
    const schema = page.document.querySelector('script[type="application/ld+json"]');
    if (!schema) {
        return {
            id: `seo-schema-missing-${Date.now()}`,
            ruleId: "seo-schema-missing",
            severity: "moderate",
            category: "document",
            message: "Page has no structured data (Schema.org)",
            description: "Structured data helps search engines understand content",
            helpUrl: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
            wcag: {
                id: "4.1.2",
                level: "A",
                name: "Name, Role, Value",
                description: "Metadata is available",
            },
            element: {
                selector: "head",
                html: "<head>...</head>",
                failureSummary: "No structured data",
            },
            fix: {
                description: "Add Schema.org structured data using JSON-LD format",
                code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Your Page Name",\n  "description": "Your page description"\n}\n</script>',
                learnMoreUrl: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data",
            },
        };
    }
    return null;
}
/**
 * Run SEO audit
 */
export async function auditSEO(page) {
    const issues = [];
    const passed = [];
    // Check title tag
    const titleCheck = checkTitle(page);
    if (titleCheck) {
        issues.push(titleCheck);
    }
    else {
        passed.push({
            id: "seo-title",
            name: "Page Title",
            category: "document",
            description: "Title is present and properly sized",
        });
    }
    // Check meta description
    const metaDescCheck = checkMetaDescription(page);
    if (metaDescCheck) {
        issues.push(metaDescCheck);
    }
    else {
        passed.push({
            id: "seo-meta-desc",
            name: "Meta Description",
            category: "document",
            description: "Meta description is present and properly sized",
        });
    }
    // Check H1
    const h1Check = checkH1(page);
    h1Check.forEach((issue) => issues.push(issue));
    if (h1Check.length === 0) {
        passed.push({
            id: "seo-h1",
            name: "H1 Heading",
            category: "structure",
            description: "Page has exactly one H1 heading",
        });
    }
    // Check viewport
    const viewportCheck = checkViewport(page);
    if (viewportCheck) {
        issues.push(viewportCheck);
    }
    else {
        passed.push({
            id: "seo-viewport",
            name: "Viewport Meta Tag",
            category: "document",
            description: "Viewport meta tag is present",
        });
    }
    // Check HTTPS
    const httpsCheck = checkHTTPS(page);
    if (httpsCheck) {
        issues.push(httpsCheck);
    }
    else {
        passed.push({
            id: "seo-https",
            name: "HTTPS Protocol",
            category: "technical",
            description: "Page is served over HTTPS",
        });
    }
    // Check canonical
    const canonicalCheck = checkCanonical(page);
    if (canonicalCheck) {
        issues.push(canonicalCheck);
    }
    else {
        passed.push({
            id: "seo-canonical",
            name: "Canonical URL",
            category: "document",
            description: "Canonical URL is present",
        });
    }
    // Check Open Graph
    const ogChecks = checkOpenGraph(page);
    ogChecks.forEach((issue) => issues.push(issue));
    if (ogChecks.length === 0) {
        passed.push({
            id: "seo-og",
            name: "Open Graph Tags",
            category: "document",
            description: "Open Graph tags are present",
        });
    }
    // Check structured data
    const schemaCheck = checkStructuredData(page);
    if (schemaCheck) {
        issues.push(schemaCheck);
    }
    else {
        passed.push({
            id: "seo-schema",
            name: "Structured Data",
            category: "document",
            description: "Structured data is present",
        });
    }
    return { issues, passed };
}
//# sourceMappingURL=seo.js.map