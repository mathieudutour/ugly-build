# YOU PROBABLY DON'T WANT TO USE THIS

Create a `.travis.yml` file on the root:

```
branches:
  only:
    - master

language: node_js
node_js:
  - "8"

cache:
  directories:
    - $HOME/.cache/pip
    - node_modules

before_install:
  - pip install --user awscli
  - export PATH=$PATH:$HOME/.local/bin

install:
  - npm install

script:
  - node ./node_modules/ugly-build/index.js build
deploy:
  - provider: pages
    skip_cleanup: true
    github_token: $GITHUB_TOKEN # Set in travis-ci.org dashboard
    local_dir: .build
  - provider: s3
    skip_cleanup: true
    access_key_id: $AWS_ACCESS_KEY_ID # Set in travis-ci.org dashboard
    secret_access_key: $AWS_SECRET_ACCESS_KEY # Set in travis-ci.org dashboard
    bucket: $AWS_S3_BUCKED # Set in travis-ci.org dashboard
    local_dir: .build
    region: eu-west-1
after_deploy:
  - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
```

on [travis-ci.org](https://travis-ci.org) add:
* [`GH_TOKEN`](https://github.com/settings/tokens/new)
* [`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`](https://console.aws.amazon.com/iam/home?region=eu-west-1#/users): create a new user if needed: https://renzo.lucioni.xyz/s3-deployment-with-travis/
* [`AWS_S3_BUCKED`](https://s3.console.aws.amazon.com/s3/home?region=eu-west-1)
* [`CLOUDFRONT_DISTRIBUTION_ID`](https://console.aws.amazon.com/cloudfront/home?region=eu-west-1)

