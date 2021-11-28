<div align="center">
    <h1>hiStories</h1>
</div>

![](https://github.com/hiStories-cc/hiStories/actions/workflows/build-node.yml/badge.svg)
![](https://github.com/hiStories-cc/hiStories/actions/workflows/storybook-node.yml/badge.svg)
![](https://github.com/hiStories-cc/hiStories/actions/workflows/test-node.yml/badge.svg)

<div align="center">
    <a href="https://www.histories.cc"><b>hiStories.cc</b></a>
    •
    <a href="https://www.chromatic.com/library?appId=61a39cca9c186c003a9e202f"><b>Storybook</b></a>
        •
    <a href="https://gitpod.io/#https://github.com/hiStories-cc/hiStories"><b>Gitpod</b></a>
</div>

## About

HiStories is a social site for sharing historical photos of places, so anyone can see, how the place has changed over time.
And it also is my high school final project.

## Setup

[![Edit with Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/hiStories-cc/hiStories)

## Setup dev server:

1. copy `.env.local.example` to `.env.local` and change values
2. copy `nodemon.json.example` to `nodemon.json` and change values
3. install dependencies `yarn`
4. run `yarn dev`

## Setup storybook

1. install dependencies `yarn`
2. run dev server `yarn sb`

## Technologies

- Next.js
- TypeScript
- GraphQL
- Neo4j
- Storybook

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
│   ├── stories (storybook stories)
│   ├── stories-static (storybook build output)
│   └── tranlation (i18n)
├── components (reusable react components)
└── public
```
