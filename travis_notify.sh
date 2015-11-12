#!/bin/bash

echo "TRAVIS_BRANCH:"
echo "$TRAVIS_BRANCH"

if [ "$TRAVIS_BRANCH" == "master" ]; then
  echo "master deploy"
  curl --data "" http://54.199.162.1/travis
elif [ "$TRAVIS_BRANCH" == "dev" ]; then
  echo "dev deploy"
  curl --data "" http://54.64.42.1/travis
fi