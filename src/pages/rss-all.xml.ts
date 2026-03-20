import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { readFileSync, statSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

export const GET: APIRoute = async (context) => {
  // Load posts from all sections
  const blogMatches = import.meta.glob("./blog/*.{md,mdx}", { eager: true });
  const portfolioMatches = import.meta.glob("./portfolio/*.md", { eager: true });

  const blogPosts = Object.values(blogMatches).filter(
    (post: any) => !post.frontmatter.hidden
  );
  const portfolioPosts = Object.values(portfolioMatches).filter(
    (post: any) => !post.frontmatter.hidden
  );

  // Get the directory of the current file (source directory, not dist)
  const __filename = fileURLToPath(import.meta.url);
  let __dirname = dirname(__filename);
  if (__dirname.includes("/dist/")) {
    __dirname = __dirname.replace("/dist/", "/src/");
  }

  // Helper function to process a post and get its content
  const processPost = async (
    post: any,
    matches: Record<string, any>,
    section: "blog" | "portfolio"
  ) => {
    // Determine image URL based on section
    let imageUrl: string | undefined;
    if (section === "blog") {
      imageUrl = post.frontmatter.image?.url;
    } else {
      imageUrl = post.frontmatter.header || post.frontmatter.thumbnail;
    }

    let fullImageUrl: string | undefined;
    let imageType: string | undefined;

    if (imageUrl) {
      const siteUrl = context.site
        ? String(context.site)
        : "https://fridayyy.dev";
      const baseUrl = siteUrl.replace(/\/$/, "");
      const cleanImageUrl = imageUrl.startsWith("/")
        ? imageUrl
        : `/${imageUrl}`;
      fullImageUrl = `${baseUrl}${cleanImageUrl}`;

      const ext = imageUrl.split(".").pop()?.toLowerCase();
      if (ext === "png") imageType = "image/png";
      else if (ext === "jpg" || ext === "jpeg") imageType = "image/jpeg";
      else if (ext === "gif") imageType = "image/gif";
      else imageType = "image/jpeg";
    }

    // Get publication date
    let pubDate = new Date();

    // First, try to get date from frontmatter (works for all sections)
    if (post.frontmatter.pubDate) {
      pubDate = new Date(post.frontmatter.pubDate);
    } else if (post.frontmatter.date) {
      pubDate = new Date(post.frontmatter.date);
    } else {
      // Fall back to file modification time only if no date in frontmatter
      try {
        const fileEntries = Object.entries(matches);
        const fileEntry = fileEntries.find(
          ([path, p]: [string, any]) =>
            p === post || p.frontmatter?.title === post.frontmatter?.title
        );
        if (fileEntry) {
          const [relativePath] = fileEntry;
          const absolutePath = join(__dirname, relativePath.replace("./", ""));
          const stats = statSync(absolutePath);
          pubDate = stats.mtime;
        }
      } catch {}
    }

    // Get content
    let content = "";
    try {
      const fileEntries = Object.entries(matches);
      const fileEntry = fileEntries.find(
        ([path, p]: [string, any]) =>
          p === post || p.frontmatter?.title === post.frontmatter?.title
      );

      if (fileEntry) {
        const [relativePath] = fileEntry;
        const absolutePath = join(__dirname, relativePath.replace("./", ""));

        const fileContent = readFileSync(absolutePath, "utf-8");
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const markdownContent = fileContent
          .replace(frontmatterRegex, "")
          .trim();

        if (markdownContent) {
          const html = await marked.parse(markdownContent);
          content = sanitizeHtml(html, {
            allowedTags: [
              "p",
              "br",
              "strong",
              "em",
              "u",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "ul",
              "ol",
              "li",
              "blockquote",
              "code",
              "pre",
              "a",
              "img",
              "figure",
              "figcaption",
              "iframe",
              "video",
              "source",
            ],
            allowedAttributes: {
              a: ["href", "title"],
              img: ["src", "alt", "title", "width", "height"],
              iframe: [
                "src",
                "title",
                "frameborder",
                "allow",
                "allowfullscreen",
                "style",
              ],
              video: ["preload", "autoplay", "loop"],
              source: ["src", "type"],
            },
            allowedSchemes: ["http", "https", "mailto"],
          });
        }
      }
    } catch (error) {
      console.error("Error processing content for RSS:", error);
    }

    // Determine URL based on section
    let link = post.url;
    if (!link) {
      const slug = post.frontmatter.title
        .toLowerCase()
        .replace(/\s+/g, "-");
      link = `/${section}/${slug}/`;
    }

    return {
      title: post.frontmatter.title,
      description: post.frontmatter.description || "",
      pubDate: pubDate,
      link: link,
      author: post.frontmatter.author || "Andrew Friday",
      content: content,
      ...(fullImageUrl &&
        imageType && {
          customData: `<enclosure url="${fullImageUrl}" type="${imageType}" />`,
        }),
    };
  };

  // Process all posts
  const allItems = await Promise.all([
    ...blogPosts.map((post) => processPost(post, blogMatches, "blog")),
    ...portfolioPosts.map((post) => processPost(post, portfolioMatches, "portfolio")),
  ]);

  // Sort all items by publication date (newest first)
  const sortedItems = allItems.sort((a, b) => {
    return b.pubDate.getTime() - a.pubDate.getTime();
  });

  return rss({
    title: "Andrew Friday - All Posts",
    description:
      "All posts from Andrew Friday including blog posts and portfolio projects.",
    site: context.site ? String(context.site) : "https://fridayyy.dev",
    items: sortedItems,
    customData: `<language>en-us</language>`,
  });
};
