#! /usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mkdir -p "${DIR}/build"

pushd "${DIR}/build"
  npm install -g grunt-cli
  npm install
  grunt download-electron
popd

