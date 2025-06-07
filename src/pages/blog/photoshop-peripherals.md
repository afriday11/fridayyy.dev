---
title: "Photoshop Peripherals"
pubDate: 2009-04-17
description: ""
author: "Dan Fessler"
image:
  url: "/blogimages/powermateheader.jpg"
  alt: "The Astro logo on a dark background with a pink glow."
tags: ["photoshop", "painting", "hobby"]
layout: ../../layouts/BlogLayout.astro
---

A couple weeks ago, as I was painting in Photoshop, I realized how much time I wasted doing the most mundane of things—specifically, how often I'm fiddling with various brush sliders rather than painting on the canvas. It occurred to me that it would be the most awesome thing ever if someone had made a USB controller specifically with Photoshop in mind—something with physical knobs or sliders that could control brush size, opacity, and hardness on the fly, so one could continually paint with their other hand. I went searching for such a device.

After a few days, it became apparent that no such thing existed. I was pretty shocked. I can’t imagine I’m the only CG artist who’s thought of this before. I guess input-device companies are too busy making the same redundant crap they always have, just with an ever-growing number of LED lights to make us feel more like studly men in a nightclub rather than geeks in our mother's basement.

In any case, I needed an alternate solution.

This time, I searched for **any** piece of hardware that generally resembled what I had in mind, hoping I could Jerry-rig it to Photoshop. I imagined a simple board with maybe four parallel vertical sliders, but the only thing I could find that even came close were MIDI mixing boards. Not only could I not map them to Photoshop shortcut keys, but they were all _way_ too bulky. I swear, there isn’t a single mixing board out there without 50 billion dials, knobs, and sliders. I just wanted something simple.

You’d think there would be a huge market for **general-purpose programmable USB input devices**—programmable in the sense that they could be mapped to keystrokes. Just a simple programmable slider board—or maybe a set of knobs. I know **plenty** of computer professionals who could find a good use for something like this.

If any of you out there are thinking, _“That’s a great idea for a business!”_—**PLEASE DO IT.** For the love of Pete, please do.

I finally found one: [**Griffin’s PowerMate**](http://www.griffintechnology.com/products/powermate) USB knob. It’s not exactly what I was looking for, but it _was_ programmable, and it would work for what I needed. I ordered two, and they just arrived in the mail today :)

Setting it up was a breeze. Their software was surprisingly easy to use. Each knob has **six different functions** you can assign to it:

- Rotate left
- Rotate right
- Press-rotate left
- Press-rotate right
- Press
- Press and hold

Not only can you set different macros for each function, but you can also assign different profiles per app. Very cool.

On the first knob, I mapped **brush size** to the rotation (`[` and `]` shortcuts) and **brush hardness** to the press-rotation (`{` and `}` shortcuts). On the second knob, I mapped **undo** and **redo** to the press-rotation.

Lastly, I wanted the second knob to control **brush opacity**, but Photoshop doesn’t have direct shortcut keys for that. The number keys (`0`–`9`) at the top of the keyboard set opacity (e.g., `4` = 40%, `5` = 50%), but the PowerMate software doesn’t support mapping a rotation to a **set of discrete keypresses**. I needed a third-party solution.

I came across [**AutoHotKey**](http://www.autohotkey.com/), which turned out to be exactly what I needed. AutoHotKey lets you script macro events. So the plan was to use it to detect knob rotations as keypresses and then output the appropriate opacity value to Photoshop.

It took a while, but it worked like a charm. I had to write my own script since none existed. If anyone’s interested, let me know and I’ll post it up.

The last thing I wanted was to map the first knob’s **press** function to the **Alt** key (the shortcut for the eyedropper tool while in brush mode). You’d think this would be easy, but nothing I tried worked. After a bit of investigating, I discovered that **PowerMate’s software only supports quick keypresses**, not press-and-hold, which the eyedropper shortcut requires.

That really upset me—I use the eyedropper tool _a lot_. I’m hoping I can find someone to edit the `.dll` file to fix this problem. In the meantime, I’ve mapped **Alt** to one of the function keys on my tablet.

I’ll keep you posted, but I’ll say this: **I can already see a dramatic increase in my workflow because of these knobs.**
