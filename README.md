# To run locally

## Run:

1. Clone and install packages
   ```
   git clone https://github.com/derekc2205/get-a-life-api.git
   npm install
   ```

2. Create .env file in root folder and include the following environment variables
   - JWT_Secret

3. Start project
   ```
   npm run dev
   ```

## Test:

- Test watch:
  ```
  npm run test:watch
  ```

- Test coverage:
  ```
  npm run test:coverage
  ```
## Required for Cypress test
To run Cypress test in `get-a-life` **UI**, it is required to run **API** in test environment by running
```
npm run start:e2e
```
