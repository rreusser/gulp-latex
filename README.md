# gulp-latex [![npm version](https://badge.fury.io/js/gulp-latex.svg)](http://badge.fury.io/js/gulp-latex) [![Dependency Status](https://david-dm.org/rreusser/gulp-latex.svg)](https://david-dm.org/rreusser/gulp-latex)

<!---
[![Build Status](https://travis-ci.org/rreusser/gulp-latex.svg)](https://travis-ci.org/rreusser/gulp-latex)
-->


A gulp plugin for rendering LaTeX files


## Introduction

This gulp plugin receives .tex files and renders them to .pdf or .dvi files. There's not much more to it than that. The interface for the [latex](https://github.com/mikolalysenko/node-latex) node module is already pretty simple, so this is just a little glue to do the messy footwork and make it gulp-compatible. All options are just passed directly to that module and errors are emitted in gulp-fashion.

Sample usage:

```javascript
var latex = require('gulp-latex')

gulp.task('latex',function() {
  return gulp.src('*.tex')
    .pipe( latex() )
    .pipe( gulp.dest('./') )
})
```


## Installation

As per the [latex](https://github.com/mikolalysenko/node-latex) module instructions, you'll need texlive installed. To install the node module:

```sh
$ npm install gulp-latex
```

## API

### `require('gulp-latex')( options )`
Creates a gulp-compatible object transform stream that inputs and outputs vinyl file objects. Both streamed and buffered I/O is accepted.

- `options`
  - `format`: either 'pdf' or 'dvi. By default outputs a pdf.
  - `command`: the latex command invoked. Default: `latex`

## Credits

(c) 2015 Ricky Reusser. MIT License
