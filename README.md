# hiStories

[![Edit with Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/hiStories-cc/hiStories)

## About

HiStories is a social site for sharing historical photos of places, so anyone can see, how the place has changed over time.
And it also is my high school final project.

## Setup dev:

1. rename `.env.local.example` to `.env.local` and change value
2. rename `nodemon.json.example` to `nodemon.json` and change value
3. run `yarn dev`

## Before pushing:

- build `yarn build`
- lint, type-check and jest `yarn test-all`

## Technologies

- Next.js
- TypeScript
- GraphQL
- Neo4j

## Project structure

```
hiStories/
├── pages (using nextjs routing)
├── src (backend)
│   ├── graphql
│   │   ├── schema
│   │   └── resolvers
│   ├── queries
|   └── mutations
├── shared (shared between frontend - validation, etc.)
├── dist (compiled backend)
├── lib (frontend)
│   ├── graphql
│   ├── hooks
│   ├── functions
│   └── tranlation (i18n)
├── components (reusable react components)
└── public
```
