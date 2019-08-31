# js-library-template

A template for writing next awesome JavaScript library.

## Features

- documentation generating with `jsdoc` with `docdash` template
- unit tests with `mocha` & `must.js`
- modern environments first approach, with >3% usage transpiled version to be found inside `dist` folder *
- Keep-a-changelog CHANGELOG format as an example of good practice and reminder to write change logs
- Rewire plugin for easy testing with mocks
- Eslint integration with strict rules by default
- Git hooks already applied so you don't forget about them
- cli tool to init new library and to automatically upgrade it to if newer version of js-library-template is released

## Usage

The best way is to install this lib globally and just run:

`jslib` - to init empty library at current working directory
`jslib path_to_directory` - to init empty library at given path (can be absolute or relative)

## Bonus

- hardcore .yarnclean rules to use in your projects - this will be probably moved to separate project
you need to rename the file (remove `.txt` extension) to use it. It is very restrictive and will break almost any
library by default. Use with care.

\* - transpiling kills JS engines optimizations, makes codes longer and tree shaking harder to do and/or slower

## License

MIT
