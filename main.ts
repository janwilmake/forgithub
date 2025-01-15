import readme from "./README.md";

// worker.ts
interface ApiEndpoint {
  url: string;
  description: string;
}

async function parseUrlsFromReadme(content: string): Promise<ApiEndpoint[]> {
  // Match markdown links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const endpoints: ApiEndpoint[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const [_, text, url] = match;

    try {
      // Validate URL and ensure it's absolute
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        endpoints.push({
          url: parsedUrl.toString(),
          description: text.trim(),
        });
      }
    } catch (e) {
      // Skip invalid URLs
      console.warn(`Skipping invalid URL: ${url}`);
    }
  }

  return endpoints;
}

export default {
  async fetch(request: Request): Promise<Response> {
    // Get the pathname from the request URL
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Parse URLs from README
    const apiEndpoints = await parseUrlsFromReadme(readme);

    // Generate HTML with links and descriptions
    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GitHub API Tools</title>
      <style>
          body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
              max-width: 800px;
              margin: 2rem auto;
              padding: 0 1rem;
              line-height: 1.5;
              color: #24292e;
          }
          h1 {
              border-bottom: 1px solid #eaecef;
              padding-bottom: 0.3em;
          }
          .links {
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
          }
          .link-card {
              padding: 1.5rem;
              border: 1px solid #e1e4e8;
              border-radius: 6px;
              transition: box-shadow 0.2s, border-color 0.2s;
          }
          .link-card:hover {
              border-color: #0366d6;
              box-shadow: 0 1px 3px rgba(3, 102, 214, 0.1);
          }
          .link-hostname {
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 0.75rem;
              color: #24292e;
          }
          .link-description {
              font-size: 1.1rem;
              color: #24292e;
              margin-bottom: 0.75rem;
              line-height: 1.4;
          }
          .link-url {
              display: block;
              color: #6a737d;
              text-decoration: none;
              font-size: 0.85rem;
              font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
          }
          .link-url:hover {
              color: #0366d6;
          }
          .current-path {
              color: #586069;
              margin-bottom: 1.5rem;
              padding: 0.75rem;
              background: #f6f8fa;
              border-radius: 4px;
              font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
          }
          .no-links {
              text-align: center;
              padding: 2rem;
              color: #586069;
          }
      </style>
  </head>
  <body>
      <h1>GitHub API Tools</h1>
      <div class="current-path">
          Current path: ${pathname}
      </div>
      <div class="links">
          ${
            apiEndpoints.length > 0
              ? apiEndpoints
                  .map((endpoint) => {
                    const fullUrl = `${endpoint.url}${pathname}`;
                    const hostname = new URL(endpoint.url).hostname;
                    return `
                <a href="${fullUrl}" class="link-url" target="_blank">
                <div class="link-card">
                    <div class="link-hostname">${hostname}</div>
                    <div class="link-description">${endpoint.description}</div>
                    ${fullUrl}
                </div>
                </a>`;
                  })
                  .join("\n")
              : '<div class="no-links">No valid links found in README.md</div>'
          }
      </div>
  </body>
  </html>`;

    // Return the HTML response
    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
