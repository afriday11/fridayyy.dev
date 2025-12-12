import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

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

  return rss({
    title: "Dan Fessler - Blog",
    description:
      "Artist by Day, Developer by Night - Blog posts about game development, art, and creative technology.",
    site: context.site ? String(context.site) : "https://danfessler.com",
    items: sortedPosts.map((post: any) => {
      const imageUrl = post.frontmatter.image?.url;
      let fullImageUrl: string | undefined;
      let imageType: string | undefined;

      if (imageUrl) {
        // Ensure proper URL construction (handle both absolute and relative paths)
        const siteUrl = context.site
          ? String(context.site)
          : "https://danfessler.com";
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

      return {
        title: post.frontmatter.title,
        description: post.frontmatter.description || "",
        pubDate: new Date(post.frontmatter.pubDate),
        link:
          post.url ||
          `/blog/${post.frontmatter.title.toLowerCase().replace(/\s+/g, "-")}/`,
        author: post.frontmatter.author || "Dan Fessler",
        ...(fullImageUrl &&
          imageType && {
            customData: `<enclosure url="${fullImageUrl}" type="${imageType}" />`,
          }),
      };
    }),
    customData: `<language>en-us</language>`,
  });
};
