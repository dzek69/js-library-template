# js-library-template

A template for writing next awesome JavaScript library.

## Features

- documentation generating with `jsdoc` with `docdash` template (may be replaced if something better comes in my way)
- unit tests with `mocha` & `must.js`
- modern environments first approach, with <3% usage transpiled version to be found inside `dist` folder *
- Keep-a-changelog CHANGELOG format as an example of good practice and reminder to write change logs
- Rewire plugin for easy testing with mocks
- Eslint integration with strict rules by default

## Bonus

- hardcore .yarnclean rules to use in your projects - this will be probably moved to separate project
you need to rename the file (remove `.txt` extension) to use it. It is very restrictive and will break almost any
library by default. Use with care.

\* - transpiling kills JS engines optimizations, makes codes longer and tree shaking harder to do and/or slower

## To be done

- `Init` script, that will clear README, update `package.json` name, version, clear the code, examples etc.

## License

MIT
