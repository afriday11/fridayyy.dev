---
title: "Pixel Purism: Process vs. Results"
pubDate: 2014-04-09
description: "It's all about the destination, not the journey."
author: "Dan Fessler"
image:
  url: "/blogimages/purism.png"
  alt: ""
tags: ["pixel art", "process", "index painting"]
layout: ../../layouts/BlogLayout.astro
---

When I first began doing pixel art, a sense of pixel purism was engrained in me by the pixel art communities. Rules and conventions were established in the post-pixel era of video games as a means to wrap up, in a neat and tidy package, what the art of our youth was all about. They covered what tools were and were not allowed, how many colors were acceptable, and coined a vocabulary of new terms to describe patterns to follow and avoid. Some even went as far as to say that each pixel needed to be placed individually in order to qualify. Although these rules were being made up organically by kids no different than me, they were treated as law and anyone who dared think otherwise was quickly corrected and indoctrinated.

But the truth is pixel art was never like that in game production. In fact, in many ways, making art for games today is no different at all from what it was like back then; the problems are just different. If you take a peek at the technical details behind the art of any modern game you'll be surprised to find out that it's just a bunch of crazy ideas and hacks stacked on top of each other in order to push the system to do something that was previously never thought of.

The pixel art era was no exception to this mentality. There were no self-imposed rules against transparency, high color-counts, or what tools you used. Those were the rules given to you by the platform, and your job was to attempt to **break** them in any way possible and push the limits. The inescapable truth is most pixel art games of our youth, if they were able, used what would be declared today as _"Dirty Tools"_ or _"Non-Pixel Art (NPA)"_ practices.

> _"Unlike the famous adage, when it comes to pixel art it's the destination, not the journey."_

When I got my first job at Gameloft in 2008, my mentality towards pixel purism shifted drastically. No longer was it about _how_ you get it done, but rather _how fast_. I began doing things I was told were unquestionably wrong like color reducing and layered blend modes.

This isn't to say the things I learned as a pixel purist weren't useful — they were! They resulted in high quality art with attention for every pixel, and for that I am thankful. But I feel it was taught to me backwards. It became clear to me that there were two distinct types of purism: **process purism** and **results purism**, the former being completely useless and toxic.

Why take an hour to do something in a tedious way when you can get the same results another way in half the time? Unlike the famous adage, when it comes to pixel art it's the destination, not the journey.

So let's talk about the various methods of creating pixel art. They can be summed up in three major categories:

## Manual

![Isocity House](https://www.pixeljoint.com/files/icons/full/cityhouse001.gif)  
_"Isocity House" by Kenneth Fejer_ — [Source](https://www.pixeljoint.com/pixelart/32336.htm)

This is the most common method for indie developers these days. Anyone who grew up with MS Paint on their computer has had a taste for this due to the program's inherent limitations.

Simply put, in this method each color is placed by hand. I say "color" and not "pixel" because tools like the paint bucket, line tool, and large brushes are generally accepted as pure. So long as you're laying down each specific color by hand, with attention to proper pixel technique and color conservation, then you are creating pixel art in this method — the "purist" method.

## Color Reduction / Cleanup

![Grishkin](https://i.imgur.com/4Rvh8uU.gif)  
_"Grishkin" by Cure_ — [Source](https://www.pixeljoint.com/pixelart/78883.htm)

This method involves painting with dirty tools to solidify the overall composition fast, then color reducing (or "indexing") the image to a more manageable palette.

When you do this, the image will look like a mess in terms of pixel art standards. Jagged aliased edges and stray pixels will be strewn across the canvas, but the composition is still intact. From there it's back to manual pixel-pushing as you clean up the image and refine it on a per-pixel level.

## Index Painting

![Atomic Ride](https://danfessler.com/blogimages/acryl-atomic_ride.png)  
_"Atomic Ride" by Acryl_ — [Source](https://gfxzone.planet-d.net/theme/8_bit/06/acryl-atomic_ride.html)

The most elusive of the methods is Index Painting. The term "index" refers to an image mode where a pixel's color value does not carry any RGB hue information, but instead is an index to a color palette.

Indexing was a major part of early game development and allowed for cool tricks such as palette swapping and FX animation by cycling a pixel through a series of indexes (_color cycling_). As art tools such as Deluxe Paint (Amiga) became more powerful, features allowing for laying down multiple colors at once were made. Things which were previously impossible — like blend modes, procedural dithering, soft-brushes, and gradients — became available to pixel artists.

**Index Painting** refers to the use of these more advanced tools; i.e. painting with multiple indexes. A few modern programs continue to support these features including _ProMotion_ and _GraFX_.

Helm, former moderator at Pixelation, describes the method:

> "Instead of a small controlled palette, the artist starts out by making huge 16 or 32 color ramps (you'll notice most index painted work has straight ramps). He then proceeds to draw as if you'd draw in Photoshop, using blend modes, smudges, auto AA-ing and so on. Essentially in Deluxe Paint, Personal Paint, Brilliance (all Amiga stuff) or Gfx2 or Pro Motion for the PC, you can treat an image like you'd do in Photoshop more or less. You don't have to work pixel-specific as most pixel artists do ... Most index painters however at this stage go in on the pixel level and start refining the image. It's essentially closer to what you'd do if you scanned in a watercolor image, color reduced and then zoomed in and dithered around and stuff, sharpening a bit here and there, simplifying here and there than it is to straight-up pixeling.

> So the end result is an image that has the volumetric control offered by dirty tools, but the finish of pixel art. This is index painting."

## Index Painting And Beyond!

It doesn't end there! Building upon the principles we talked about here, in my next post I'll be talking about a new method I've developed for turning Photoshop into the most powerful index painting tool in existence using what I'm calling **HD Index Painting**.

Stay tuned!
