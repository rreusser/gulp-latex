'use strict'

var assert = require('chai').assert
  , gulpLatex = require('../lib')
  , File = require('vinyl')
  , vinylFile = require('vinyl-file')
  , rawBody = require('raw-body')
  , fs = require('fs')
  , streamifier = require('streamifier')

var LATEX, PDFLATEX

LATEX = process.env.LATEX || __dirname + '/stubs/latex.js'
PDFLATEX = process.env.PDFLATEX || __dirname + '/stubs/pdflatex.js'
console.log('using latex = ',LATEX)
console.log('using pdflatex = ',PDFLATEX)

function transformFile(converter, file, cb) {
  converter.on('data',function(file) {
    cb(null,file)
  }).on('error',function(err) {
    cb(err,null)
  })
  converter.write(file)
  converter.end()
}

function transformFileStream(converter, file, cb) {
  converter.on('data',function(file) {
    rawBody(file.contents,function(err,data) {
      file.contents = data
      cb(null,file)
    })
  }).on('error',function(err) {
    cb(err,null)
  })
  converter.write(file)
  converter.end()
}

function looksLikePDF( buffer ) {
  return buffer.toString().match(/^%PDF-.*/)
}

function looksLikeDVI( buffer ) {
  return buffer.toString().match(/TeX output/)
}

describe( "null files", function() {
  it("passes null files",function(done) {
    var converter = gulpLatex({command:PDFLATEX})
    var input = new File()
    transformFile( converter, input, function(err,output) {
      assert.isNull( output.contents )
      done()
    })
  })
})

describe( "buffered files", function() {

  it("renders a file to pdf",function(done) {
    var input = vinylFile.readSync(__dirname+'/fixtures/sample.tex')
    var converter = gulpLatex({command:PDFLATEX})
    transformFile( converter, input, function(err,output) {
      assert.equal( output.extname, '.pdf' )
      assert( looksLikePDF( output.contents ) )
      done()
    })
  })

  it("renders a file to dvi",function(done) {
    var input = vinylFile.readSync(__dirname+'/fixtures/sample.tex')
    var converter = gulpLatex({command:LATEX,format: 'dvi'})
    transformFile( converter, input, function(err,output) {
      assert.equal( output.extname, '.dvi' )
      assert( looksLikeDVI( output.contents ) )
      done()
    })
  })

  it("emits errors",function(done) {
    var input = vinylFile.readSync(__dirname+'/fixtures/bad-latex.tex')
    var converter = gulpLatex({command:PDFLATEX})
    transformFile( converter, input, function(err,output) {
      if(err) {
        assert.throws(function() {
          throw err
        },Error,'LaTeX Syntax Error')
        done()
      }
    })
  })

})

describe( "streamed files", function() {

  it("renders a file",function(done) {
    var input = vinylFile.readSync(__dirname+'/fixtures/sample.tex')
    input.contents = streamifier.createReadStream(input.contents)
    var converter = gulpLatex({command:PDFLATEX})
    transformFileStream( converter, input, function(err,output) {
      assert( looksLikePDF( output.contents ) )
      done()
    })
  })

  it("emits errors",function(done) {
    var input = vinylFile.readSync(__dirname+'/fixtures/bad-latex.tex')
    input.contents = streamifier.createReadStream(input.contents)
    var converter = gulpLatex({command:PDFLATEX})
    transformFileStream( converter, input, function(err,output) {
      if(err) {
        assert.throws(function() {
          throw err
        },Error,'LaTeX Syntax Error')
        done()
      }
    })
  })

})
