// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const isDev = process.env.NODE_ENV !== "production";

// https://astro.build/config
export default defineConfig({
  site: isDev ? "http://localhost:4321" : "https://dan.fessler.me",
  integrations: [react()],
});
