#!/bin/bash
export DOCKER_HOST=unix:///Users/macintosh/.rd/docker.sock
npm test -- __tests__/integration --forceExit --runInBand
