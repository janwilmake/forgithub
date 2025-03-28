// Import README content as a markdown string and mdToJson function to parse it.
import readme from "./README.md";
import { getFormat } from "./getFormat";
import { stringify } from "yaml";
import { mdToJson } from "./mdToJson";

// Define an interface representing an API endpoint with URL, description, category, and starred state.
interface ApiEndpoint {
  url: string;
  description: string;
  category?: string;
  isStarred?: boolean;
}

/**
 * Retrieves the user's starred items from localStorage.
 * Returns an object where keys are URL-encoded tool URLs and values are booleans.
 */
function getStarredItems(): Record<string, boolean> {
  try {
    const starred = localStorage.getItem("starredTools");
    return starred ? JSON.parse(starred) : {};
  } catch (e) {
    console.warn("Error reading starred items:", e);
    return {};
  }
}

/**
 * Renders an HTML tool card for a given URL, description, and starred state.
 * @param url - The base URL of the tool.
 * @param description - A text description of the tool.
 * @param pathname - The current path name used for linking purposes.
 * @param isStarred - Boolean flag indicating if the tool is starred.
 * @returns A HTML string representing the tool card.
 */
function renderToolCard(
  url: string,
  description: string,
  pathname: string,
  isStarred: boolean,
): string {
  const domain = new URL(url).hostname;
  const fullUrl = `${url}${pathname.slice(1)}`;
  const urlKey = encodeURIComponent(url);

  // Create example URL display (original GitHub URL → tool URL)
  const examplePath = "owner/repo";
  const urlPattern = `${url}${examplePath}`;

  return `
    <div class="tool-card group ${
      isStarred ? "bg-yellow-50" : ""
    }" data-url="${urlKey}">
      <div class="flex flex-col w-full">
        <div class="flex items-start">
          <a href="${fullUrl}" class="flex-grow flex items-center" target="_blank">
            <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=40" 
                class="favicon mr-3" 
                alt="${domain} favicon">
            <div class="flex flex-col w-48">
              <span class="text-gray-800 font-medium group-hover:text-gray-900">${description}</span>
              <span class="text-gray-500 mt-1 font-mono" style="font-size:10px">${urlPattern}</span>
            </div>
          </a>
          <button class="star-button ml-2 p-2 hover:text-yellow-500 transition-colors" 
                onclick="toggleStar('${urlKey}', this)">
            <svg class="w-5 h-5 ${
              isStarred ? "text-yellow-500" : "text-gray-400"
            }" 
                fill="currentColor" 
                viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </button>
        </div>
        <a href="${fullUrl}" class="mt-2 text-sm text-gray-600 hover:text-gray-900" target="_blank">
          Try it with your current path →
        </a>
      </div>
    </div>
  `;
}

/**
 * Parses markdown content looking for Markdown links.
 * Each link is converted into an ApiEndpoint object with URL and description.
 * @param content - The markdown content to parse.
 * @returns An array of ApiEndpoint objects.
 */
