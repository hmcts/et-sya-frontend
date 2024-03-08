#!/usr/bin/env bash

set -eu

echo "Checking port 6379"
processId_6379=`lsof -i -n -P | grep LISTEN | grep :6379 | grep IPv4 | awk '{print $2}'`

if [ ! -z "$processId_6379" ]
then
  echo "killing process with Id $processId_6379"
  kill -9 "$processId_6379"
else
  echo "There is no process running on port 6379"
fi

