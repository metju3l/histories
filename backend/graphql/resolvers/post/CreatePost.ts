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
  hashtags?: InputMaybe<string>;
  photoDate: string;
  nsfw: boolean;

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
  hashtags,
  photoDate,
  place,
  nsfw,
  photos,
}: CreatePostInput): Promise<string> {
  const [result] = await RunCypherQuery({
    query: `
    MATCH (user:User)         // match user
    WHERE ID(user) = $userID
  
    CREATE (user)-[:CREATED]->(post:Post
    {
      description: $description,
      createdAt: $createdAt, // date of post creation
      postDate: $postDate,  
      nsfw: $nsfw, 
      edited: false,
      public: $public
    })
    MERGE (place:Place {    
    ${
      place?.id
        ? `id: ${place.id}`
        : `location: point({longitude: ${place.longitude}}, latitude: ${place.latitude}, srid: 4326})`
    }
    })
    MERGE (post)-[:IS_LOCATED]->(place)
    SET post.id = ID(post)
    SET place.id = ID(place)
  
    ${
      // connect properties from array to one string
      photos
        .map(
          (photo) => `
        // create photos and connect to post
        MERGE (post)-[:CONTAINS]->(photo:Photo {
          index: ${photo.index},
          hash: "${photo.hash}",
          blurhash: "${photo.blurhash}",
          width: ${photo.width},
          height: ${photo.height}
        })
        SET photo.id = ID(photo)
      `
        )
        .join('\n')
    }
  
    RETURN post{.*, id: ID(post)} as post
    `,
    params: {
      userID,
      description,
      createdAt: new Date().getTime(),
      postDate: photoDate,
      nsfw,
      public: !nsfw,
      photos,
    },
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
