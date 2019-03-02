All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [UNRELEASED]
(nothing yet)

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
