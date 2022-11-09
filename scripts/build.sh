#!/bin/bash

yarn --ignore-engines;

yarn client:build;
yarn server:build;

SERVER_PUBLIC="./apps/server/dist/public";
CLIENT_BUILD="../../client/build";

[ -e "$SERVER_PUBLIC" ] && rm "$SERVER_PUBLIC"

ln -s "$CLIENT_BUILD" "$SERVER_PUBLIC";