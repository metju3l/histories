var neo4j = require('neo4j-driver');

var driver = neo4j.driver(
  process.env.HOST,
  neo4j.auth.basic(process.env.USER, process.env.PASSWORD)
);

var session = driver.session();
session.run('CREATE (n:Person {name: "Kahy", title: "Developer"})');