function parseUrlsFromReadme(content: string): ApiEndpoint[] {
  // Regex to match markdown links: [description](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const endpoints: ApiEndpoint[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const [_, text, url] = match;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        endpoints.push({
          // Ensure URL ends with a "/"
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

/**
 * Gets a category description based on the category name
 * @param categoryName - The name of the category
 * @returns A description string for the category
 */
function getCategoryDescription(categoryName: string): string {
  const descriptions: Record<string, string> = {
    Editors:
      "Edit and modify repository code directly in your browser without cloning or downloading.",
    "LLM Context":
      "Use AI to understand, analyze, and chat with your codebase for better insights.",
    "LLM Conversions": "Convert and analyse the codebase using LLMs",
    Various: "Other useful tools.",
    APIs: "Analyse GitHub Repos at scale with these APIs",
  };

  return (
    descriptions[categoryName] || "Tools for working with GitHub repositories."
  );
}

/**
 * Renders an HTML category section provided a title and markdown content.
 * @param title - The category title.
 * @param content - The markdown content for that category.
 * @param pathname - The current path name to be used by tool card links.
 * @returns A HTML string representing the complete category block.
 */
function renderCategory(
  title: string,
  urls: ApiEndpoint[],
  pathname: string,
): string {
  const starredItems = getStarredItems();

  // Map endpoints to include the isStarred property from localStorage.
  const urlsWithStarred = urls.map((endpoint) => ({
    ...endpoint,
    isStarred: starredItems[encodeURIComponent(endpoint.url)] || false,
  }));

  // Sort items so that starred items are rendered first.
  const sortedUrls = urlsWithStarred.sort((a, b) => {
    if (a.isStarred === b.isStarred) return 0;
    return a.isStarred ? -1 : 1;
  });

  // Generate HTML for each tool card.
  const items = sortedUrls
    .map((item) =>
      renderToolCard(item.url, item.description, pathname, item.isStarred),
    )
    .join("\n");

  // Get the description for the category
  const categoryDescription = getCategoryDescription(title);

  return `
    <div class="category">
      <h2 class="text-lg font-semibold mb-2">${title}</h2>
      <p class="text-sm text-gray-600 mb-4">${categoryDescription}</p>
      <div class="space-y-3">
        ${items}
      </div>
    </div>
  `;
}

/**
 * A simple tagged template literal function to compose HTML strings.
 * @param strings - Template literal string segments.
 * @param values - Values to be interpolated.
 * @returns Combined HTML string.
 */
export const html = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce(
    (result, str, i) => result + str + (values[i] || ""),
    "",
  );
};

/**
 * Renders the explanatory header for the site
 * @param pathname - The current path from URL
 * @returns HTML string for the explanatory header
 */
function renderExplanationFooter(pathname: string): string {
  const hasPath = pathname !== "/";
  const currentPath = hasPath ? pathname : "/user/repo";

  return `
    <div class="my-8 bg-white rounded-lg p-6 shadow-md border border-gray-200">
      <h2 class="text-xl font-bold mb-4">GitHub Tools with URL UX</h2>
      
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Left side: explanation -->
        <div class="flex-1">
          <p class="text-lg mb-4">
            <span class="font-medium">Replace</span> <code class="bg-gray-100 px-2 py-1 rounded">github.com</code> 
            <span class="font-medium">with any tool domain</span> to instantly use that tool with your repository.
          </p>
          
          <div class="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
            <div class="flex items-center mb-3">
              <div class="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
              <span class="font-medium">Original:</span>
            </div>
            <code class="block bg-gray-100 p-2 rounded mb-4 break-all">https://github.com${currentPath}</code>
            
            <div class="flex items-center mb-3">
              <div class="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span class="font-medium">Transformed:</span>
            </div>
            <code class="block bg-blue-50 p-2 rounded text-blue-800 break-all">https://github.dev${currentPath}</code>
          </div>
          
          <p class="text-sm text-gray-600">Each tool below shows its URL pattern. Click any tool to try it with your current path.</p>
        </div>
        
        <!-- Right side: URL converter -->
        <div class="flex-1">
          <div class="border rounded-lg p-4 bg-gray-50">
            <h3 class="font-medium mb-3">Try it yourself:</h3>
            
            <div class="mb-3">
              <label class="block text-sm mb-1">GitHub Repository URL:</label>
              <input type="text" id="repo-url" 
                    placeholder="https://github.com/user/repo" 
                    class="w-full p-2 border rounded"
                    value="${
                      hasPath
                        ? `https://github.com${pathname}`
                        : "https://github.com/facebook/react"
                    }">
            </div>
            
            <div class="mb-3">
              <label class="block text-sm mb-1">Choose a tool:</label>
              <select id="tool-selector" class="w-full p-2 border rounded">
                <option value="https://github.dev">GitHub.dev - Edit in VS Code</option>
                <option value="https://stackblitz.com">StackBlitz - Online IDE</option>
                <option value="https://github.gg">GitHub.gg - Chat with Codebase</option>
                <option value="https://gitdiagram.com">GitDiagram - Codebase to Diagram</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="block text-sm mb-1">Result:</label>
              <div id="result-url" class="bg-green-50 p-2 border border-green-200 rounded text-green-800 break-all">
                <!-- Will be populated by JavaScript -->
              </div>
            </div>
            
            <button id="open-url" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              Open Repository in Selected Tool →
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

