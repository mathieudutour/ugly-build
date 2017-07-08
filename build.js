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

rimraf(buildFolder, () => {
  const files = klaw('.', {
    filter: (f) => {
      return f.path.indexOf('node_modules') < 0 &&
            f.path.indexOf('.git') < 0 &&
            f.path.indexOf('.gitignore') < 0 &&
            f.path.indexOf('package.json') < 0 &&
            f.path.indexOf('package-lock.json') < 0 &&
            f.path.indexOf('build.js') < 0 &&
            f.path.indexOf('_header.html') < 0 &&
            f.path.indexOf('_footer.html') < 0
    }
  })

  fs.mkdirSync(buildFolder)

  files.forEach((f) => {
    if (f.stats.isDirectory()) {
      return fs.mkdirSync(moveToBuildFolder(f.path))
    }

    const content = fs.readFileSync(f.path, 'utf-8')

    const ext = path.extname(f.path)

    if (ext === '.js') {
      return fs.writeFileSync(moveToBuildFolder(f.path), Uglify.minify(content).code)
    }

    if (ext === '.css') {
      return fs.writeFileSync(moveToBuildFolder(f.path), csso.minify(content).css)
    }

    if (path.extname(f.path) !== '.html') {
      return fs.writeFileSync(moveToBuildFolder(f.path), content)
    }

    fs.writeFileSync(moveToBuildFolder(f.path), header + content + footer)
  })
})
