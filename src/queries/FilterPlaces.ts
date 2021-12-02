import { ValidateCoordinates, ValidateDate } from '../../shared/validation';
import RunCypherQuery from '../database/RunCypherQuery';

type queryInput = {
  maxLatitude: number;
  minLatitude: number;
  maxLongitude: number;
  minLongitude: number;
  minDate?: number;
  maxDate?: number;
};

const FilterPlacesQuery = async ({
  maxLatitude,
  minLatitude,
  maxLongitude,
  minLongitude,
  minDate,
  maxDate,
}: queryInput) => {
  // validate coordinates
  const validateMaxCoordinates = ValidateCoordinates([
    maxLatitude,
    maxLongitude,
  ]).error;
  if (validateMaxCoordinates) throw new Error(validateMaxCoordinates);
  const validateMinCoordinates = ValidateCoordinates([
    minLatitude,
    minLongitude,
  ]).error;
  if (validateMinCoordinates) throw new Error(validateMinCoordinates);

  // validate date if defined
  if (minDate) {
    const validateMinDate = ValidateDate(Number(minDate)).error;
    if (validateMinDate) throw new Error(validateMinDate);
  }
  if (maxDate) {
    const validateMaxDate = ValidateDate(Number(maxDate)).error;
    if (validateMaxDate) throw new Error(validateMaxDate);
  }

  const query = `MATCH (place:Place)
  WHERE place.location.latitude >= $minLatitude   // min latitude
  AND place.location.latitude <= $maxLatitude  // max latitude
  AND place.location.longitude >= $minLongitude    // min longitude
  AND place.location.longitude <= $maxLongitude     // max longitude
  
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
  RETURN COLLECT(place{.*,
      id: ID(place),
      latitude: place.location.latitude,  // latitude
      longitude: place.location.longitude,    // longitude
      icon: place.icon,
      postCount,
      likeCount,
      preview: 
          CASE
              // if place has preview return place preview
              WHEN (place.preview IS NOT NULL) THEN place.preview
              // else if place has post with photos, return photos as preview otherwise return null
              ELSE post.url
          END
  }) AS places`;

  const [result] = await RunCypherQuery({
    query,
    params: {
      minLatitude,
      maxLatitude,
      minLongitude,
      maxLongitude,
      minDate,
      maxDate,
    },
  });

  return result.records[0].get('places');
};

export default FilterPlacesQuery;
