

cd .build
git init
git checkout -b gh-pages
touch .nojekyll
git add .
git commit -m 'deploy website :shipit:'
git push $1 gh-pages --force
