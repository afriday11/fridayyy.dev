// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

const isDev = process.env.NODE_ENV !== "production";

// https://astro.build/config
export default defineConfig({
  site: isDev ? "http://localhost:4321" : "https://danfessler.com",
  integrations: [react(), mdx(), sitemap()],
});
