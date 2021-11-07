import DbConnector from '../database/driver';

// QUERY
/*
 * MATCH (place:Place)        // Find place by id
 * WHERE ID(place) = 32
 * CALL {                                                                         // Get all posts and authors
 *    WITH place                                                                  // Get place
 *    OPTIONAL MATCH (author:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place) // Get all posts and authors
 *    RETURN author, post                                                         // Return authors and posts
 *    LIMIT 100                                                                   // Limit to 100
 * }
 * RETURN place{.*,                        // Return place as object
 *    id:ID(place),                        // Return place id as id
 *    latitude: place.location.y,          // Return place latitude as latitude
 *    longitude: place.location.x,         // Return place longitude as longitude
 *    posts: COLLECT(DISTINCT post{.*,     // Return posts  as objects
 *          id:ID(post),                   // Return post id as id
 *          author: author{.*,             // Return author as object
 *              id: ID(author)             // Return author id as id
 *          }
 *        })
 *  } AS place`;
 *
 */

// RESPONSE
/*
 * {
 *  id: number,
 *  name: string,
 *  description: string,
 *  preview: string,
 *  latitude: number,
 *  longitude: number,
 *  posts: [
 *    {
 *     id: number,
 *     createdAt: string,
 *     postDate: string,
 *     author: {
 *      id: number,
 *      firstName: string,
 *      lastName: string,
 *      username: string,
 *     }
 *    }
 *  ]
 * }
 */

const PlaceQuery = async ({ id }: { id: number }) => {
  const query = `MATCH (place:Place) WHERE ID(place) = ${id}
CALL {
  WITH place
    OPTIONAL MATCH (author:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place)
    RETURN author, post
    LIMIT 100
}

RETURN place{.*, id:ID(place), latitude: place.location.y, longitude: place.location.x, posts: COLLECT(DISTINCT post{.*, id:ID(post), author: author{.*, id: ID(author)}})} AS place`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return result.records[0].get('place');
};

export default PlaceQuery;
