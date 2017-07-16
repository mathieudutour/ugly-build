const klaw = require('klaw-sync')
const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')
const Uglify = require('uglify-js')
const csso = require('csso')
const hljs = require('highlight.js')
const mdRenderer = require('markdown-it')({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
                hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
})
mdRenderer.use(require('markdown-it-emoji'))

const cwd = process.cwd()
const buildFolder = path.join(cwd, '.build')

var header
var footer
var md

try {
  header = fs.readFileSync(path.join(cwd, '_header.html'), 'utf-8')
} catch (e) {
  header = ''
}

try {
  footer = fs.readFileSync(path.join(cwd, '_footer.html'), 'utf-8')
} catch (e) {
  footer = ''
}

try {
  md = fs.readFileSync(path.join(cwd, '_md.html'), 'utf-8')
} catch (e) {
  md = ''
}

function moveToBuildFolder(f) {
  return f.replace(cwd, buildFolder)
}

const IGNORED = [
  'node_modules',
  '.git',
  '.gitignore',
  '.travis.yml',
  'package.json',
  'package-lock.json',
  '_header.html',
  '_footer.html',
  '_md.html'
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

    if (ext === '.md' && md) {
      const content = fs.readFileSync(f.path, 'utf-8')
      if (f.path.indexOf('README.md') === -1) {
        fs.mkdirSync(moveToBuildFolder(f.path.replace('.md', '')))
      }
      return fs.writeFileSync(
        moveToBuildFolder(f.path.replace('README.md', 'index.html').replace('.md', '/index.html')),
        header + md.replace('{{path}}', f.path.replace(cwd, '')).replace('{{content}}', mdRenderer.render(content)) + footer)
    }

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
