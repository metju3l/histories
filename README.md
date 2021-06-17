# hiStories

## Setup dev:

1. rename `.env.local.example` to `.env.local` and change values
2. ```bash
   yarn install
   mkdir certificate
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

- check eslint `yarn lint`
- format `yarn format`
