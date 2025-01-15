// List of API URLs that follow GitHub's URL structure with descriptions
const apiEndpoints = [
  {
    url: "https://uithub.com",
    description: "Get prompt-friendly codebase access and analysis",
  },
  {
    url: "https://githus.com",
    description: "Static dashboard for repository metrics and insights",
  },
  {
    url: "https://diff.forgithub.com",
    description: "API to see repository diffs using compare URL structure",
  },
  {
    url: "https://join.forgithub.com",
    description: "Access cached data including issues, wiki, and actions",
  },
];

export default {
  async fetch(request) {
    // Get the pathname from the request URL
    const url = new URL(request.url);
    const pathname = url.pathname;

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
              gap: 1rem;
          }
          .link-card {
              padding: 1rem;
              border: 1px solid #e1e4e8;
              border-radius: 6px;
              transition: box-shadow 0.2s, border-color 0.2s;
          }
          .link-card:hover {
              border-color: #0366d6;
              box-shadow: 0 1px 3px rgba(3, 102, 214, 0.1);
          }
          .link-url {
              display: block;
              color: #0366d6;
              text-decoration: none;
              font-weight: 600;
              margin-bottom: 0.5rem;
          }
          .link-url:hover {
              text-decoration: underline;
          }
          .link-description {
              color: #586069;
              font-size: 0.9rem;
          }
          .current-path {
              color: #586069;
              margin-bottom: 1rem;
              padding: 0.5rem;
              background: #f6f8fa;
              border-radius: 4px;
              font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
          }
      </style>
  </head>
  <body>
      <h1>GitHub API Tools</h1>
      <div class="current-path">
          Current path: ${pathname}
      </div>
      <div class="links">
          ${apiEndpoints
            .map((endpoint) => {
              const fullUrl = `${endpoint.url}${pathname}`;
              return `
              <div class="link-card">
                  <a href="${fullUrl}" class="link-url" target="_blank">
                      ${fullUrl}
                  </a>
                  <div class="link-description">
                      ${endpoint.description}
                  </div>
              </div>`;
            })
            .join("\n")}
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
