Dev 

1. Build it and run
docker compose -f .\compose.dev.yml up --build

2. Run tests in another terminal
docker compose -f compose.dev.yml run --rm -e NODE_ENV=test -e NODE_OPTIONS=--experimental-vm-modules backend sh -lc "npm test -- --verbose"