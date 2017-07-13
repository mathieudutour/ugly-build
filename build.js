const klaw = require('klaw-sync')
const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')
const Uglify = require('uglify-js')
const csso = require('csso')

const cwd = process.cwd()
const buildFolder = path.join(cwd, '.build')

var header
var footer

try {
  header = fs.readFileSync(path.join(cwd, '_header.html'))
} catch (e) {
  header = ''
}

try {
  footer = fs.readFileSync(path.join(cwd, '_footer.html'))
} catch (e) {
  footer = ''
}

function moveToBuildFolder(f) {
  return f.replace(cwd, buildFolder)
}

const IGNORED = [
  'node_modules',
  '.git',
  '.gitignore',
  'package.json',
  'package-lock.json',
  '_header.html',
  '_footer.html'
].map(i => path.join(cwd, i))

rimraf(buildFolder, () => {
  const files = klaw('.', {
    filter(f) {
      return !IGNORED.find(i => f.path.indexOf(i) === 0)
    }
  })

  fs.mkdirSync(buildFolder)

  files.forEach((f) => {
    if (f.stats.isDirectory()) {
      return fs.mkdirSync(moveToBuildFolder(f.path))
    }

    const ext = path.extname(f.path)

    if (ext === '.js') {
      const content = fs.readFileSync(f.path, 'utf-8')
      return fs.writeFileSync(moveToBuildFolder(f.path), Uglify.minify(content).code)
    }

    if (ext === '.css') {
      const content = fs.readFileSync(f.path, 'utf-8')
      return fs.writeFileSync(moveToBuildFolder(f.path), csso.minify(content).css)
    }

    if (ext !== '.html') {
      const content = fs.readFileSync(f.path)
      return fs.writeFileSync(moveToBuildFolder(f.path), content)
    }

    const content = fs.readFileSync(f.path, 'utf-8')

    fs.writeFileSync(moveToBuildFolder(f.path), header + content + footer)
  })
})
