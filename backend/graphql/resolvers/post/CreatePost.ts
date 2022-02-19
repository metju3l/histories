import { InputMaybe } from '../../../../.cache/__types__';
import DbConnector from '../../../database/driver';
import RunCypherQuery from '../../../database/RunCypherQuery';

interface CreatePostInput {
  place: {
    latitude: InputMaybe<number>;
    longitude: InputMaybe<number>;
    id: InputMaybe<number>;
  };
  userID: number;
  description?: InputMaybe<string>;
  nsfw: boolean;
  year: number;
  month?: number | null;
  day?: number | null;
  deviationDays: number;
  photos: Array<{
    width: number;
    height: number;
    index: number;
    hash: string;
    blurhash: string;
  }>;
}

async function CreatePost({
  userID,
  description,
  year,
  month,
  day,
  deviationDays,
  place,
  nsfw,
  photos,
}: CreatePostInput): Promise<string> {
  const [result] = await RunCypherQuery({
    query: `
    MATCH (user:User {id: ${userID}})         // match user
    
    CREATE (user)-[:CREATED]->(post:Post
    {
      description: "${description}",
      createdAt: ${new Date().getTime()}, // date of post creation
      year: ${year},  
      month: ${month},  
      day: ${day},  
      deviationDays: ${deviationDays},  
      nsfw: ${nsfw}, 
      edited: false,
      public: ${!nsfw}
    })
    MERGE (place:Place {    
    ${
      place?.id
        ? `id: ${place.id}`
        : `location: point({longitude: ${place.longitude}, latitude: ${place.latitude}, srid: 4326})`
    }
    })
    CREATE (post)-[:IS_LOCATED]->(place)
    SET post.id = ID(post)
    SET place.id = ID(place)
    
    ${
      // connect properties from array to one string
      photos
        .map(
          (photo, index) => `
        // create photos and connect to post
        MERGE (post)-[:CONTAINS]->(photo${index}:Photo {
          index: ${photo.index},
          hash: "${photo.hash}",
          blurhash: "${photo.blurhash}",
          width: ${photo.width},
          height: ${photo.height}
        })
        SET photo${index}.id = ID(photo${index})
      `
        )
        .join(' ')
    }
    
    RETURN post{.*} as post
    `,
  });

  const driver = DbConnector();
  const session = driver.session();

  const postID = result.records[0].get('post').id;
  /*
  await session.run(`WITH ${hashtags} AS tags
  MATCH (user:User), (post:Post)
  WHERE ID(post) = ${postID} AND ID(user) = ${userID} AND (user:User)-[:CREATED]->(post:Post)
  FOREACH (tag IN tags |
  MERGE (hashtag:Hashtag {name:tag})
  MERGE (hashtag)-[:CONTAINS]->(post)
  )`);
*/
  driver.close();

  return 'success';
}

export default CreatePost;
