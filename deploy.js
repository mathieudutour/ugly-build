const { execSync } = require('child_process')
const path = require('path')

var remote = process.argv[3]

if (!remote) {
  console.error('Missing remote. Usage: `ugly-build deploy remote-url`')
  process.exit(1)
}

execSync(path.join(__dirname, 'deploy.sh') + ' ' + path.join(process.cwd(), '.build') + ' ' + remote)
