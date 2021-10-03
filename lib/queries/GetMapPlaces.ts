import DbConnector from '../database/driver';

const GetMapPlaces = async ({
  maxLatitude,
  minLatitude,
  maxLongitude,
  minLongitude,
}: {
  maxLatitude: number;
  minLatitude: number;
  maxLongitude: number;
  minLongitude: number;
}) => {
  const query = `
MATCH (place:Place)<-[:IS_LOCATED]-(post:Post)<-[:CREATED]-(author:User)
WHERE place.latitude >= ${minLatitude} AND place.latitude <= ${maxLatitude}
AND place.longitude >= ${minLongitude} AND place.longitude <= ${maxLongitude}
WITH {place:place, posts: COLLECT({post: post, author:author})} AS result
RETURN COLLECT(result) AS places`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return result.records[0]
    .get('places')
    .map(({ place, posts }: { place: any; posts: any }) => {
      return {
        ...place.properties,
        id: Number(place.identity),
        latitude: Number(place.properties.latitude),
        longitude: Number(place.properties.longitude),
        posts: posts.map(({ post, author }: { post: any; author: any }) => {
          return {
            ...post.properties,
            id: Number(post.identity),
            author: {
              ...author.properties,
              id: Number(author.identity),
            },
          };
        }),
      };
    });
};

export default GetMapPlaces;
