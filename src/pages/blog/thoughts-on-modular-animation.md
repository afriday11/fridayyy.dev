---
title: "Thoughts on Modular Animation"
pubDate: 2014-02-19
description: ""
author: "Dan Fessler"
image:
  url: "/blogimages/Rayman-Origins-Wii.jpg"
  alt: "The Astro logo on a dark background with a pink glow."
tags: ["pixel art", "game dev", "tools"]
layout: ../../layouts/BlogLayout.astro
---

Recently there's been a surge in interest for what I call **"modular animation tools"** in 2D game development. That is, tools that enable you to animate sprites composed of many pieces by transforming, rotating, and translating those pieces on a timeline; also known as puppet or bone animation.

With games like _Rayman Origins_ and _Dragon's Crown_ popularizing the technique, and successful Kickstarters such as [Spriter](http://www.brashmonkey.com/) and [Spine](http://esotericsoftware.com/), game developers are scrambling to get their hands on tools that enable them to accomplish similar results. I thought I'd take some time to write about the history of these tools and my experiences with them.

<div style="text-align:center;">
  <iframe width="100%" height="360" src="https://www.youtube.com/embed/rklAx3YoI80" frameborder="0" allowfullscreen></iframe>
  <br><strong>Metal Slug Boss Fights</strong>
</div>

Interestingly, this technique is nothing new to gaming and is about as old as sprites themselves—gorgeously exemplified in 16-bit boss fights such as in the _Metal Slug_ series. It mostly derived from necessity due to system limitations (sprite size restrictions, memory limits, etc.), but became a valuable tool for those who could harness it creatively. Sadly, as games shifted more toward 3D, these techniques were largely forgotten—until recently.

My personal experience with these tools was fairly recent in terms of video game history, when I joined Gameloft in 2008 near the tail end of the pre-iPhone era of mobile gaming. It was an interesting time to be a game artist. Although I had missed the golden age of pixel art (I was still a kid when the Super Nintendo came out), mobile platforms were still graphically stuck in the '80s, yet accelerating fast. I felt like a time traveler moving in fast-forward through my career, catching up on 20 years of game dev in just 7.

During my time at Gameloft, we used proprietary tools that gave us rudimentary ability to animate modular sprites on a timeline. It wasn't anything fancy—no tweens, rotations, hierarchy, or bones—just pure X/Y translation per frame. But it was truly a godsend. We used it for characters, environment pieces, effects... literally _everything_.

<div style="text-align:center;">
  <iframe width="100%" height="360" src="https://www.youtube.com/embed/n_PCP8-yso4" frameborder="0" allowfullscreen></iframe>
  <br><strong>New York Nights 2 using modular animation technology</strong>
</div>

Although I don’t have evidence or examples, I’m certain tools like this have existed in various forms for quite a while. (If you have historical knowledge of these tools, I’d love to talk—shoot me an email!) Based on the complexity of animations in old-school games, I can only conclude studios developed their own internal tools like Gameloft did. There were certainly no commercial solutions capable of what they accomplished.

The impression I got was that these tools were passed around like secret knowledge between companies as developers moved from studio to studio, often treated as proprietary advantages. This was reinforced when I joined Glu Mobile in 2009 and discovered they had recently developed their own version of the tool. And it definitely was an advantage—development time estimates were cut roughly in half. That meant faster turnarounds and projects of greater scope.

But more important than cost or memory savings, in my opinion, is the **creative freedom**. Without these tools, artists and engineers have to work closely together to pull off any flourishes that don’t fit into traditional flipbook sprite sheets—costly in both time and resources. If you wanted a tweened motion for menu buttons or specific explosion behavior, you’d have to explain it to an engineer... and hope it translated well. Usually, it didn’t.

But with proper tools, it decouples the creative from the technical—artists can create within constraints without being blocked by engineering. You just author it how you want it. That’s the real beauty. I’ve seen incredible things done with these tools that would never have been possible through traditional collaboration alone.

![Muramasa vs Street Fighter](http://danfessler.com/blogimages/muramasa_vs_streetfighter.png)  
_Modular sprite sheet from Muramasa vs. flipbook sprite sheet from Street Fighter_

There are other inherent benefits too: hitbox authoring per frame, sprite swapping (e.g., different heads, clothes, weapons), scripting events, and more. This is the primary area where modern versions of these tools innovate—introducing bones, mesh deformation, and other advanced features.

It was at Glu Mobile that I met Michael Parent of _Spriter_. We talked at length about these tools and even began planning to build a commercial version. Unlike in 3D gaming, where formats and toolsets had standardized, 2D tools were still proprietary. No one had access to these amazing systems—and we figured the indie scene would embrace them.

Flash was the closest thing, but it lived in a walled garden. It was great for web games, but clunky and not made for general-purpose game development. Unfortunately, Michael moved to France and I got busy with work. He continued the project without me, and I later became an investor (though not part of the Kickstarter).

![Sprite tool prototype](http://danfessler.com/projects/animedit/images/mock_modanim.png)  
_Early prototype of a sprite tool_

While frame-by-frame animation can _always_ be more visually appealing because it's purely freeform, its practicality in game development is a different story. It requires exponentially more time, memory, RAM, and effort.

The benefits of modular animation tools are mostly **practical**—but also **creative**, especially within the boundaries of a game engine. Depending on your project's complexity, it becomes a no-brainer to use them.

But I’d argue it’s a good idea to use modular animation tools for _everything_—even simple stuff. Why? Because tools like Spriter **don’t limit you**. You can still redraw frame-by-frame if needed. But you also get bonus features like hitbox authoring, scripting, and more.

By adopting the system universally, you gain **choice**. Use it heavily for some assets (like UI transitions or characters), and lightly for others. Either way, having a shared foundation ensures everything plays well together in the end.
