import readme from "./README.md";
import { mdToJson } from "./mdToJson";

interface ApiEndpoint {
  url: string;
  description: string;
  category?: string;
  isStarred?: boolean;
}

// Function to get starred items from localStorage
function getStarredItems(): Record<string, boolean> {
  try {
    const starred = localStorage.getItem("starredTools");
    return starred ? JSON.parse(starred) : {};
  } catch (e) {
    console.warn("Error reading starred items:", e);
    return {};
  }
}

// Function to save starred items to localStorage
function saveStarredItems(items: Record<string, boolean>) {
  try {
    localStorage.setItem("starredTools", JSON.stringify(items));
  } catch (e) {
    console.warn("Error saving starred items:", e);
  }
}

function renderToolCard(
  url: string,
  description: string,
  pathname: string,
  isStarred: boolean,
): string {
  const domain = new URL(url).hostname;
  const fullUrl = `${url}${pathname.slice(1)}`;
  const urlKey = encodeURIComponent(url);

  return `
    <div class="tool-card group ${
      isStarred ? "bg-yellow-50" : ""
    }" data-url="${urlKey}">
      <a href="${fullUrl}" class="flex-grow flex items-center" target="_blank">
        <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=40" 
             class="favicon" 
             alt="${domain} favicon">
        <span class="text-gray-700 group-hover:text-gray-900">${description}</span>
      </a>
      <button class="star-button ml-2 p-2 hover:text-yellow-500 transition-colors" 
              onclick="toggleStar('${urlKey}', this)">
        <svg class="w-5 h-5 ${isStarred ? "text-yellow-500" : "text-gray-400"}" 
             fill="currentColor" 
             viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </button>
    </div>
  `;
}

function parseUrlsFromReadme(content: string): ApiEndpoint[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const endpoints: ApiEndpoint[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const [_, text, url] = match;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        endpoints.push({
          url: parsedUrl.toString().endsWith("/")
            ? parsedUrl.toString()
            : parsedUrl.toString() + "/",
          description: text.trim(),
        });
      }
    } catch (e) {
      console.warn(`Skipping invalid URL: ${url}`);
    }
  }

  return endpoints;
}

function renderCategory(title: string, content: any, pathname: string): string {
  if (!content) {
    return "";
  }

  const urls = parseUrlsFromReadme(content);
  const starredItems = getStarredItems();

  // Add isStarred property to each endpoint
  const urlsWithStarred = urls.map((endpoint) => ({
    ...endpoint,
    isStarred: starredItems[encodeURIComponent(endpoint.url)] || false,
  }));

  // Sort items - starred items first
  const sortedUrls = urlsWithStarred.sort((a, b) => {
    if (a.isStarred === b.isStarred) return 0;
    return a.isStarred ? -1 : 1;
  });

  const items = sortedUrls
    .map((item) =>
      renderToolCard(item.url, item.description, pathname, item.isStarred),
    )
    .join("\n");

  return `
    <div class="category">
      <h2 class="text-lg font-semibold mb-4">${title}</h2>
      <div class="space-y-2">
        ${items}
      </div>
    </div>
  `;
}

