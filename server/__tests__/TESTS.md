# Tests

- **Unit (10 total)**
	- Auth controller: signup, signin, wrong-password path
	- Offer controller: list/create/delete/fetch offer
	- User controller: top users, fetch profile, update profile
- **Integration (4 total)**
	- Auth: register & login happy paths
	- Offer: create offer & fetch active offers against DB
- **E2E (2 specs)**
	- `01-ui.spec`: homepage + auth forms smoke
	- `02-full-flow.spec`: register → login → create offer → view/logout/guarded routes (Playwright auto-starts backend via `npm run start:ci` and serves the built frontend preview)
