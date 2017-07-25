#!/usr/bin/env node

var command = process.argv[2]

var usage = 'Usage: `ugly-build build`'

if (!command) {
  console.error('Missing command. ' + usage)
  process.exit(1)
}

if (command !== 'build') {
  console.error('Command ' + command + ' not recocgnized.')
  console.error('Only `build` is supported. ' + usage)
  process.exit(1)
}

if (command === 'build') {
  require('./build')
}