const getSections = () => {
  const rootSections = mdToJson(readme);

  // Assumes the first header in the README holds the tool categories.
  const firstH1 = Object.keys(rootSections)[1];
  const sections = Object.entries(rootSections[firstH1])
    .filter(([key]) => key !== "_content")
    .map(([category, content]) => ({
      category,
      content: (content as any)._content,
      urls: parseUrlsFromReadme((content as any)._content),
    }));
  return sections;
};

/**
 * Main export with fetch handler serving an HTML page.
 */
export default {
  async fetch(request: Request): Promise<Response> {
    // Parse the request URL and extract pathname and possible owner/repo segments.
    const url = new URL(request.url);
    const pathname = url.pathname;
    const [owner, repo] = pathname.slice(1).split("/");
    const title =
      owner && repo
        ? `Tools For GitHub Repo: ${owner}/${repo}`
        : "Accessible GitHub Tools For Any Repo";
    // Generate an Open Graph image URL based on the current pathname.
    const ogImageUrl = `https://quickog.com/screenshot/forgithub.com${pathname}`;
    const format = getFormat(request);
    const segmentChunks = pathname.split("/").pop()!.split(".");
    const ext = segmentChunks.length > 1 ? segmentChunks.pop() : undefined;

    // Parse the README markdown into sections.
    const sections = getSections();

    if (
      format === "text/markdown" &&
      (pathname === "/" || pathname === "/index.md")
    ) {
      return new Response(readme, {
        headers: { "content-type": "text/markdown" },
      });
    }

    const list = sections
      .map((item) => item.urls.map((x) => ({ ...x, category: item.category })))
      .flat()
      .map((x) => ({
        ...x,
        url:
          x.url +
          pathname.slice(1).slice(0, ext ? -1 * (ext.length + 1) : undefined),
      }));

    if (format === "application/json") {
      return new Response(JSON.stringify(list, undefined, 2), {
        headers: { "content-type": "application/json" },
      });
    }

    if (format === "text/yaml") {
      return new Response(stringify(list), {
        headers: { "content-type": "text/yaml" },
      });
    }

    // Render each category section into HTML.
    const categoriesHtml = sections
      .map((item) => renderCategory(item.category, item.urls, pathname))
      .join("\n");

    // Compose the complete HTML page.
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
            content="Access powerful GitHub tools by simply replacing 'github.com' with a tool's domain in any repository URL."
          />
          <meta name="robots" content="index, follow" />

          <!-- Facebook Meta Tags -->
          <meta property="og:url" content="https://forgithub.com" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="${title}" />
          <meta
            property="og:description"
            content="Access powerful GitHub tools by simply replacing 'github.com' with a tool's domain in any repository URL."
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
            content="Access powerful GitHub tools by simply replacing 'github.com' with a tool's domain in any repository URL."
          />
          <meta name="twitter:image" content="${ogImageUrl}" />

          <!-- Include Tailwind CSS from CDN for styling -->
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          />
          <style>
            /* Basic page styling */
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 1rem;
              line-height: 1.5;
              color: #24292e;
              background-color: #f8f9fa;
            }
            /* Tool card styling */
            .tool-card {
              display: flex;
              align-items: center;
              padding: 0.75rem;
              border: 1px solid #e1e4e8;
              border-radius: 6px;
              background-color: white;
              transition: all 0.2s;
              text-decoration: none;
            }
            .tool-card:hover {
              border-color: #0366d6;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .tool-card.bg-yellow-50:hover {
              background-color: #fef9c3;
            }
            .favicon {
              width: 20px;
              height: 20px;
              flex-shrink: 0;
            }
            /* Grid for categories */
            .category-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 2rem;
              margin-top: 2rem;
            }
            .category {
              background: #fff;
              padding: 1.25rem;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              border: 1px solid #e5e7eb;
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
            /**
             * Toggles the starred state of a tool card both in the UI and localStorage.
             * @param {string} urlKey - The URL-encoded key representing the tool.
             * @param {HTMLElement} button - The button element which was clicked.
             */
            function toggleStar(urlKey, button) {
              // Prevent the default click behavior from triggering the link.
              event.preventDefault();
              event.stopPropagation();

              // Retrieve current starred items from localStorage.
              let starred = {};
              try {
                const stored = localStorage.getItem("starredTools");
                if (stored) starred = JSON.parse(stored);
              } catch (e) {
                console.warn("Error reading starred items:", e);
              }

              // Toggle the starred state for the provided key.
              starred[urlKey] = !starred[urlKey];

              // Save the updated starred items back to localStorage.
              try {
                localStorage.setItem("starredTools", JSON.stringify(starred));
              } catch (e) {
                console.warn("Error saving starred items:", e);
              }

              // Update the UI based on the new state.
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
              }
            }

            // URL converter functionality
            document.addEventListener("DOMContentLoaded", () => {
              // Initialize starred items
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

              // Initialize URL converter
              const repoInput = document.getElementById("repo-url");
              const toolSelector = document.getElementById("tool-selector");
              const resultDisplay = document.getElementById("result-url");
              const openButton = document.getElementById("open-url");

              function updateResult() {
                const repoUrl = repoInput.value.trim();
                let path = "";

                try {
                  // Extract the path from the GitHub URL
                  const url = new URL(repoUrl);
                  if (url.hostname === "github.com") {
                    path = url.pathname;
                  } else {
                    path = "/facebook/react"; // Fallback
                  }
                } catch (e) {
                  path = "/facebook/react"; // Fallback for invalid URLs
                }

                const selectedTool = toolSelector.value;
                const newUrl = \`\${selectedTool}\${path}\`;

                resultDisplay.textContent = newUrl;
                openButton.onclick = () => window.open(newUrl, "_blank");
              }

              if (repoInput && toolSelector) {
                repoInput.addEventListener("input", updateResult);
                toolSelector.addEventListener("change", updateResult);

                // Initialize on page load
                updateResult();
              }
            });
          </script>
        </head>
        <body>
          <div class="max-w-6xl mx-auto">
            <header class="flex justify-between items-center mb-6">
              <h1 class="text-2xl font-bold">${title}</h1>

              <div class="flex items-center gap-4">
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=janwilmake&repo=forgithub&type=star&count=true&size=large"
                  frameborder="0"
                  scrolling="0"
                  width="150"
                  height="30"
                  title="GitHub"
                ></iframe>
              </div>
            </header>

            <p>
              Here's a list of tools and APIs that use the same URL structure as
              GitHub enabling you to use it by just changing your url (a.k.a.
              URL UX).
            </p>

            <!-- Explanation Header -->
            ${owner && repo
              ? `
              <div class="my-6 bg-gray-100 rounded-lg p-4 text-gray-600 border border-gray-200">
                <p>
                  <strong>Current repository:</strong> ${owner}/${repo}
                  <a target="_blank" href="https://github.com${pathname}" 
                     class="text-blue-600 hover:text-blue-800 ml-2">
                    (View on GitHub)
                  </a>
                </p>
              </div>
            `
              : `
<div class="mb-4 mt-2 py-2 px-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
  <span class="font-medium mr-2">Examples:</span>
  <a href="/OAI/OpenAPI-Specification" class="text-blue-600 hover:underline mr-3">OAI/OpenAPI-Specification</a>
  <a href="/cloudflare/agents-starter" class="text-blue-600 hover:underline mr-3">cloudflare/agents-starter</a>
  <a href="/LangbaseInc/langbase-sdk" class="text-blue-600 hover:underline mr-3">LangbaseInc/langbase-sdk</a>
  <a href="/cloudflare/cloudflare-docs" class="text-blue-600 hover:underline">cloudflare/cloudflare-docs</a>
</div>
`}

            <!-- Render all the tool categories as a grid -->
            <div class="category-grid">${categoriesHtml}</div>

            ${renderExplanationFooter(pathname)}

            <footer class="mt-12 text-center text-sm text-gray-500 p-4">
              <p>forgithub.com - Find GitHub Tools and APIs that use URL UX</p>
            </footer>
          </div>
        </body>
      </html>`;

    // Return the generated HTML page as a Response.
    return new Response(htmlString, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};
