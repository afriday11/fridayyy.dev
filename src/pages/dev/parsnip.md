---
layout: ../../layouts/PostLayout.astro
thumbnail: /gallery/parsnip_thumbnail.png
header: /gallery/parsnip_banner.jpg
title: "Parsnip"
description: "Simple yet powerful parser library for creating domain specific languages"
categories: [interpreters, open-source]
# url: https://github.com/DanFessler/parsnip
---

![Parsnip Screenshot](/gallery/parsnip_banner.jpg)

# Parsnip Grammar Interpreter

Parsnip is a recursive-descent grammar interpreter I built out of a growing frustration with traditional parser generators. Most existing solutions force you to write grammars in an obscure DSL, then compile it to JavaScript—making them difficult to introspect, debug, or modify on the fly.

I wanted something different: a JS-first grammar interpreter that reads object-based grammars at runtime and produces a CST (concrete syntax tree). No build steps. No DSLs. Just JavaScript. This allows for better typing, IDE tooling, dynamic grammar authoring, and total runtime flexibility.

- GitHub Repo:
  [https://github.com/danfessler/parsnip](https://github.com/danfessler/parsnip)

## Runtime Grammar Interpretation

At the heart of Parsnip is its ability to parse a grammar definition written entirely in a JavaScript object. Rules can reference each other by name, be composed with `sequence`, `options`, `repeat`, or `optional`, and can define a `parse` method to coerce tokens into desired values.

```ts
const grammar = {
  SCRIPT: { type: "STATEMENT", repeat: true },

  STATEMENT: {
    options: [
      {
        type: "PRINT",
        capture: true,
        sequence: ["print", { type: "STRING" }],
      },
    ],
  },

  STRING: {
    capture: true,
    parse: (token) => token.value.slice(1, -1),
  },
};
```

This grammar can be directly passed to the parser at runtime. There's no compile step. You just pass the grammar to the `Parser` class and start parsing immediately:

```ts
const parser = new Parser(grammar);
const cst = parser.parse('print "hello world"');
```

## Grammar Execution Engine

The parser works recursively and supports nested rule types like sequences, options, and repetitions. Each rule can return a node, or if `capture` is false, be omitted from the tree for abstraction.

Captured nodes form the CST with shape:

```ts
{
  type: string;
  value: string | number | ASTNode | ASTNode[];
  line: number;
  column: number;
}
```

Rules like this:

```ts
{
  type: "ADD",
  capture: true,
  sequence: [
    { type: "NUMBER" }, "+", { type: "NUMBER" }
  ]
}
```

Produce CST nodes like:

```json
{
  "type": "ADD",
  "value": [
    { "type": "NUMBER", "value": 5 },
    "+",
    { "type": "NUMBER", "value": 3 }
  ]
}
```

## End Token Detection

One subtle but important behavior in Parsnip is how it handles `repeat` rules. Since recursive-descent parsers don’t inherently know when to stop consuming repeated elements, Parsnip uses the next sibling token in a `sequence` as a soft end-token.

For example:

```ts
PARAMETERS: {
  sequence: [
    "(",
    {
      type: "IDENTIFIER",
      repeat: true,
    },
    ")",
  ];
}
```

Here, the parser assumes the `")"` is the end-token of the repeated `IDENTIFIER`. Parsnip temporarily attempts to parse the next rule after each iteration—if successful, it knows to stop repeating. This technique works well without requiring explicit end-token declarations.

## Automatic Keyword Extraction

Rather than forcing the developer to manually tell the lexer which strings are keywords, Parsnip automatically walks the grammar object and collects every primitive string found in `sequence` or `options` arrays.

This lets the lexer stay generic and language-agnostic while still being able to tag tokens as `keyword` vs. `identifier`.

```ts
findKeywords(grammar: Grammar): string[] {
  const keywords = new Set<string>();
  function walkRule(rule: Rule | string) {
    if (typeof rule === "string") {
      return keywords.add(rule);
    }
    rule.sequence?.forEach(walkRule);
    rule.options?.forEach(walkRule);
  }
  Object.values(grammar).forEach(walkRule);
  return Array.from(keywords);
}
```

This also reduces coupling between the grammar and tokenizer, allowing runtime-modifiable grammars to function with no extra work.

## Flexible Error Reporting

Because the lexer emits tokens with full source location info (line, column, and index), error reporting is deeply contextual and friendly. When a parsing rule fails, Parsnip reconstructs the relevant lines of code and highlights the problem:

```
ParseError: Expected a string literal at line 1:7

1 | print not_a_string
          ^
```

This system even supports peeking backward to display context from earlier lines, which is invaluable for debugging in educational tools and live editors.

## Furthest Error Tracking

When trying multiple `options`, Parsnip records how far it gets into each path and tracks which failure occurred the furthest into the token stream. This is critical for user-friendly error messages.

If multiple parsing attempts fail, only the one that got the furthest is reported. This reduces noise and avoids overwhelming the developer with multiple shallow parse errors.

```ts
if (furthestErrorCount > 1) {
  throw new ParseError(
    `Expected ${currentType} but got ${furthestError!.token?.value}`,
    furthestError!.token
  );
}
```

Internally, Parsnip even counts how many errors occurred at the same depth to help inform whether the error is truly ambiguous or deterministic.

## Tokenization with Structure and Tolerance

The lexer recognizes common token types such as strings, numbers (including signed), brackets, operators, separators, identifiers, and comments. It preserves whitespace and comments in the token stream, allowing the parser to optionally ignore or retain them depending on configuration.

Whitespace and comments are tagged but skipped during parsing by default—unless you explicitly opt into retaining them with config flags.

```ts
new Parser(grammar, {
  omitIgnoredTokens: false,
  ignoredTokens: ["whitespace", "comment"],
});
```

## Reconstructing Source from CST

A neat trick Parsnip includes is the ability to reconstruct the original source text from any CST node. This is useful for editor integrations, syntax highlighting, or source mapping.

```ts
const parser = new Parser(grammar);
const cst = parser.parse('say "hello"');
parser.reconstruct(cst); // say "hello"
```

This works because each captured CST node contains original text values and token positions, and the parser tracks all consumed tokens—even if they aren't captured.

## Real-World Use: Scratch-like Language

I'm using Parsnip to build a Scratch-like language that compiles to blocks. Here's a sample input program:

```txt
function greet(name) {
  if name then {
    say "hello"
  }
}

call greet("Dan") {
  say "welcome!"
}
```

Parsnip parses this into a CST with full source tracking, ready for AST transformation and further compilation. All of this runs in the browser with no build step and no dependencies.

## Future Plans

- Partial parsing for live syntax highlighting
- Optimized performance for incremental re-parsing
- Richer AST transformation utilities

## Final Thoughts

Most parser libraries feel like they were built for compiler engineers. Parsnip was built for me—a web dev who just wants to make custom languages for creative tools and educational environments. The fact that I can define, test, and tweak a grammar entirely in-browser with zero build tooling makes it feel like magic.

It’s not a parser _generator_. It’s a parser _interpreter_. That distinction matters—and opens the door to truly live and dynamic language tooling.

🌱 **Parsnip** – for when you want to grow your own little language.
