#!/usr/bin/env bash

set -eu

echo "Checking port 3001"
processId_3001=`lsof -i -n -P | grep LISTEN | grep :3001 | awk '{print $2}'`

if [ ! -z "$processId_3001" ]
then
  echo "killing process with Id $processId_3001"
  kill -9 "$processId_3001"
else
  echo "There is no process running on port 3001"
fi
