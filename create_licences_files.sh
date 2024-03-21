#!/bin/bash

sudo apt-get update
sudo apt-get install jq
npm install
mkdir -p Licenses
npx license-checker --json > license-checker-output.json
./copy_licenses_from_node_modules.sh license-checker-output.json ./Licenses
echo "Licenses dir is ready"