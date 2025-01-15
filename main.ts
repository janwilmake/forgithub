import readme from "./README.md";

interface ApiEndpoint {
  url: string;
  description: string;
}

async function parseUrlsFromReadme(content: string): Promise<ApiEndpoint[]> {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const endpoints: ApiEndpoint[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const [_, text, url] = match;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        endpoints.push({
          url: parsedUrl.toString(),
          description: text.trim(),
        });
      }
    } catch (e) {
      console.warn(`Skipping invalid URL: ${url}`);
    }
  }

  return endpoints;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const apiEndpoints = await parseUrlsFromReadme(readme);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Highly Accessible Tools. For GitHub</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 1rem;
            line-height: 1.5;
            color: #24292e;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .header-title {
            margin: 0;
            flex-grow: 1;
        }
        .search-container {
            margin: 1rem 0;
            width: 100%;
        }
        .search-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            font-size: 1rem;
        }
        .gh-link {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            color: #24292e;
            text-decoration: none;
            margin-left: 1rem;
        }
        .gh-link svg {
            width: 24px;
            height: 24px;
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
            position: relative;
        }
        .link-card:hover {
            border-color: #0366d6;
            box-shadow: 0 1px 3px rgba(3, 102, 214, 0.1);
        }
        .link-card.starred {
            background-color: #fff8dc;
            border-color: #f1e05a;
        }
        .star-button {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
        }
        .star-button svg {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            transition: fill 0.2s;
        }
        .starred .star-button svg {
            fill: #f1e05a;
            stroke: #f1e05a;
        }
        .link-hostname {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: #24292e;
            padding-right: 2.5rem;
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
        .current-path {
            color: #586069;
            margin-bottom: 1.5rem;
            padding: 0.75rem;
            background: #f6f8fa;
            border-radius: 4px;
            font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
        }
        .info {
            color: #586069;
            margin-bottom: 1.5rem;
            padding: 0.75rem;
            background: #efefef;
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
    <div class="header">
        <h1 class="header-title">Highly Accessible Tools. For GitHub</h1>
        <a href="https://github.com/janwilmake/forgithub" class="gh-link" target="_blank">
            <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
        </a>
    </div>
    <div class="search-container">
        <input type="text" class="search-input" placeholder="Search endpoints..." id="searchInput">
    </div>
    <div class="info">Replace 'github.com' with 'forgithub.com' to find highly accessible github tools</div>

    <div class="current-path">
        Current path: ${pathname}
    </div>
    

    <div class="links" id="linkContainer">
        ${
          apiEndpoints.length > 0
            ? apiEndpoints
                .map((endpoint) => {
                  const fullUrl = `${endpoint.url}${pathname.slice(1)}`;
                  const hostname = new URL(endpoint.url).hostname;
                  const urlId = btoa(endpoint.url); // Create unique ID for the endpoint
                  return `
            <div class="link-card" data-url="${urlId}">
                <button class="star-button" onclick="toggleStar('${urlId}')">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                </button>
                <a href="${fullUrl}" class="link-url" target="_blank">
                    <div class="link-hostname">${hostname}</div>
                    <div class="link-description">${endpoint.description}</div>
                    ${fullUrl}
                </a>
            </div>`;
                })
                .join("\n")
            : '<div class="no-links">No valid links found in README.md</div>'
        }
    </div>
    <script>
        // Initialize starred endpoints from localStorage
        let starredEndpoints = new Set(JSON.parse(localStorage.getItem('starredEndpoints') || '[]'));

        // Apply initial starred state
        function initializeStarredState() {
            starredEndpoints.forEach(urlId => {
                const card = document.querySelector(\`[data-url="\${urlId}"]\`);
                if (card) {
                    card.classList.add('starred');
                }
            });
            sortCards();
        }

        // Toggle star state for an endpoint
        function toggleStar(urlId) {
            const card = document.querySelector(\`[data-url="\${urlId}"]\`);
            if (starredEndpoints.has(urlId)) {
                starredEndpoints.delete(urlId);
                card.classList.remove('starred');
            } else {
                starredEndpoints.add(urlId);
                card.classList.add('starred');
            }
            localStorage.setItem('starredEndpoints', JSON.stringify([...starredEndpoints]));
            sortCards();
        }

        // Sort cards (starred first)
        function sortCards() {
            const container = document.getElementById('linkContainer');
            const cards = Array.from(container.getElementsByClassName('link-card'));
            
            cards.sort((a, b) => {
                const aStarred = starredEndpoints.has(a.dataset.url);
                const bStarred = starredEndpoints.has(b.dataset.url);
                if (aStarred === bStarred) return 0;
                return aStarred ? -1 : 1;
            });

            cards.forEach(card => container.appendChild(card));
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.getElementsByClassName('link-card');
            
            Array.from(cards).forEach(card => {
                const description = card.querySelector('.link-description').textContent.toLowerCase();
                const url = card.querySelector('.link-url').textContent.toLowerCase();
                const isVisible = description.includes(searchTerm) || url.includes(searchTerm);
                card.style.display = isVisible ? 'block' : 'none';
            });
        });

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', initializeStarredState);
    </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
