#!/bin/bash

TARGET_DIR="./public/pokemons";

rm -rf $TARGET_DIR;
mkdir -p $TARGET_DIR/front;
mkdir -p $TARGET_DIR/back;
mkdir -p $TARGET_DIR/icon;
find ./node_modules/pokemon-sprites/sprites/pokemon -type f -maxdepth 1 -regex ".*/[0-9]*.png" -exec cp {} $TARGET_DIR/front \;
find ./node_modules/pokemon-sprites/sprites/pokemon/back -type f -maxdepth 1 -regex ".*/[0-9]*.png" -exec cp {} $TARGET_DIR/back \;
find ./node_modules/pokemon-sprites/sprites/pokemon/versions/generation-viii/icons -type f -maxdepth 1 -regex ".*/[0-9]*.png" -exec cp {} $TARGET_DIR/icon \;
