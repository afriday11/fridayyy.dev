---
title: "My First Blog Post"
pubDate: 2022-07-01
description: "This is the first post of my new Astro blog."
author: "Astro Learner"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "The Astro logo on a dark background with a pink glow."
tags: ["astro", "blogging", "learning in public"]
layout: ../../layouts/Layout.astro
---

# My First Blog Post!

this is a test blog post.

<!-- render the tags -->
<div class="tags">
  {tags.map((tag) => (
    <p class="tag">#{tag}</p>
  ))}
</div>

<style>
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    margin: 1em 0;
  }

  .tag {
    margin: 0;
    padding: 0.3em 0.8em;
    border-radius: 0.5em;
    background-color: #e2e8f0;
    font-size: 0.8em;
  }
</style>