export const html = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce(
    (result, str, i) => result + str + (values[i] || ""),
    "",
  );
};
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const [owner, repo] = pathname.slice(1).split("/");
    const name = owner && repo ? `${owner}/${repo}` : "GitHub";
    const title = `Tools For ${name}`;
    const ogImageUrl = `https://quickog.com/screenshot/forgithub.com${pathname}`;

    const sections = mdToJson(readme);
    const firstH1 = Object.keys(sections)[1];
    const categoriesHtml = Object.entries(sections[firstH1])
      .filter(([key]) => key !== "_content")
      .map(([category, content]) =>
        renderCategory(category, (content as any)._content, pathname),
      )
      .join("\n");

    const htmlString = html`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>${title}</title>
          <meta
            name="description"
            content="Replace 'github.com' with 'forgithub.com' to find highly accessible github tools"
          />
          <meta name="robots" content="index, follow" />

          <!-- Facebook Meta Tags -->
          <meta property="og:url" content="https://forgithub.com" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="${title}" />
          <meta
            property="og:description"
            content="Replace 'github.com' with 'forgithub.com' to find highly accessible github tools"
          />
          <meta property="og:image" content="${ogImageUrl}" />
          <meta
            property="og:image:alt"
            content="Replace 'github.com' with 'forgithub.com' to find highly accessible github tools"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <!-- Twitter Meta Tags -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="forgithub.com" />
          <meta property="twitter:url" content="https://forgithub.com" />
          <meta name="twitter:title" content="${title}" />
          <meta
            name="twitter:description"
            content="Replace 'github.com' with 'forgithub.com' to find highly accessible github tools"
          />
          <meta name="twitter:image" content="${ogImageUrl}" />

          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          />
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 1rem;
              line-height: 1.5;
              color: #24292e;
            }
            .tool-card {
              display: flex;
              align-items: center;
              padding: 0.5rem;
              border: 1px solid #e1e4e8;
              border-radius: 6px;
              margin-bottom: 0.5rem;
              transition: all 0.2s;
              text-decoration: none;
            }
            .tool-card:hover {
              background-color: #f6f8fa;
            }
            .tool-card.bg-yellow-50:hover {
              background-color: #fef9c3;
            }
            .favicon {
              width: 16px;
              height: 16px;
              margin-right: 0.5rem;
            }
            .category-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 2rem;
              margin-top: 2rem;
            }
            .category {
              background: #fff;
              padding: 1rem;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .star-button {
              border: none;
              background: none;
              cursor: pointer;
              padding: 0.5rem;
              border-radius: 4px;
            }
            .star-button:hover {
              background-color: rgba(0, 0, 0, 0.05);
            }
          </style>
          <script>
            function toggleStar(urlKey, button) {
              // Prevent the click from triggering the link
              event.preventDefault();
              event.stopPropagation();

              // Get current starred items
              let starred = {};
              try {
                const stored = localStorage.getItem("starredTools");
                if (stored) starred = JSON.parse(stored);
              } catch (e) {
                console.warn("Error reading starred items:", e);
              }

              // Toggle starred state
              starred[urlKey] = !starred[urlKey];

              // Update localStorage
              try {
                localStorage.setItem("starredTools", JSON.stringify(starred));
              } catch (e) {
                console.warn("Error saving starred items:", e);
              }

              // Update UI
              const card = button.closest(".tool-card");
              const starIcon = button.querySelector("svg");

              if (starred[urlKey]) {
                card.classList.add("bg-yellow-50");
                starIcon.classList.remove("text-gray-400");
                starIcon.classList.add("text-yellow-500");
              } else {
                card.classList.remove("bg-yellow-50");
                starIcon.classList.remove("text-yellow-500");
                starIcon.classList.add("text-gray-400");

                // Move card to bottom of starred items section
                const category = card.closest(".category");
                const cardsContainer = card.parentElement;
                const starredCards = Array.from(
                  cardsContainer.querySelectorAll(".tool-card.bg-yellow-50"),
                );
                if (starredCards.length > 0) {
                  cardsContainer.insertBefore(
                    card,
                    starredCards[starredCards.length - 1].nextSibling,
                  );
                }
              }
            }

            // Initialize starred items on page load
            document.addEventListener("DOMContentLoaded", () => {
              try {
                const starred = localStorage.getItem("starredTools");
                if (starred) {
                  const starredItems = JSON.parse(starred);
                  Object.entries(starredItems).forEach(
                    ([urlKey, isStarred]) => {
                      if (isStarred) {
                        const card = document.querySelector(
                          \`.tool-card[data-url="\${urlKey}"]\`,
                        );
                        if (card) {
                          card.classList.add("bg-yellow-50");
                          const starIcon =
                            card.querySelector(".star-button svg");
                          starIcon.classList.remove("text-gray-400");
                          starIcon.classList.add("text-yellow-500");
                        }
                      }
                    },
                  );
                }
              } catch (e) {
                console.warn("Error initializing starred items:", e);
              }
            });
          </script>
        </head>
        <body>
          <div class="max-w-7xl mx-auto">
            <header class="flex justify-between items-center mb-8">
              <h1 class="text-2xl font-bold">${title}</h1>
              <div class="flex items-center gap-4">
                <a
                  href="https://github.com/janwilmake/forgithub"
                  class="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg
                    class="w-6 h-6 mr-2"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                    ></path>
                  </svg>
                  Source
                </a>
              </div>
            </header>

            <div class="mb-6 bg-gray-100 rounded-lg p-4 text-gray-600">
              <p>
                Replace 'github.com' with 'forgithub.com' to find highly
                accessible github tools
              </p>

              <p class="mt-4">
                Current path: <b>${pathname}</b>
                ${owner && repo
                  ? `
                  <a target="_blank" href="https://github.com${pathname}" 
                     class="text-gray-600 hover:text-gray-900">
                    (View on GitHub)
                  </a>
                `
                  : ""}
              </p>
            </div>

            <div class="category-grid">${categoriesHtml}</div>
          </div>
        </body>
      </html>`;

    return new Response(htmlString, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
