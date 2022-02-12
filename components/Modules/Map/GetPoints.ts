interface GetPointsProps {
  timeLimitation: [number, number];
  places?: Array<{
    id: number;
    latitude: number;
    longitude: number;
    icon?: string | null;
    preview?: { hash: string } | null;
    posts: Array<{ postDate: number | string }>;
  }>;
}

type GetPointsType =
  | Array<{
      type: string;
      properties: {
        cluster: boolean;
        id: number;
        icon: string | null | undefined;
        preview: string | undefined;
      };
      geometry: {
        type: string;
        coordinates: number[];
      };
    }>
  | undefined;

function GetPoints({ timeLimitation, places }: GetPointsProps): GetPointsType {
  return places
    ?.filter(
      (place) =>
        place.posts.filter((post) => {
          const postDate = new Date(post.postDate).getFullYear(); // get post year
          return postDate > timeLimitation[0] && postDate < timeLimitation[1]; // compare year with timeline limitations
        }).length > 0
    )
    .map((place) => ({
      type: 'Feature',
      properties: {
        cluster: false,
        id: place.id,
        icon: place.icon,
        preview: place?.preview?.hash,
      },
      geometry: {
        type: 'Point',
        coordinates: [place.longitude, place.latitude],
      },
    }));
}

export default GetPoints;
