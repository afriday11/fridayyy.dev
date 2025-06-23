---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/ctx_engine_thumb.png
title: "CTX Game Engine"
description: "Web-first Unity-like game engine with canvas 2D renderer"
categories: [open-source, tools, react, full-stack]
# url: https://github.com/DanFessler/ctx-game
# hidden: true
---

# CTX Game Engine

A unity-like game engine for the browser with a native Canvas2D rendering API

- Github Repo:  
  https://github.com/DanFessler/ctx-game

- Live Demo (probably a bit out of date):  
  https://dockable.netlify.app/

## Motivation

JavaScript is the ultimate prototyping language. It's forgiving, malleable and has good developer ergonomics.
In contrast Unity is bloated and slow to use in comparison, yet has far superior tooling for making more complex graphical games.

I wanted to merge the best of both and bring the editor experience of Unity to the web, while still maintaining a simple web-first approach to rendering using the native canvas2D API.

## Key Features

- **Canvas2d Rendering**  
  leverages the browser's native Canvas2D rendering API.

- **Camera System**  
  First-class camera system with automatic Hierarchical Transforms via the scene graph

- **Behavior Component System**  
  Unity-like component system for composable game object behaviors

- **Automatic Inspectors**  
  Automatically inspect and serialize behavior fields with type-safe reflection using javascript Decorators

- **Custom Inspectors**  
  Supports custom inspectors via React components returned by a behavior

- **Customizable Interface**  
  dockable windowing GUI via React-Dockable

## Clone to own

Rather than distributing the engine as a standalone executable, CTX was designed to be cloned and customized for each project—giving you direct access to engine internals and a smooth developer experience through Vite.

This also provides the benefit that the engine becomes a bespoke tool suite for players to easily create mods and new content for your game.

## Architecture

The project is scaffolded with Vite and is cleanly separated into three major parts:

- **editor:**  
  This is the React application that instantiates the game engine with the user's project data, handles native file I/O, and is responsible for managing the user interface for editing a project.

- **engine:**  
  This is the core engine of CTX, which could be used entirely without the editor if desired. It's responsible for rendering and executing behaviors on objects via a behavior component system.

- **game:**  
  This is where the game-specific scene definitions, behaviors, and game assets live, which are automatically imported by the editor

#### deep dive points

- Observer pattern for UI reactivity
- Native bridge for file I/O
- Scene serialization
- Scene Rendering
- Behavior System
- Inspectors
- Object Gizmos
