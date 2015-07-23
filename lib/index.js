'use strict'

var latex = require('latex')
  , through = require('through2')
  , rawBody = require('raw-body')
  , gutil = require('gulp-util')
  , path = require('path')

module.exports = gulpLatex

function gulpLatex(options) {

  options = options || {}

  // Sanitize against 'pdf' or 'dvi':
  options.format = {pdf: 'pdf', dvi: 'dvi'}[options.format] || 'pdf'

  return through.obj( function( file, enc, cb ) {

    // Pass null files
    if( file.isNull() ) {
      cb(null,file)
      return
    }

    // Change the output file extension:
    file.extname = '.'+options.format
    file.path = gutil.replaceExtension(file.path, '.'+options.format);

    if( file.isBuffer() ) {

      // Buffer the output:
      gutil.log((options.format==='pdf' ? 'pdflatex' : 'latex') + ': rendering to ' + gutil.colors.cyan(path.relative(file.base,file.path)) + "'")
      rawBody( latex(file.contents,options), function(err,data) {
        if(err) {
          this.emit('error', new gutil.PluginError('gulp-latex',err))
          return
        }
        file.contents = data
        cb(null,file)
      }.bind(this))
    }

    if( file.isStream() ) {
      gutil.log((options.format==='pdf' ? 'pdflatex' : 'latex') + ': rendering to ' + gutil.colors.cyan(path.relative(file.base,file.path)) + "'")
      var stream = through()
      var l = latex(file.contents,options)
      l.pipe(stream)
      file.contents = stream

      l.on('error',function(err) {
        this.emit('error', new gutil.PluginError('gulp-latex',err))
        cb()
      }.bind(this)).on('end',function(a,b) {
        cb(null,file)
      })
    }
  })

}
