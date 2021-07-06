# hiStories

## Setup dev:

1. rename `.env.local.example` to `.env.local` and change values
2. generate certificate
   ```bash
   yarn install
   cd certificate
   mkcert localhost
   ```
3. run `yarn dev` / `yarn dev-ssl`

## Production:

1. rename `.env.local.example` to `.env.local` and change values
2. ```bash
   yarn install
   yarn build
   yarn start
   ```

## Before pushing:

- check eslint `yarn test-all`
- format `yarn format`
