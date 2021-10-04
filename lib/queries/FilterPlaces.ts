import RunCypherQuery from '@lib/database/RunCypherQuery';
import { ValidateCoordinates, ValidateDate } from '@lib/validation';

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
  ValidateQueryInput({
    maxLatitude,
    minLatitude,
    maxLongitude,
    minLongitude,
    minDate,
    maxDate,
  });

  const query = `
MATCH (place:Place)<-[:IS_LOCATED]-(post:Post)<-[:CREATED]-(author:User)
WHERE place.latitude >= ${minLatitude} AND place.latitude <= ${maxLatitude}
AND place.longitude >= ${minLongitude} AND place.longitude <= ${maxLongitude}
${minDate ? ` AND post.postDate >= ${minDate} ` : ''}
${maxDate ? ` AND post.postDate <= ${maxDate} ` : ''}
WITH place{.*, id: ID(place), posts: COLLECT(post{.*, id: ID(post), author: author{.*, id: ID(author)}})} AS result
RETURN COLLECT(result) AS places`;

  const result = await RunCypherQuery(query);

  return result.records[0].get('places');
};

const ValidateQueryInput = ({
  maxLatitude,
  minLatitude,
  maxLongitude,
  minLongitude,
  minDate,
  maxDate,
}: queryInput) => {
  // check coordinates
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

  // check date
  if (minDate) {
    const validateMinDate = ValidateDate(Number(minDate)).error;
    if (validateMinDate) throw new Error(validateMinDate);
  }
  if (maxDate) {
    const validateMaxDate = ValidateDate(Number(maxDate)).error;
    if (validateMaxDate) throw new Error(validateMaxDate);
  }
};

export default FilterPlacesQuery;
