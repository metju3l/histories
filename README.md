# hiStories

## About

HiStories is a social site for sharing historical photos of places, so anyone can see, how the place has changed over time.
And it also is my high school final project.

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

## Functions

- [x] Follow other people
- [ ] Create post
- [ ] Interact with other posts (likes and comments)
- [ ] Connection with map
- [ ] Messaging

## Technologies

- Next.js
- TypeScript¨
- GraphQL
- Neo4j
