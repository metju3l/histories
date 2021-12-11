import RunCypherQuery from '../../../database/RunCypherQuery';

type queryInput = {
  filter: {
    maxLatitude: number | null;
    minLatitude: number | null;
    maxLongitude: number | null;
    minLongitude: number | null;
    minDate: number | null;
    maxDate: number | null;
    radius: {
      latitude: number;
      longitude: number;
      distance: number;
    } | null;
    tags: string[] | null;
    skip: number | null;
    take: number | null;
  } | null;
  loggedId: number | null;
};

const PlacesQuery = async ({ filter, loggedId }: queryInput) => {
  const query = `
  MATCH (place:Place)
  WHERE (place.location.latitude >= $minLatitude OR $minLatitude IS NULL)                 // min latitude
    AND (place.location.latitude <= $maxLatitude OR $maxLatitude IS NULL)                 // max latitude
    AND (place.location.longitude >= $minLongitude OR $minLongitude IS NULL)              // min longitude
    AND (place.location.longitude <= $maxLongitude OR $maxLongitude IS NULL)              // max longitude
    AND (distance(place.location, point($radius)) <= $radius.distance OR $radius IS NULL) // radius 

  // return most liked post from place which has photos
  CALL {
      WITH place
      OPTIONAL MATCH (place:Place)<-[:IS_LOCATED]-(post:Post)<-[:CREATED]-(author:User)
      WHERE post.url IS NOT NULL  // where post has photos
      RETURN post
      LIMIT 1 // only one to use as preview image
  }
  
  // post count
  CALL {
      WITH place
      // count posts assigned to place
      OPTIONAL MATCH (place:Place)<-[:IS_LOCATED]-(post:Post)<-[:CREATED]-(author:User)
      RETURN COUNT(DISTINCT post) AS postCount 
  }
  
  // like count
  CALL {
      WITH place
      // count likes assigned to posts assigned to place
      OPTIONAL MATCH (place:Place)<-[:IS_LOCATED]-(:Post)<-[:LIKE]-(like:User)
      RETURN COUNT(DISTINCT like) AS likeCount    
  }
  
  // return places as an array of objects
  WITH place{.*,
      id: ID(place),
      latitude: place.location.latitude,  // latitude
      longitude: place.location.longitude,    // longitude
      icon: place.icon,
      postCount,
      likeCount,
      distance:  
          CASE
              // if radius in input is not defined return null
              WHEN $radius IS NULL THEN NULL
              // when searching in radius return distance from center
              ELSE distance(place.location, point($radius)) 
          END,
      preview: 
          CASE
              // if place has preview return place preview
              WHEN (place.preview IS NOT NULL) THEN place.preview
              // else if place has post with photos, return photos as preview otherwise return null
              ELSE post.url
          END
  } AS placeObj
  ORDER BY placeObj.id ASC
  SKIP $skip
  LIMIT $take

  RETURN COLLECT(placeObj) AS places
  `;

  const [result] = await RunCypherQuery({
    query,
    params: {
      // if parameter is undefined set it to null
      minLatitude: filter?.minLatitude ?? null,
      maxLatitude: filter?.maxLatitude ?? null,
      minLongitude: filter?.minLongitude ?? null,
      maxLongitude: filter?.maxLongitude ?? null,
      minDate: filter?.minDate ?? null,
      maxDate: filter?.maxDate ?? null,
      skip: filter?.skip ?? 0,
      take: filter?.take ?? 5000,
      radius: filter?.radius ?? null,
      loggedId,
    },
  });

  return result.records[0].get('places');
};

export default PlacesQuery;
