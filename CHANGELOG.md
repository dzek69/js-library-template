All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [UNRELEASED]
### Fixed
- Compatibility with Windows

### Changed
- Added transpiling on `prepack`
- Added tests before publishing

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
