# circular-require

Detect circular require statements in a codebase.

## Install

```sh
$ npm install -g circular-require
```

## Use

`circular-require` provides a single command that takes an entry point
as its one argument. If it is run in a directory with a package.json
with browserify.transform field, it'll use those transforms while resolving
dependencies.

```sh
$ ~/src/app-styles〉circular-require src/index.js
found 1 cycles
[ '/Users/tmcw/src/app-styles/src/components/forms/_index.js',
  '/Users/tmcw/src/app-styles/src/util/_compute_form.js',
  '/Users/tmcw/src/app-styles/src/components/forms/ramps/generic_ramp.js',
  '/Users/tmcw/src/app-styles/src/components/forms/generic_fn.js' ]
```
