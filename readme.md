# Test Automation Suite

## Scope
- Add a new invoice and verify it can be sent via email
- Add a new client
- Add a new expense

## Solution Highlights
- Authentication setup is executed once and reused across tests
- Tests are designed to run in parallel
- Each test uses randomized test data
- Test execution can be triggered on demand via GitHub Actions
- GitHub Actions generates a CTRF report
- Playwright binaries are cached in CI for faster execution

## Challenges / Limitations
- Limited time for deeper API layer exploration
- Some locators were inconsistent or missing
- Did not have enough time to fully disable Google Translate, therefore some locators remain in Slovak