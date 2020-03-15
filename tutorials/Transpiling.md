When writing your code you should use native EcmaScript modules.

At time of writing this, ESM is enabled by default and ready to use in current Node.js and all major browsers. It is
still experimental, but nothing important will change. See more [here][1].

Before publishing your package your code will be transpiled into CommonJS with highest possible compatibility. Take a
look [here][2] to learn about creating hybrid packages, please focus on bare imports for both ESM and CommonJS. Using
deep imports for one are troublesome sooner or later!

## tl;dr

1. Your code will work perfectly as native ESM for Node.js >13.2, CommonJS and should work with bundlers.
 1. Keep in mind that bundlers may behave differently than defined standards.
1. Usage with experimental ESM for Node.js < 13.2 may not always work, especially with named exports. I hope you know that
enabling experimental stuff may cause things not to work :)

## CommonJS vs EcmaScript Modules

### Default export

CommonJS doesn't have a concept of *default export*. Some libraries may require you to use code like:
```javascript
const MyComponent = require("super-library").default;
```

But that's usually just a side-effect of bundling/transpiling ESM (or ESM-like) code I try to fight with
`js-library-template`.

With `js-library-template` transpiled code you just do:
```javascript
const MyComponent = require("super-library");
```

Simple and clean.

## Just named exports

With ESM you can export few things without default export at all. Some people [always do that][3].
The CJS code is very similar to ESM:
```javascript
const { MyComponent, util } = require("super-library");
```

Simple and clean too, but there is a catch: In ESM trying to import default export will result in an error ... or not...
with some bundlers. But with CommonJS you will always actually get a result - an object with the named exports as
properties.

Why the difference?

You cannot just do this in CommonJS:
```javascript
module.exports = null; // no "default-like" export
module.exports.util = function() {}; // cannot add property into null
```

Skipping the first line is fine, but your "default" export in CommonJS will be just an object. This is how most
bundlers is trying to interpret the ESM code without native support, that's why there is difference.

And this is also how Node.JS works when importing CJS into native ESM.

So I recommend always using `{ name1, name2 }` approach with both ESM and CommonJS;

### Default and named exports

Additionally, with ESM you can export both default export and named exports:
```javascript
class MyComponent {}
const util = function() {};

export default MyComponent;
export { util };
```

It's all nice and clear with ESM, but makes things bad for CommonJS.

Because I try to avoid use of `default` in transpiled code you don't have to use this ugly approach you can usually find
in libraries transpiled from ESM:
```javascript
const MyComponent = require("super-library").default;
const util = require("super-library").util;

// or

const { default: MyComponent, util } = require("super-library");
```

You can do that instead:
```javascript
import MyComponent, { util } from "super-library";
// or
const MyComponent = require("super-library");
const { util } = require("super-library");
```

But this is also valid:

```javascript
const MyComponent = require("super-library");
const util = MyComponent.util;
```

This is a bit more clear but comes with a catch.

> Because lack of idea or default/named exports in CommonJS all named exports are "attached" into default export. If
> there is no default export then empty object becomes the default export and there is no trouble.
>
> But this may cause troubles if you try to do default export of a class with static field named the same as some named
> export, because in transpiled code that static field will be overwritten.
>
> It's the same as doing this in bare CommonJS:
>
> ```javascript
> class MyClass {
>     static util() {}
> }
> const util = function() {};
>
> module.exports = MyClass;
> module.exports.util = util; // it's the same as MyClass.util = util, so it's overwriting the MyClass class
> ```

So until you know it's safe - just **don't do that**. If you really want this approach - just explicitly attach your
extra values into your default export and export just the default:

```javascript
class MyClass {}
MyClass.util = function() {};
export default MyClass;
```

## Summary

To sum it up:
1) just default export is fine
2) just named exports are fine, just don't try to "import" the default, even if your bundler/CommonJS code allows that
3) avoid exporting both default and named exports, if you don't want to use just named export then explicitly attach
your extra values as a property to the default export

[1]: https://github.com/nodejs/modules/blob/master/doc/archive/plan-for-new-modules-implementation.md
[2]: https://2ality.com/2019/10/hybrid-npm-packages.html
[3]: https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
