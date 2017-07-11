#!/bin/sh

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

node ./node_modules/ugly-build/index.js build
node ./node_modules/ugly-build/index.js deploy https://${GH_TOKEN}@github.com/$1.git
