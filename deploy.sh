cd $1
git init
git checkout -b gh-pages
touch .nojekyll
git add .
git commit -m 'deploy website :shipit:'
git push $2 gh-pages --force
