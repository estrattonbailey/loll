## loll 🤣
A fun little frontend application framework.

## Features:
1. Async routing, useful for data fetching
2. Extendable hyperscript builder
3. Global and/or local state
4. Fast DOM diffing using real DOM nodes
5. Easy server-side rendering

## Usage
The libraries herein can be used individually, or together for a fully fledged front-end application solution.

- [@loll/router](https://github.com/estrattonbailey/loll/tree/master/packages/loll-router) - Library agnostic routing and DOM diffing.
- [@loll/h](https://github.com/estrattonbailey/loll/tree/master/packages/loll-h) - Universal component microlibrary.
- [@loll/state](https://github.com/estrattonbailey/loll/tree/master/packages/loll-state) - Library agnostic state managmeent.
- [@loll/component](https://github.com/estrattonbailey/loll/tree/master/packages/loll-component) - Stateful component microlibrary.

## Why?
Some of the existing solutions are either too simple for the Real World™, or have somewhat cumbersome APIs. I set out to create my ideal API, and here it is.

Essentially, I was lucky enough to find myself with some free time and thought it might be fun :)

## What about Choo?
[Choo](https://github.com/choojs/choo) is amazing, use that if you want. We're using a few Choo libraries in loll, in fact.

## License
Everything is **MIT**, with the exception of *all dependendecies which are subject to their own licences*. Find the dependencies for each library in their respective folders.
