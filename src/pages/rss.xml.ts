import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

export const GET: APIRoute = async (context) => {
  const matches = import.meta.glob("./blog/*.{md,mdx}", { eager: true });
  const posts = Object.values(matches).filter(
    (post: any) => !post.frontmatter.hidden
  );

  // Sort by date (newest first)
  const sortedPosts = posts.sort((a: any, b: any) => {
    return (
      new Date(b.frontmatter.pubDate).getTime() -
      new Date(a.frontmatter.pubDate).getTime()
    );
  });

  // Get the directory of the current file (source directory, not dist)
  // During build, we need to resolve relative to src/pages
  const __filename = fileURLToPath(import.meta.url);
  let __dirname = dirname(__filename);
  // If we're in dist, go back to src
  if (__dirname.includes("/dist/")) {
    __dirname = __dirname.replace("/dist/", "/src/");
  }

  // Process posts with async content rendering
  const items = await Promise.all(
    sortedPosts.map(async (post: any) => {
      const imageUrl = post.frontmatter.image?.url;
      let fullImageUrl: string | undefined;
      let imageType: string | undefined;

      if (imageUrl) {
        // Ensure proper URL construction (handle both absolute and relative paths)
        const siteUrl = context.site
          ? String(context.site)
          : "https://fridayyy.dev";
        const baseUrl = siteUrl.replace(/\/$/, "");
        const cleanImageUrl = imageUrl.startsWith("/")
          ? imageUrl
          : `/${imageUrl}`;
        fullImageUrl = `${baseUrl}${cleanImageUrl}`;

        // Determine image type from extension
        const ext = imageUrl.split(".").pop()?.toLowerCase();
        if (ext === "png") imageType = "image/png";
        else if (ext === "jpg" || ext === "jpeg") imageType = "image/jpeg";
        else if (ext === "gif") imageType = "image/gif";
        else imageType = "image/jpeg"; // default
      }

      // Get the raw markdown content and convert to HTML
      let content = "";
      try {
        // Find the file path from the matches object
        const fileEntries = Object.entries(matches);
        const fileEntry = fileEntries.find(
          ([path, p]: [string, any]) =>
            p === post || p.frontmatter?.title === post.frontmatter?.title
        );

        if (fileEntry) {
          const [relativePath] = fileEntry;
          // Convert relative path to absolute path
          const absolutePath = join(__dirname, relativePath.replace("./", ""));

          // Read the file content
          const fileContent = readFileSync(absolutePath, "utf-8");

          // Remove frontmatter (everything between --- markers)
          const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
          const markdownContent = fileContent
            .replace(frontmatterRegex, "")
            .trim();

          if (markdownContent) {
            // Convert markdown to HTML
            const html = await marked.parse(markdownContent);
            // Sanitize HTML for RSS feed
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
              ],
              allowedAttributes: {
                a: ["href", "title"],
                img: ["src", "alt", "title", "width", "height"],
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
        pubDate: new Date(post.frontmatter.pubDate),
        link:
          post.url ||
          `/blog/${post.frontmatter.title.toLowerCase().replace(/\s+/g, "-")}/`,
        author: post.frontmatter.author || "Andrew Friday",
        content: content,
        ...(fullImageUrl &&
          imageType && {
            customData: `<enclosure url="${fullImageUrl}" type="${imageType}" />`,
          }),
      };
    })
  );

  return rss({
    title: "Andrew Friday - Blog",
    description:
      "Blog posts by Andrew Friday.",
    site: context.site ? String(context.site) : "https://fridayyy.dev",
    items: items,
    customData: `<language>en-us</language>`,
  });
};
