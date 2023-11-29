#!/usr/bin/env bash

set -eu

./bin/kill-residual-processes.sh

echo "running frontend in development mode"

yarn start:dev
