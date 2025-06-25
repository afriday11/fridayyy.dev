---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/ctx_engine_thumb.png
title: "CTX Game Engine"
description: "Web-first Unity-like game engine with canvas 2D renderer"
categories: [open-source, tools, react, full-stack]
# url: https://github.com/DanFessler/ctx-game
# hidden: true
---

![CTX Game Engine Screenshot](/gallery/ctx_engine_screenshot.png)

# CTX Game Engine

A Unity-like game engine for the browser with a native Canvas2D rendering API

- GitHub Repo:  
  https://github.com/DanFessler/ctx-game

- Live Demo (probably a bit out of date):  
  https://dockable.netlify.app/

## Motivation

JavaScript is the ultimate prototyping language. It's forgiving, malleable, and has good developer ergonomics.
In contrast, Unity is bloated and slow to use in comparison, yet has far superior tooling for making more complex graphical games.

I wanted to merge the best of both and bring the editor experience of Unity to the web, while still maintaining a simple web-first approach to rendering using the native Canvas2D API.

## Clone to own

Rather than distributing the engine as a standalone executable, CTX was designed to be cloned and customized for each project—giving you direct access to engine internals and a smooth developer experience through Vite.

This also provides the benefit that the engine becomes a bespoke tool suite for players to easily create mods and new content for your game.

## Architecture

The project is scaffolded with Vite and is cleanly separated into four major parts:

- **server:**  
  A browser-to-node RPC bridge for handling file I/O and other native operations

- **editor:**  
  This is the React application that instantiates the game engine with the user's project data, and is responsible for managing the user interface for editing a project.

- **engine:**  
  This is the core engine of CTX, which could be used entirely without the editor if desired. It's responsible for rendering and executing behaviors on objects via a behavior component system.

- **game:**  
  This is where the game-specific scene definitions, behaviors, and game assets live, which are automatically imported by the editor

## Editor

