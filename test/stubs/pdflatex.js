#!/usr/bin/env node

var fs = require('fs')

var input = fs.readFileSync('texput.tex')

if( input.toString().match(/This file lacks a document/) ) {
  fs.writeFileSync('texput.log','! error\n! error')
  process.exit(1)
} else {
  fs.writeFileSync('texput.pdf','%PDF-')
}
