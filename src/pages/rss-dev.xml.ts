import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { readFileSync, statSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

export const GET: APIRoute = async (context) => {
  const matches = import.meta.glob("./dev/*.md", { eager: true });
  const posts = Object.values(matches).filter(
    (post: any) => !post.frontmatter.hidden
  );

  // Sort by title (alphabetical) since there's no pubDate
  const sortedPosts = posts.sort((a: any, b: any) => {
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });

  // Get the directory of the current file (source directory, not dist)
  const __filename = fileURLToPath(import.meta.url);
  let __dirname = dirname(__filename);
  if (__dirname.includes("/dist/")) {
    __dirname = __dirname.replace("/dist/", "/src/");
  }

  // Process posts with async content rendering
  const items = await Promise.all(
    sortedPosts.map(async (post: any) => {
      // Dev posts use thumbnail or header instead of image.url
      const imageUrl =
        post.frontmatter.header || post.frontmatter.thumbnail;
      let fullImageUrl: string | undefined;
      let imageType: string | undefined;

      if (imageUrl) {
        const siteUrl = context.site
          ? String(context.site)
          : "https://danfessler.com";
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

      // Get the raw markdown content and convert to HTML
      let content = "";
      let pubDate = new Date(); // Default to current date
      
      // First, try to get date from frontmatter
      if (post.frontmatter.pubDate) {
        pubDate = new Date(post.frontmatter.pubDate);
      } else if (post.frontmatter.date) {
        pubDate = new Date(post.frontmatter.date);
      }
      
      try {
        const fileEntries = Object.entries(matches);
        const fileEntry = fileEntries.find(
          ([path, p]: [string, any]) =>
            p === post || p.frontmatter?.title === post.frontmatter?.title
        );

        if (fileEntry) {
          const [relativePath] = fileEntry;
          const absolutePath = join(__dirname, relativePath.replace("./", ""));

          // Only use file modification time if no date in frontmatter
          if (!post.frontmatter.pubDate && !post.frontmatter.date) {
            try {
              const stats = statSync(absolutePath);
              pubDate = stats.mtime;
            } catch {}
          }

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

      return {
        title: post.frontmatter.title,
        description: post.frontmatter.description || "",
        pubDate: pubDate,
        link:
          post.url ||
          `/dev/${post.frontmatter.title.toLowerCase().replace(/\s+/g, "-")}/`,
        author: "Dan Fessler",
        content: content,
        ...(fullImageUrl &&
          imageType && {
            customData: `<enclosure url="${fullImageUrl}" type="${imageType}" />`,
          }),
      };
    })
  );

  return rss({
    title: "Dan Fessler - Dev Portfolio",
    description:
      "Development portfolio showcasing open-source projects, tools, interpreters, and technical work.",
    site: context.site ? String(context.site) : "https://danfessler.com",
    items: items,
    customData: `<language>en-us</language>`,
  });
};

