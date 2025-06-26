---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/inciteflow_thumb.png
header: /gallery/incite_scripting_screenshot.jpg
title: "Incite Visual Scripting"
description: "Visual Scripting language used for Incite Worlds agentic UGC platform"
categories: [interpreters, react, prototypes]
---

![Screenshot of the Incite Worlds UGC platform](/gallery/incite_scripting_screenshot.jpg)

# Incite Worlds Visual Scripting

A novel visual scripting system prototyped for our Agentic UGC platform [Incite Worlds](www.InciteWorlds.com)

## Motivation

Our UGC platform inherited a YML-based DSL from a previous project but for our users learning a text-based language was too intimidating. We needed a visual layer which mapped directly to our existing scripting language which would make writing custom logic more accessible and fun.

One goal for this language was to provide a visual experience without requiring the user to manage wires and manually place nodes. This resulted in a novel approach to visual coding that provided a lot of ergonomic benefits.

## Key Features

- **Automatic formatting**  
  unlike other visual coding systems, users don't need to manually manage node placement and wires. Nodes are automatically formatted into a horizontal tree structure, making vertical space for new nodes as more are added
- **Control-flow wires only**  
  We only display the wires for the control flow of the program, greatly reducing the "spaghetti" clutter of other visual languages.
- **Scoped Data Access**  
  instead of manually piping data flow with wires, data is accessed through field dropdowns which are aware of the values provided by nodes within its scope.
- **foldable branches**
  Much like in text-based editors, each branch from a node can be collapsed to even further reduce clutter and increase focus.

## Demo Video

<video preload="metadata" controls>
  <source src="/gallery/incite_scripting_demo.mp4" type="video/mp4">
</video>

## Data Picker

Clicking on input fields would open a data picker which would allow you to select from scoped variables, global game state, or access operators to build expressions

![UI design for the data picker](/gallery/incite_scripting_datapicker.png)

## Scratch Mode

The default layout of the graph is designed to be familiar to those coming from Unreal or Unity, however since the program is a pure tree graph, it allows us to provide other view modes that may be more familiar to users of Scratch or Blockly

<video preload="metadata" autoplay loop>
  <source src="/gallery/incite_scripting_scratch.mp4" type="video/mp4">
</video>
