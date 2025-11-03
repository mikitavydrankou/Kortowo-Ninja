### Authentication Controller Tests

Tests verify the core logic of `auth.controller.js` using **Jest (ESM)**.

#### What’s tested

* **Password validation** — weak or empty passwords trigger errors
* **Signup (weak password)** — fails with validation error
* **Signout** — clears cookie and returns success message
* **Signup (happy path)** — creates user, hashes password, sets JWT cookie
* **Signin (happy path)** — authenticates user and returns user info
* **Signin (wrong password)** — triggers authentication error

#### Running tests

Build

```bash
docker compose -f compose.dev.yml run --rm -e NODE_ENV=test -e NODE_OPTIONS=--experimental-vm-modules backend sh -lc "npm test --silent"
```

#### Notes

* Uses `jest.unstable_mockModule` to mock ESM modules (`bcrypt`, `jsonwebtoken`, DB models)
* `flushPromises()` waits for all async operations before assertions
* Fully isolated — no external DB or services required
