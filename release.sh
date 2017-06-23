#!/usr/bin/env bash


electron-packager ./ myApp --platform=all --arch x64 \
--out dist \
--prune --overwrite

