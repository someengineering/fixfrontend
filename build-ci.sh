#!/bin/bash

rm -rf build

yarn build
mv build/static/js/main.*.js build/static/js/main.js

COMMIT=$(git rev-parse HEAD);

mkdir -p target/$COMMIT
cp -r build/* target/$COMMIT