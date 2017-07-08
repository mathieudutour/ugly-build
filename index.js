#!/usr/bin/env node

var command = process.argv[2]

var usage = 'Usage: `ugly-build build|deploy`'

if (!command) {
  console.error('Missing command. ' + usage)
  process.exit(1)
}

if (command !== 'build' && command !== 'deploy') {
  console.error('Command ' + command + ' not recocgnized.')
  console.error('Only `build` and `deploy` are supported. ' + usage)
  process.exit(1)
}

if (command === 'build') {
  require('./build')
} else if (command === 'deploy') {
  require('./deploy')
}