Scenes are composable with a simple drag and drop interface. The editor is written in React and uses [React-Dockable](https://github.com/danfessler/react-dockable) for dockable tabbed window management which allows for user-customizable workspaces.

Currently there are four main views: **Scene Hierarchy**, **Object Inspector**, **Game Assets**, and the **Scene View**. Objects can be created, renamed, and customized through the inspector. Gizmos also allow you to manipulate object transforms directly.

<video preload="metadata" autoplay loop muted controls>
  <source src="/gallery/ctx_editor_demovid2.mp4" type="video/mp4">
</video>

## Behavior System

`GameObjects` are nodes with a collection of attached `Behavior` components. Each `Behavior` is responsible for its own update and draw logic. Every `GameObject` is required to have a `Transform` behavior as the engine relies on this to render the scene.

Key Methods:

- **Start()**  
  Used for any initialization logic.

- **Update(deltaTime)**  
  Called on every tick in Play mode. Used for core game logic

- **UpdateEditor(deltaTime):**  
  Called on every tick in Edit mode. Used for edit-time logic such as gizmo behaviors.

- **draw(ctx, renderPass)**  
  Called every tick, after update logic. Can use the renderPass argument to filter drawing operations to specific play modes.

### Inspectors

Since JavaScript doesn't have true reflection, decorators are used to tag a property as serializable which will be saved in the scene file and become automatically editable in the inspector. The `@inspect` decorator also takes an object which contains metadata such as the type, min or max ranges, etc.

Below is an example behavior which draws a rectangle to the screen with a given position, size, and color inspectable fields:

```ts
class Rectangle extends Behavior {
  transform: Transform | undefined;

  @inspect()
  position: Vector2 = new Vector2(0, 0);

  @inspect()
  size: Vector2 = new Vector2(1, 1);

  @inspect({ type: "color" })
  color: string = "red";

  draw(ctx: CanvasRenderingContext2D, renderPass?: string) {
    if (renderPass == "editor") return;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}
```

Serializable field metadata is then stored into a global map where each constructor key contains a map of property/value pairs. If the type was not specified in the metadata, the `reflect-metadata` polyfill is used to infer it.

We then export a `getSerializableFields` function which allows for easy lookup of serializable fields for a given behavior.

```ts
const fieldMetadata = new Map<Function, Map<string, FieldMeta>>();

export function inspect(meta: FieldMeta = {}): PropertyDecorator {
  return (target, propertyKey) => {
    const ctor = target.constructor;

    // add the field if it didn't already exist
    if (!fieldMetadata.has(ctor)) {
      fieldMetadata.set(ctor, new Map());
    }

    const fields = fieldMetadata.get(ctor)!;

    // Try to infer type if none provided
    if (!meta.type) {
      const reflected = Reflect.getMetadata("design:type", target, propertyKey);
      if (reflected) {
        meta.type = reflected.name.toLowerCase(); // e.g. "number", "string"
      }
    }

    fields.set(propertyKey as string, meta);
  };
}

export function getSerializableFields<T>(instance: T): [keyof T, FieldMeta][] {
  const ctor = (instance as Behavior).constructor;
  return [...(fieldMetadata.get(ctor)?.entries() ?? [])] as [
    keyof T,
    FieldMeta
  ][];
}
```

The `Behavior` base class implements an `inspector` method which returns a React component and uses `getSerializableFields` to automatically render any inspectable field for any behavior subclass.

```tsx
// behavior.tsx
inspector = ({ refresh }: { refresh: () => void }) => {
  const fields = getSerializableFields(this);

  const renderFieldType = (key: string, meta: FieldMeta) => {
    switch (meta.type) {
      case "number":
        return <NumberInput ... />;
      case "vector2":
        return <Vector2Input ... />;
      case "color":
        return <ColorInput ... />;
      default:
        return null;
    }
  };

  return (
    <div>
      {fields.map(([key, meta]) => {
        const keyString = String(key);
        return (
          <Fragment key={keyString}>
            {renderFieldType(keyString, meta)}
          </Fragment>
        );
      })}
    </div>
  );
};
```

This method can also be overridden for custom inspectors as well for more complex UI needs.

### Rendering

CTX implements immediate-mode rendering which, as the name suggests, leverages the HTML5 Canvas 2D API. No need for meshes, shaders, texture maps, or other complicated 3D rendering concepts, just draw what you want.

Some key rendering features:

- **PPU scaling**  
  A project-wide unit scaling to allow for base units untied from pixels, like tiles, or meters

- **Local-space Drawing**  
  The engine has a first-class camera system and walks the scene hierarchy to automatically transform the drawing context from local object-space to screenspace.

- **Behavior-based rendering**  
  Each Behavior implements a draw method allowing for immediate-mode drawing that is beginner-friendly using the browser-native Canvas2D API.

- **RenderPass filtering**  
  The draw method provides a "RenderPass" argument which allows for custom render pipelines or conditional drawing for different modes such as editor-mode vs play-mode

## Observer Pattern Reactivity

Usually reactivity in a React application is achieved through immutable state which is passed down through the top of the component tree. While this approach could technically work, it's not well-suited to game engine design patterns. Game objects are inherently "live" objects with custom base classes.

One could, in theory, manually serialize and deserialize the scene on every change, but that'd be clunky and non-performant - especially if you want to inspect state _while in play mode_. Instead I use an Observer pattern to listen for external state changes to trigger a re-render.

![reactivity diagram](/gallery/ctxengine_diagram.png)

The GameObject base class implements `subscribe` and `updateSubscribers`. Any time updateSubscribers is called, any subscriber's callback will be triggered. For the default inspector, this is done automatically for you. If you implement a custom inspector, you must manually call it.

```ts
// GameObject
subscribe = (callback: () => void): (() => void) => {
  this.subscribers.add(callback);
  return () => {
    this.subscribers.delete(callback);
  };
};

updateSubscribers() {
  this.subscribers.forEach((callback) => callback());
}
```

To subscribe to updates, a React component only needs to use the `useGameObject` hook which will automatically trigger a re-render.

```ts
function useGameObject(gameObject: GameObject) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!gameObject) return;
    const unsubscribe = gameObject.subscribe(() => {
      setCount((count) => count + 1);
    });
    return () => unsubscribe();
  }, [gameObject]);

  return count;
}
```

For more granular updates I also provide a `useGameObjectSelector` which allows you to re-render only for specific slices of state you're interested in.

## Scene Serialization

Since we're using non-primitive objects, we need to manually serialize and deserialize the scene for saving, loading, and undo. A scene is simply a gameObject, so we recursively walk the tree started from the root object calling serialize on its respective behaviors and children.

```ts
// GameObject.ts
serialize(): SerializedGameObject {
  return {
    name: this.name,
    id: this.id,
    behaviors: Object.values(this.behaviors).map((behavior) =>
      behavior.serialize()
    ),
    children: this.children.map((child) => child.serialize()),
  };
}

static deserialize(data: SerializedGameObject): GameObject {
  const gameObject = new GameObject({ name: data.name });
  gameObject.id = data.id;
  gameObject.behaviors = data.behaviors.reduce((acc, behavior) => {
    acc[behavior.name] = deserializeBehavior(behavior);
    return acc;
  }, {} as Record<string, Behavior>);

  data.children.forEach((child) => {
    gameObject.addChild(GameObject.deserialize(child));
  });

  return gameObject;

  function deserializeBehavior(data: SerializedBehavior) {
    const behaviorClass = Game.instance?.behaviors[data.name];
    if (!behaviorClass) {
      throw new Error(`Behavior ${data.name} not found`);
    }
    const behavior = new behaviorClass();
    behavior.gameObject = gameObject;
    behavior.init(data.properties);
    return behavior;
  }
}
```

Behaviors leverage the `getSerializableFields` method described earlier to determine which properties of the behavior needs to be saved

```ts
// Behavior.ts
serialize() {
  return {
    name: this.constructor.name,
    id: nanoid(),
    properties: getSerializableFields(this).reduce((acc, [key]) => {
      acc[key as string] = this[key as keyof this];
      return acc;
    }, {} as Record<string, unknown>),
  };
}
```

## Transparent Native RPC Bridge

For saving and loading the scene a server is needed to expose native functionality like file I/O to the browswer. Native functions are lightly-wrapped in a lookup table, only changing signatures where necessary for serialization across the network. The type of this object is then exported so the client can consume it and maintain type-safety.

```ts
const api = {
  saveFile: async (path: string, data: string) => fs.writeFileSync(path, data),
  readFile: async (path: string) => fs.readFileSync(path, "utf-8"),
  ...
};

export type NativeApi = typeof api;
```

The server then exposes an HTTP RPC-style endpoint to call these functions.

```ts
app.post("/call", async (req, res) => {
  const { method, args }: { method: keyof NativeApi; args: unknown[] } =
    req.body;
  try {
    const result = await (api[method] as (...args: unknown[]) => unknown)(
      ...args
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(3001, () =>
  console.log("Native API server running on http://localhost:3001")
);
```

On the client, an abstraction layer is leveraged to make interfacing with the RPC endpoint type-safe and "transparent." This uses Proxies to allow for a native-feeling API with direct function calling in the browser:

```ts
import type { NativeApi } from "../../server/server.ts";

const native = new Proxy({} as NativeApi, {
  get:
    (_, method: string) =>
    (...args: unknown[]) =>
      fetch("http://localhost:3001/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, args }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.error) throw new Error(res.error);
          return res.result;
        }),
});

export default native;
```

```ts
native.saveFile(
  "src/game/scenes/default.json",
  JSON.stringify(serialized, null, 2)
);
```
