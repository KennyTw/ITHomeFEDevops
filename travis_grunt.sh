#!/bin/bash

echo "TRAVIS_BRANCH:"
echo "$TRAVIS_BRANCH"

if [ "$TRAVIS_BRANCH" == "master" ]; then
  echo "master grunt"
  grunt ci
  grunt test
fi