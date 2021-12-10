import DbConnector from '../../database/driver';

const GetPostByTag = async ({ label }: { label: string }) => {
  const query = `MATCH (post:Post) WHERE post.hashtags CONTAINS '"${label}"' RETURN post`;

  const driver = DbConnector();
  const session = driver.session();

  const queryResult = await session.run(query);
  driver.close();

  return {
    label,
    posts: queryResult.records.map((post) => post.get('post').properties),
  };
};

export default GetPostByTag;
