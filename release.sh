#!/usr/bin/env bash


sudo electron-packager ./ myApp --platform=linux --arch x64 \
--out dist \
--prune --overwrite

