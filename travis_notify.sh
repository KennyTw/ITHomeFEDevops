#!/bin/bash

echo "TRAVIS_BRANCH:"
echo "$TRAVIS_BRANCH"

if [ "$TRAVIS_BRANCH" == "master" ]; then
  echo "master deploy"
  curl --data "" http://ithomefedevops.cloudapp.net:3000/travis_web_hook
elif [ "$TRAVIS_BRANCH" == "dev" ]; then
  echo "dev deploy"
  curl --data "" http://ithomefedevops.cloudapp.net:3000/travis_web_hook
fi