---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/index_painter_thumb.jpg
header: /gallery/indexpainter_screenshot.png
title: "Index Painter"
description: "Pixel art editor implementing HD Index Painting in React"
categories: [tools, react, full-stack]
priority: 80
---

![Index Painter Screenshot](/gallery/indexpainter_screenshot.png)

# Index Painter

An implementation of [HD Index Painting](/blog/hd-index-painting-in-photoshop) as a standalone desktop application.

Index Painter allows pixel artists to use familiar photoshop-like tools such as soft brushes, opacity, and other "dirty" pixel art tools which is dynamically indexed to a limited color palette non-destructively.

You can play with a live demo at the link below. The application is still a work in progress and in development.

**Live demo:** [index-painter-2.netlify.app](https://index-painter-2.netlify.app/)

## User Interface

The interface was designed to be familiar to Photoshop users with a similar GUI and tools and was the impetus for creating [React-Dockable](https://github.com/DanFessler/react-dockable) for its dockable window GUI system which was later extracted as its own open-source project.

## Drawing

The brush tool is extremely flexible allowing for both pixel-perfect drawing as well as familiar photoshop-like brush settings for opacity, hardness, and spacing. Drawing leverages the pointer API to allow pressure sensitivity.

For smooth stroke interpolation, I constructed a Catmull-Rom spline from the mouse position history and sampled along it when stamping brushes. One challenge with splines is there's no direct way to sample them with absolute distances, which was necessary for brush spacing to be consistent with pressure-dynamic brush sizes.

![Pressure-aware stroke brush spacing](/gallery/indexpainter_stroke_compare.jpg)

Above shows the result of a brush stroke in Index Painter vs Photoshop with 100% brush spacing. Note how Photoshop stamps overlap with rising pressure and produces gaps with decreasing pressure.

To overcome this, I discretize the spline into a regular line segments so I can sample it with absolute distances. But that's not enough to solve the problem. Naively using the current stamp radius as the next step size produces the errors seen in Adobe's implementation, so I needed some trig to determine what the next step distance should be given the starting and ending radius of the current stroke.

Below are some of my trig notes to solve the brush stroke problem, which I thought looked beautiful in hindsight.

![Pressure-aware stroke brush spacing](/gallery/indexpainter_stroke_math.jpg)

## Canvas Rendering

Index Painter leverages Three.js for accelerated canvas rendering. For a typical pixel art application this would be overkill, but since we're allowing for large brushes which apply a wide range of values simultaneously to the canvas, in addition to the fact that **HD Index Painting** requires we quantize the canvas into a limited color palette every frame, I needed the extra peformance of WebGL.

#### Brush Stamp Fragment Shader

For brush stamping I wrote a fragment shader which made even extremely large brush stamping essentially free as the GPU is heavily underutilized compared to the CPU.

```hlsl
void main() {
  highp vec3 newUv = vUv - 0.5; // center the uv

  // determine the distance from the center of the brush to generate a soft edge
  highp float a = 1.0 - sqrt( (newUv.x*newUv.x) + (newUv.y*newUv.y) )*2.0;

  // We use smoothstep to generate a soft brush radius modulated by the hardness
  a = smoothstep(hardness/2.0,(1.0-hardness)/2.0 + 0.5,a) * alpha;

  // We then use it as the alpha of the color to stamp to the buffer
  gl_FragColor = vec4(color.x, color.x, color.x, a);
}
```

#### Indexing Fragment Shader

For indexing the canvas, another fragment shader samples the canvas value and mixes it with a [bayer matrix](https://en.wikipedia.org/wiki/Ordered_dithering#Threshold_map) (or any other dither pattern) before using that as a value to sample from a generated palette texture. This allows for not only quantizing the canvas, but also dithering it dynamically.

```hlsl
void main() {
  float inputValue =  texture2D(map, vUv.xy).x; // canvas value

  // dither value supplied as a texture so we can support user-defined dither patterns
  float ditherValue = texture2D(indexMatrix4x4, vUv.xy * (canvasSize/4.0) ).x;

  // Mix the input value with the dither value proportional to the palette size
  // to ensure dithering is consistent across different palette sizes
  float mixedValue = mix(inputValue, ditherValue, 1.0/(paletteSize+1.0));

  // 0.5 is for sampling the center of the pixel in the palette
  gl_FragColor = texture2D(palette, vec2(mixedValue + (0.5/256.0), 0.5));
}
```

## State model

Index Painter uses a redux-like Reducer pattern for state updates. I never really felt the need to reach for an third party state management library, so I rolled my own.

App state is composed of several reducer slices:

- **Tools**: for tracking the state of the app's tools like brush settings, active tool, etc
- **Documents**: for the state of each open document including the canvas itself
- **Workspace**: for the state of the layout of the windowing system
- **widgets**: for the state of each window panel (mostly to hide/show)

For convenience I have a createReducer function which creates a reducer from on object of handlers and uses [immer](https://immerjs.github.io/immer/) to allow me to update the state more naturally while still keeping it immutable. No need to recreate objects from scratch.

```js
import produce from "immer";

function createReducer(initialState, handlers, enforceShape = false) {
  return function reducer(state = initialState, action, ...rest) {
    return produce(state, (draft) => {
      if (action && handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state, action, ...rest);
      }
    });
  };
}
```

### Undo system

Often you'll find that some parts of your app state needs undo history while other parts dont. Luckily reducers are highly composable and allowing for creating higher-order-functions which can extend reducers with new state and behavior.

`undoableReducer` extends any state slice with a history and actions to navigate that history including undo, redo, and manually saving snapshots (which is another photoshop-inspired feature).

Unlike other undo reducer implementations I've seen, this doesn't change how the state is read, allowing you to wrap any part of your state with undoable functionality without needing to update any other code.

```js
import { undoableReducer } from "./utility/undoable.js";
import createReducer from "./utility/createReducer.js";

const persistent = createReducer(
  {
    canvas: undefined,
    selectedColor: 0,
    palette: [
      [0, 0, 0],
      [255, 255, 255],
    ],
    count: 1,
  },
  {
    SET_SELECTED_COLOR: (state, action) => {
      state.selectedColor = action.value;
    },
    SET_PALETTE: (state, action) => {
      state.palette = action.value;
    },
    TOGGLE_INDEX: (state, action) => {
      state.canvas.drawIndexed = action.value;
      state.canvas.draw();
    },
  }
);

const undoable = undoableReducer(
  {
    layerData: null,
  },
  {
    BRUSH: {
      name: "Brush Stroke",
      icon: "BrushIcon",
      reducer: (state, action) => {
        state.layerData = action.value;
      },
    },
  },
  25
);

export default (state, action, ...rest) => ({
  ...persistent(state, action, ...rest),
  ...undoable(state, action, ...rest),
});
```

This code shows how I'm combining both persistent state with undoable state into a sincle slice for the canvas state. Brush drawing operations are undoable while setting the palette and selected color I decided shouldn't be.

### Bitmap state

Storing the entire canvas for every history state is very memory intensive. To solve this, I implemented a dirty-tile system. The canvas data is divided into tile chunks. for every canvas operation, i make a shallow-copy of the currect canvas state which maintains its references to the previous tile data chunks. I track only the affected "dirty" tiles and replace them with new data _by value_, breaking the reference to older data for those specific tiles.

This elegantly allows me to jump through history states as though it were a complete snapshot, while not blowing up the memory consumption of the app
