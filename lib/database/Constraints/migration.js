const neo4j = require('neo4j-driver');
const fs = require('fs');
const dotenv = require('dotenv').config({ path: '../../../.env.local' });

const RunCypherQuery = async (query) => {
  const driver = neo4j.driver(
    dotenv.parsed.NEO4J_HOST || 'bolt://localhost:7687',
    neo4j.auth.basic(
      dotenv.parsed.NEO4J_USER || 'neo4j',
      dotenv.parsed.NEO4J_PASSWORD || 'password'
    ),
    { disableLosslessIntegers: true }
  );

  const session = driver.session();
  const result = await session.run(query);
  driver.close();
  return result;
};

const notNull = [
  {
    label: 'User',
    properties: ['username', 'password', 'firstName', 'lastName', 'email'],
  },
  {
    label: 'Post',
    properties: ['createdAt', 'postDate'],
  },
];

const isUnique = [
  {
    label: 'User',
    properties: ['username', 'email'],
  },
];

const Main = async () => {
  const notNullQuery = notNull
    .map((element) =>
      element.properties.map(
        (property) =>
          `CREATE CONSTRAINT ${property}Exists IF NOT EXISTS ON (${element.label.toLowerCase()}:${
            element.label
          }) ASSERT ${element.label.toLowerCase()}.${property} IS NOT NULL;`
      )
    )
    .flat()
    .join('\n');

  const isUniqueQuery = isUnique
    .map((element) =>
      element.properties.map(
        (property) =>
          `CREATE CONSTRAINT ${property}IsUnique IF NOT EXISTS ON (${element.label.toLowerCase()}:${
            element.label
          }) ASSERT ${element.label.toLowerCase()}.${property} IS UNIQUE;`
      )
    )
    .flat()
    .join('\n');

  const fullQuery =
    process.argv[2] === 'drop'
      ? 'CALL apoc.schema.assert({}, {});'
      : process.argv[2] === 'drop-sync'
      ? 'CALL apoc.schema.assert({}, {});' +
        '\n' +
        notNullQuery +
        '\n' +
        isUniqueQuery
      : notNullQuery + '\n' + isUniqueQuery;

  fs.writeFile(
    './lib/database/Constraints/constraints.cypher',
    fullQuery,
    (error) => {
      if (error) return console.log(error);
    }
  );
};

Main();
