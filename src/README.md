# backend

_functions shared with frontend are located in ./shared/_

## structure

```
src/
├── database/
│   ├── driver.ts (neo4j connector)
│   ├── mongodb.ts (mongodb connector)
│   └── RunCypherQuery.ts (run neo4j queries with one function)
├── s3/ (s3 interaction functions)
│   ├── DeleteFile.ts
│   └── UploadPhoto.ts
├── email/
│   └── SendEmail.ts (send email function)
├── functions/ (backend functions)
│   └── NSFWCheck.ts (check images with external api)
├── graphql/
│   ├── apolloServer.ts (graphql middleware)
│   ├── resolvers.ts (handle graphql requests)
│   ├── schema.ts (generates schema from type-defs)
│   └── type-defs.ts (define graphql schema)
├── queries/ (graphql queries code)
└── mutations/ (graphql mutations code)
    ├── Create/
    ├── Edit/
    └── Delete/
```
