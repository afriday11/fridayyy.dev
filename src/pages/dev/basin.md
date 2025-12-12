---
pubDate: 2025-06-21
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/basin_logo.jpg
header: /gallery/basin_banner.jpg
title: "BASIN"
description: "a lightweight AST interpreter for domain specific languages"
categories: [open-source, interpreters]
# url: https://github.com/DanFessler/basin
---

![Basin Hero Image](/gallery/basin_banner.jpg)

# Basin

A lightweight, generator-powered AST interpreter for JavaScript with a JSON-native syntax.

- GitHub Repo:
  [https://github.com/DanFessler/basin](https://github.com/DanFessler/basin)
- Example Language Implementations:
  [Basic.js](https://github.com/DanFessler/Basic.js), [bason-funky](https://github.com/DanFessler/bason-funky)

## Motivation

While exploring language design and interpreter architecture, I wanted a playground that gave me tight control over execution flow, was safe to run untrusted code, and could be expressed in a format easy to generate and manipulate.

The result was **Basin**. It’s a minimal but flexible interpreter that consumes JSON-encoded abstract syntax trees and executes them via generator functions. This structure makes it ideal for embedding, metaprogramming, or serving as the backend for custom scripting languages.

## JSON as Code

Basin doesn’t parse text. Instead, you write (or generate) programs directly as JSON objects that represent AST nodes.

```json
[
  { "LET": ["greeting", "Hello"] },
  { "PRINT": { "ADD": [{ "greeting": null }, " world!"] } }
]
```

Every expression is either a literal or an object whose key is a command/function name and whose value is its argument(s). If the expression contains a nested script (as in `FOR`, `WHILE`, or `FUNCTION`), it uses a special `"script"` key.

This syntax isn’t meant to be ergonomic for hand-authoring, but it’s perfect for:

- Custom language parsers targeting Basin’s format
- Safely transmitting logic as data
- Programmatically generating or transforming code

## Execution Engine

At its core, Basin is a generator-based interpreter with a stack-based scope model. It supports:

- Proper function scoping and shadowing
- Local variable isolation
- Multidimensional arrays
- Script pausing and time-sliced execution (thanks to `yield`)
- Custom command injection via plugin architecture

Every statement is evaluated in-place with lazy execution. Because it’s built on generators, I can pause execution on any tick—ideal for games, visual scripting, or stepping through code.

```js
*runScript(script) {
  for (let expr of script) {
    yield* this.evaluate(expr);
  }
}
```

Execution can also be throttled per frame using `requestAnimationFrame`, `setTimeout`, or `setImmediate` depending on the environment—keeping the event loop responsive.

## Plugin System

The engine is fully extensible via a plugin pattern. You can register new commands or override existing ones with simple modules. Two such modules included out of the box:

- `core.js`: Variable declarations, control flow, IO, array dimensions, and functions
- `math.js`: Arithmetic, trig, random number generation, and rounding functions

```js
this.import(core, this);
this.import(math, this);
```

Plugin functions receive the interpreter instance (`this`) and can be regular or generator functions, depending on whether they need to `yield`.

## Scoped Stack Model

Basin uses a lexical stack of scope objects to handle variable resolution and shadowing. Every new block pushes a new scope, and function parameters are injected using `LET`. Variable lookup walks backward from the top of the stack:

```js
find(keyword) {
  for (let i = this.Stack.length - 1; i >= 0; i--) {
    if (keyword in this.Stack[i]) return this.Stack[i];
  }
}
```

This makes scoping explicit and predictable, and sets the stage for features like closures and tail call optimization.

## Generator-Driven Flow Control

By using generators throughout, Basin allows fine-grained, non-blocking execution. Every command is a coroutine, giving me control over pacing and responsiveness:

- Step-through animation of logic
- Safe infinite loop handling
- Declarative pausing/resuming via commands

```js
FOR: function* (key, start, end, step, script) {
  this.Stack.push({ [key]: start });
  while (this.find(key)[key] <= end) {
    yield* this.evaluate(script);
    yield* this.update(this.shouldUpdate);
    this.find(key)[key] += step || 1;
  }
}
```

### Declarative Loop Control

`SUSPENDUPDATE` and `RESUMEUPDATE` allow scripts to toggle whether loop iterations should yield. This is handy for initial setup or rendering code, that shouldn’t be interrupted. Once it's done, yielding can be re-enabled.

### Time-Based Yield Safety

Even if updates are suspended, Basin prevents runaway execution. The `update()` method has a 1000ms fallback that forces a yield, guaranteeing the main thread stays responsive:

```js
*update(force) {
  if (force || Date.now() - this.startTime > 1000) {
    this.startTime = Date.now();
    yield;
  }
}
```

This makes Basin safe for untrusted scripts and long-running logic.

## Array Handling

Multidimensional arrays are supported via the `DIM` command, which allocates nested arrays to any depth. Indexing and assignment work recursively:

```json
{ "DIM": ["grid", 10, 10] },
{ "SET": ["grid", 4, 7, 42] }
```

## Control Flow & Functions

Basin supports the usual suspects—`IF`, `WHILE`, `FOR`, `FUNCTION`, `RETURN`. Functions are scoped, non-hoisted, and argument binding is handled via `LET`.

### How Return Values Work

Return values are implemented using structured `throw`s. The `RETURN` command throws an object with a `status` and `result`, which is caught by the function wrapper:

```js
RETURN: function (value) {
  throw { status: "success", result: value };
}
```

```js
obj[key] = function* () {
  try {
    yield* this.evaluate(script, initializer);
  } catch (value) {
    if (value.status === "success") return value.result;
    throw value;
  }
};
```

This approach cleanly short-circuits nested scripts and allows return values to behave predictably.

## Real-World Usage

Basin is especially useful when paired with custom parsers or DSLs. I’ve used it to build:

- A teaching-focused BASIC-like language ([Basic.js](/dev/basicjs))
- A compact functional Lisp dialect ([bason-funky](https://github.com/DanFessler/bason-funky))
- A secure sandbox for transmitting script logic over the network

## Example

```js
let Basin = require("basin-script");

let program = [
  { LET: ["x", 10] },
  { PRINT: { ADD: ["Value: ", { x: null }] } },
];

Basin.run(program);
```

The entire engine is just a few hundred lines, making it easy to inspect, debug, and modify.
