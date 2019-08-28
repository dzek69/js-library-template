All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [UNRELEASED]
(nothing yet)

## [1.7.0] - 2019-08-28
### Added
- support for JSX files extension (no actual JSX transpiling/React is added)

## [1.6.0] - 2019-08-27
### Changed
- `--report-unused-disable-directives` parameter added into eslint run command
- upgraded eslint

## [1.5.1] - 2019-08-23
### Fixed
- audit issues by upgrading lockfiles

## [1.5.0] - 2019-08-15
### Fixed
- generated library LICENSE file not containing given name (instead in rare cases package.json author field could be
broken)
### Changed
- CLI now suggests project name based on target dir
- CLI now trims given values
- CLI now suggests Copyright value the same as Author (if given)

## [1.4.4] - 2019-08-15
### Fixed
- generated lib unnecessary jsdoc config added to npmignore

## [1.4.3] - 2019-08-02
### Fixed
- some audit issues (dang you, lodash), still 167 sub-packages of dev-deps waiting to be fixed

## [1.4.2] - 2019-07-31
### Fixed
- issues with importing esmodules-style code from node_modules in tests

## [1.4.1] - 2019-07-14
### Fixed
- 1.4.0 changes not being applied with libraries created with CLI

## [1.4.0] - 2019-07-14
### Changed
- babel related dependencies upgraded
- eslint with rules set upgraded
- mocha upgraded

## [1.3.4] - 2019-07-12
### Fixed
- issues with importing esmodules-style code in tests

## [1.3.3] - 2019-07-12
### Fixed
- eslint misbehaving on Windows after recent fix - again

## [1.3.2] - 2019-07-09
### Fixed
- eslint misbehaving on Windows after recent fix

## [1.3.1] - 2019-07-08
### Fixed
- eslint ignoring deeply located files

## [1.3.0] - 2019-06-06
### Added
- cli tool to help init new library
### Fixed
- deps audit warnings

## [1.2.1] - 2019-06-05
### Fixed
- audit issues, `marked` was vulnerable

## [1.2.0] - 2019-05-09
### Fixed
- `jsdoc` not generating docs from subfolders
- accidentally used `import` instead of `require` in one file, causing template `lint` to fail
- vulnerable libraries (upgraded their versions in lockfile)
### Changed
- `jsdoc` now supports .mjs files

## [1.1.1] - 2019-03-02
### Changed
- updated `jsdoc` subdependencies in lockfile, `marked` had security issue

## [1.1.0] - 2019-03-02
### Changed
- eslint rules config updated
- babel config replaced to support only >3% usage js environments, no more transpiling everything to ES5

## [1.0.8] - 2018-12-09
### Changed
- eslint ignored rules for tests

## [1.0.7] - 2018-11-29
### Changed
- .yarnclean upgraded to remove more config files, license misspelling and TS types related files

## [1.0.6] - 2018-11-27
### Changed
- .yarnclean updated to prevent some known issues and clean even more

## [1.0.5] - 2018-11-22
### Changed
- EditorConfig config to let package.json stay at 2 spaces indent
- Tests files eslint rules ignores

## [1.0.4] - 2018-11-21
### Added
- EditorConfig
- async test example
- log files to gitignore
- .yarnclean file
### Changed
- `todo` README entries
- libraries updated (eslint, fs-extra, mocha)
- Babel stuff updated
- .npmignore to exclude some unneeded files
### Fixed
- now adding regenerator runtime in transpiled code

## [1.0.3] - 2018-10-05
### Added
- Eslint integration
- Code linting before publishing
### Fixed
- Compatibility with Windows
### Changed
- Added transpiling on `prepack`
- Added tests before publishing
- Updated example code to be properly styled

## [1.0.2] - 2018-09-11
### Added
- Possibility to define list of additional docs files while generating docs
### Changed
- Updated docdash
- Replaced fs-related dependencies with single fs-extra
### Removed
- Lodash, that was unused anyway

## [1.0.1] - 2017-12-10
### Added
- Rewire plugin for testing
- previously missing information about CHANGELOG example
### Fixed
- test running command

## [1.0.0] - 2017-12-10
### Added
- first version
- documentation generating with `jsdoc` with `docdash` template
- unit tests with `mocha` & `must.js`
- es6+ first approach, with es5 transpiled version to be found inside `dist` folder
