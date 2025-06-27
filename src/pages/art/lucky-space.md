---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/luckyspace_thumbnail.jpg
title: "Lucky Space"
categories: [3D, direction]
---

![Lucky Space Banner](/gallery/luckyspace_banner.png)

# Lucky Space

Lucky Space was A Bit Lucky's second facebook social-game. In the game you create a mining colony by harvesting and refining minerals.

As the lead artist on the project, I defined the look and feel of the game, developed our asset pipeline, developed shaders and art tools, contributed 3D Modeling, animation, UI design, and HTML prototyping.

## Asset Viewer

I put together a viewer tool that allows you to browse many of Lucky Space's building assets and animations. It also properly renders glows in the same way we did it in-game.

https://lucky-space.netlify.app/

## Screenshots

Below is a screenshot of the early game. Players are greeted with a mostly unexplored terrain where you begin to build your mining colony.

![Beginning Screenshot](/gallery/luckyspace0.png)

As you grow your colony, your map expands to be a beautiful mess of glowing machinery and conduits.

![Advanced Screenshot](/gallery/luckyspace1.png)

## Rendering

Unlike our previous game, Lucky Train, which was entirely pixel art, Lucky Space needed to be 3D rendered due to the sheer quantity of large animations we'd need. We wanted a rendering style that would be consistent with our previous title, while still giving us the advantages of 3D.

### Mimicking Pixel Art

This was achieved primarily in parts: a very simple texturing leveraging flat colors and bold linework, and a 3ds Max material setup which would add 1-pixel outlines to the final render.

![Advanced Screenshot](/gallery/luckyspace_pixelart.jpg)

The style allowed the models to be very simple and fast to produce, while still yielding great results. Most people at the time just assumed it was pixel art like our last title.

### Glows

Every building in Lucky Space pulses a vibrant glow to indicate it's producing resources. We wanted the glows to be more than just an indicator, but also bring a Vegas-like excitement to the screen as you build your colony.

To achieve this we developed a special blend mode which would allow the lights to glow to a hot white, while maintaining their vibrant saturation.

![Advanced Screenshot](/gallery/luckyspace_glow.png)

### Animation

While the game was made in Flash, we didn't leverage the Flash animation tools. Instead we did traditional flipbook animations from our rendered 3D images. Sometimes these sheets got quite large.

![sprite sheet](/gallery/dualcrystiumlaser_2x2_lvl3.png)

To save on memory, I developed a simple animation tool that let us sequence the frames with a live animation preview. This allowed us to greatly reduce the necessary rendered frames as we could reuse frames, add delays, reverse the animation, etc.

![Advanced Screenshot](/gallery/luckyspace_animtool.png)

## Dropship

When you begin the game, an animation is played as your dropship lands on the new planet. This animation was a collaborative effort. Concept by Mark Paulik, Modeling/Rendering/3D animation by myself, and VFX by Beth Rosaschi.

<video preload="metadata" controls loop>
  <source src="/gallery/luckyspace_landing3.mp4" type="video/mp4">
</video>

## Rover

Actions like exploration and building in the game were done with the Rover, which was essentially a physical manifestation of the game's Cursor in a sense. The rover was conceptualized by Mark Paulik, then modeled, textured, rigged, animated and rendered by me.

![Rover Clay Render](/gallery/luckyspace_rover.jpg)

## Damage States

Various hazards in the game, like falling meteors, could damage buildings in your colony. During pre-production we tested several methods for producing damaged states for our buildings. We ended up going pure post-process as that was the easiest to outsource.

![building damage states](/gallery/destructiontests_compare.png)
