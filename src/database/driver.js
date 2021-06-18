const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_HOST || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

var session = driver.session();
session.run('CREATE (n:Person {name: "Kahy", title: "Developer"})');
