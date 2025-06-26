---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/basicjs_logo.jpg
header: /gallery/basicjs_header.jpg
title: "Basic.js"
description: "a BASIC interpreter written in JavaScript, using the BASIN runtime"
categories: [open-source, interpreters]
# url: https://github.com/DanFessler/basic.js
---

![Basic.js Hero](/gallery/basicjs_header.jpg)

# Basic.js

Basic.js is a modernized implementation of the BASIC programming language for JavaScript. It is comprised of three major parts: the lexer, the parser, and the [BASIN runtime](https://github.com/DanFessler/basin) which is its own separate project used in several of my domain-specific languages.

GitHub Repo: https://github.com/DanFessler/basic.js

## Motivation

My first programming language was BASIC which I taught myself through a software released by
Interplay called **Learn to Program Basic** in 1998. My nostalgia for BASIC and interest in
interpreters led me to make my own implementation.

Originally it was intended to be a faithful implementation of Interplay's version, however,
as the project progressed, it turned into my own modern flavor. Notable differences include:

- Assignment via "`:`" Operator
- Functions (with hoisting)
- Language Plugins

## Example program

```python
for i: 1 to 100
  if i % 15 = 0
    print "FizzBuzz"
  elseif i % 5 = 0
    print "Buzz"
  elseif i % 3 = 0
    print "Fizz"
  else
    print i
  endif
next
```

## Usage

Install directly from the GitHub repo:

```
npm i https://github.com/DanFessler/basic.js
```

Then import the package, import any necessary library plugins, and run your program.

```js
import basic from "jsbasic";

basic.import({
  newFunction: () => console.log("this is an example plugin function"),
});

basic.run(`print "Hello World!"`);
```

## Lexer

I wrote a custom Lexer for Basic.js which was very simple, only ~150 lines. At a high level, it follows these steps:

1. Reads through the program character by character, adding to the current token lexeme until it no longer matches a rule or reaches the end of the program
1. Determines the type for the token based on matching its lexeme to a list of keywords, operators, or literals.
1. If there was no matching rule or the type wasn't determined, throw a Syntax Error

## Parser

Rather than using a parser generator or other context-free grammar solution, the parser was also written from scratch for Basic.js. This was an educational project after all.

At its core it's a Recursive Descent Parser, with some notable differences:

- **Two-Tier Parsing**  
  Statements are parsed via Keyword Parsers which are defined in a lookup table making them more modular and easy to extend the language. If no keyword parser is found, then it will try to parse it as an expression
- **Precedence-Based Expressions**  
  Instead of using recursive descent for expressions, I opted for precedence climbing algorithm which is simpler to reason about

## Plugins

Plugins to extend the language with additional libraries can be imported with `basic.import()` which are then accessible to Basic.js through regular function calls. A plugin is provided as a lookup table of named functions.

Below is an example plugin which adds canvas drawing and mouse input functions. This particular example is instantiated from a class as it needs to track internal state.

```js
export default class Plugin {
  constructor(canvasID) {
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");

    this.mouseState = {
      x: 0,
      y: 0,
      button: 0,
    };

    window.onmousemove = (e) => {
      let rect = this.canvas.getBoundingClientRect();
      this.mouseState.x = e.clientX - rect.left;
      this.mouseState.y = e.clientY - rect.top;
    };

    this.canvas.onmousedown = (e) => {
      this.mouseState.button = e.buttons;
    };

    this.canvas.onmouseup = (e) => {
      this.mouseState.button = e.buttons;
    };
  }

  getFunctions() {
    return {
      drawCircle: (x, y, r, color) => {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 360);
        this.ctx.fill();
      },

      fillCanvas: (color) => {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      },

      clearCanvas: () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },

      getMouseX: () => {
        return this.mouseState.x;
      },

      getMouseY: () => {
        return this.mouseState.y;
      },

      getMouseButton: () => {
        return this.mouseState.button;
      },
    };
  }
}
```

## Live Demo

I put together a playground which extends the language with canvas drawing operations and a few other features. The default program draws an animated grid of circles that follows the mouse cursor.

- **Live Demo:** https://basicjs.netlify.app/
- **Playground Repo:** https://github.com/DanFessler/basic-react/

![Basic.js playground screenshot](/gallery/basicjs_playground.png)
