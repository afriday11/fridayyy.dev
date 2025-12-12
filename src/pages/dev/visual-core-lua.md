---
pubDate: 2025-06-14
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/coreflow_thumb2.png
header: /gallery/coreflow_banner.jpg
title: "Core Visual Scripting"
description: "Prototype for visual scripting on the Core Games platform"
categories: [prototypes, interpreters, react]
---

![](/gallery/coreflow_banner.jpg)

# Core Flow

A visual programming environment prototyped at Manticore for the CoreGames.com UGC platform

- **Live Demo:** https://coreflow.netlify.app/

## Motivation

While developing Core, we often debated about the target "creator" and how accessible our creation tools should be.
I had long advocated for visual programming as it's less intimidating for beginners, but the decision was made to use Lua as it would be far easier, faster, and cheaper to integrate.

Not to be deterred, during one of our internal game-jams where we'd test our UGC platform by making new games, I decided to take up the challenge to create a working prototype which compiles to lua, then create a simple game with it.

## Key features

- Load/Save with serializable graph
- Playful physics animations for node wires
- Compiles to Lua and Core's standard library

## Wire physics

I wanted the environment to not merely be visual, but also fun. Much of the complexity of the project came from applying physics to the wires in a way which didn't trigger re-renders in react and slow down the experience. Some would say this was all unnecessary, but it was a great excuse to understand how to break out of React when you need to do atypical things.

This was accomplished by applying spring physics to the control points of a cubic Bézier svg path. The video below shows a debug view which draws the control points to visualize this.

<video preload="metadata" autoplay loop>
  <source src="/gallery/coreflow_bouncy_wires.mp4" type="video/mp4">
</video>

## Node Types

Node types were defined in a lookup table which makes adding new nodes very fast. Each type defines the node's inputs, outputs, and a function to compile the node to Lua

```js
const types = {
  print: new NodeType({
    name: "Print",
    width: 128,
    in: [null],
    out: [null],
    params: [{ name: "String", type: "string", input: true }],
    compile: function(node, index, program) {
      return `
        function ${compileName(node, index)}()
        print_to_screen(${compileInput(node, 0, program)})
        ${compileOut(node, 0, program)}
        end
      `;
    }
  }),
  ...
}
```
