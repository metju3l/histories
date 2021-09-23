# hiStories

[![Edit with Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/hiStories-cc/hiStories)

## About

HiStories is a social site for sharing historical photos of places, so anyone can see, how the place has changed over time.
And it also is my high school final project.

## Setup dev:

1. rename `.env.local.example` to `.env.local` and change values
2. generate certificate
   ```bash
   cd certificate
   sh install.sh
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

- build `yarn build`
- lint, type-check and tests `yarn test-all`

## Technologies

- Next.js
- TypeScript
- GraphQL
- Neo4j
