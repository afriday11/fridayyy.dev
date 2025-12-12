---
pubDate: 2025-06-27
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/antiquities_thumb.jpg
header: /gallery/antiquities.jpg
title: "Isometric Antiquities"
categories: [personal, concept, 2D]
---

![Gallery image](/gallery/antiquities.jpg)

# Isometric Antiquities

A fun personal project where I was exploring rendering styles in isometric perspective. The idea was a game where you would explore an egyptian pyramid and collect ancient artifacts to decorate your room with.

## Assets

![Gallery image](/gallery/antiquities_assets.jpg)

## 2.5D Experimentation

I also did a test to see if I could pull of 2.5D rotations with this style. This technique would later be used on my work on Auravale at Incite Interactive.

<video preload="metadata" loop autoplay>
  <source src="/gallery/antiquities_rotate.mp4" type="video/mp4">
</video>

The general idea is you draw the asset for each of the 4 cardinal directions of an isometric view and then projection map that to a crude low-poly mesh that roughly conforms to its shape. Here I can get away with just flipping the same asset because it's symmetric on two axis.

You could then do interpolated rotations by swapping between those assets half-way through a 90 degree turn. With a quick enough lerp, the swap is undetected and pulls off a pretty convincing illusion of being fully 3D.

For more detail on this process see [my 2.5D car tutorial](/art/25d-car-tutorial)
