.travis.yml

```
branches:
  only:
    - master

language: node_js
node_js:
  - "8"

cache:
  directories:
    - node_modules

install:
  - npm install

script:
  - ./node_modules/ugly-build/travis-deploy.sh owner/repo
```

Add a github token on travis: `GH_TOKEN`
