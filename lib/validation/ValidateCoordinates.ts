const ValidateCoordinates = ([latitude, longitude]: [number, number]): {
  error: string | null;
} => {
  // checking coordinates by ISO 6709 - decimal degrees
  if (latitude < -90 || latitude > 90) return { error: 'Invalid latitude' };
  else if (longitude < -180 || longitude > 180)
    return { error: 'Invalid longitude' };
  else return { error: null };
};

export default ValidateCoordinates;
