#!/bin/bash

cloc . \
  --exclude-dir=node_modules,dist,logs,build,.git,coverage,prisma,.codebase-memory \
  --exclude-ext=json,lock
