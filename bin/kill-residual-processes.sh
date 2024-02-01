#!/usr/bin/env bash

set -eu

echo "Checking port 3002"
processId_3002=`lsof -i -n -P | grep LISTEN | grep :3002 | awk '{print $2}'`

if [ ! -z "$processId_3002" ]
then
  echo "killing process with Id $processId_3002"
  kill -9 "$processId_3002"
else
  echo "There is no process running on port 3002"
fi

