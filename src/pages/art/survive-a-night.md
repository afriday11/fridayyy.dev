---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/vampire_thumbnail.jpg
title: "Survive a Night With a Vampire"
categories: [direction, 3D, concept]
priority: 100
---

![Gallery image](/splash/vampire_screen_3.jpg)

# Survive a Night With a Vampire

Survive a Night With a Vampire is an interactive narrative scenario made for our Agentic UGC platform, **Incite Worlds**. You begin the game having been lured into the bedroom of a beautiful girl only for her to reveal she's a vampire. You must now find clues and talk your way out from being killed before her bloodlust is too much to hold her back.

The scenario was built as a demonstration and power of our "Agentic" UGC platform and a proof of concept for our novel 2.5D art style we'd continue to use for our projects

## Concept

<!-- The project began with the characters as I explored what "tone" the game would have - from goofy to sexy. Eventually we landed somewhere in-between with a cute vibe, with a bit of an edge

![Gallery image](/gallery/vampire_character_concepts.jpg) -->

The initial concept was illustrated in Photoshop with a playful style which would serve as our target for character proportions, environment design, palette / composition, and general look and feel of the game.

![Gallery image](/gallery/vampire_concept.jpg)

## 2.5D Pipeline

I wanted to bring more depth to the otherwise flat illustration style. I played around with the idea of projection-mapping 2D illustrations to crude 3D geometry in the past and figured this would be a perfect opportunity to try it out in production. I created this 2.5D "test bed" and posted it to twitter and was surprised with the overwhelming positive reception it recieved. We knew we were onto something.

<blockquote class="twitter-tweet" data-dnt="true" align="center"><p lang="en" dir="ltr">finished 3D-ifying the bed.<br><br>I guess you could call this a test bed *bdumm tshh* <a href="https://t.co/7bJLFSvsXG">pic.twitter.com/7bJLFSvsXG</a></p>&mdash; Dan Fessler (@DanFessler) <a href="https://twitter.com/DanFessler/status/1709291042703634700?ref_src=twsrc%5Etfw">October 3, 2023</a></blockquote>

The process required a few more steps than a typical 2D asset would require, but ultimately it was still far faster that making a traditional 3D asset with the benefit of also having a distinct and unique aesthetic not seen in many games.

I would sketch the rough idea, then clean up the linework, at which point I could determine which pieces to separate out to support the layering that the projection-mapping process needed. I would then build my geometry directly on top of this texture with a game-perspective-aligned camera, which is a very backwards way of working, but it worked.

![Gallery image](/gallery/vampire_artguide.jpg)

## Custom shaders

Back in unity I wrote custom shaders in shader graph to give the assets a customizable vertical gradient for extra depth, and make VFX elements like the volumetric light shafts coming from the window

<video controls preload="metadata" loop>
  <source src="/gallery/vampire_volumetric_shader.mp4" type="video/mp4">
</video>

## Fully Assembled

From both an art and game design perspective, we wanted the room to tell a story about who the vampire character is. The gameplay involved clicking on props in the room to ask her about them in hopes of learning enough about her to leverage that information in your escape. Every prop has a specific connection to her character for you to discover - both visually, as well as through interacting with the vampire.

Props were illustrated by myself in collaboration with [Nyksar K](https://www.niksarkart.com/), with all 3D and Unity integration work done by me.

<video preload="metadata" controls loop muted>
  <source src="/gallery/spooky_vampire.mp4" type="video/mp4">
</video>

## Characters

We also explored making the characters in the same 2.5D pipeline, and while we were able to make it work, we ultimately we decided to go with a traditional 3D pipeline due to the complications and implications it would have on animation.

![Gallery image](/gallery/vampire_girl.gif)

The final 3D character still used the illustrative style, but in a more traditional way in the texture map. The characters were modeled by myself in collaboration with John Miller and animated by Russ Cahalan.

<video controls preload="metadata" loop>
  <source src="/gallery/vampire_gameplay.mp4" type="video/mp4">
</video>

## Game Trailer

We put together this trailer which shows how everything came together in the end. It was great seeing real players interact with the game in this new medium

<iframe style="width:100%; aspect-ratio:16/9" src="https://www.youtube.com/embed/4ReH8W4PnHk?si=eVBIL9ml1F-GcN4A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
