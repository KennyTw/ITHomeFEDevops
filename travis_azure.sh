#!/bin/bash

export AZURE_STORAGE_ACCOUNT="ithomefedevops"
export AZURE_STORAGE_ACCESS_KEY="yrRw5W3O9cnF6kBzRGuIUdKeOl9cA6qmfU7RnbTwiqOTIIbY8ADtm5l35F5cVR9QFfcqp0/0Q2+WHJuUnkQjAQ=="

echo "Uploading files..."
azure storage file upload './app' deploy

echo "Done"