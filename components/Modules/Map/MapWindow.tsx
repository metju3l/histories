import MapStyleMenu from '@components/Modules/Map/MapStyleMenu';
import Marker from '@components/Modules/Map/Marker';
import { SearchLocation } from '@components/Modules/SearchLocation';
import { ConvertBounds } from '@lib/functions';
import GetMapStyle from '@lib/functions/map/GetMapStyle';
import { IViewport, MapStyles } from '@lib/types/map';
import { useTheme } from 'next-themes';
import React, { useRef, useState } from 'react';
import ReactMapGL, { ExtraState, MapRef } from 'react-map-gl';
import useSupercluster from 'use-supercluster';

import { Maybe } from '../../../.cache/__types__';
import { MapContext } from '../../Templates/Map/MapContext';

const MapGL: React.FC = () => {
  const mapContext = React.useContext(MapContext);

  const [mapStyle, setMapStyle] = useState<MapStyles>('theme'); // possible map styles, defaults to theme

  const { resolvedTheme } = useTheme(); // get current theme

  const mapRef = useRef<Maybe<MapRef>>(null);

  const mapProps = {
    width: '100%',
    height: '100%',
    className: 'rounded-lg',
    mapStyle: GetMapStyle(mapStyle, resolvedTheme),
    mapboxApiAccessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN, // MAPBOX API ACCESS TOKEN
  };

  const points = mapContext.placesQuery?.data?.places
    ?.filter(
      (place) =>
        place.posts.filter((post) => {
          const postDate = new Date(post.postDate).getFullYear(); // get post year
          return (
            postDate > mapContext.timeLimitation[0] &&
            postDate < mapContext.timeLimitation[1]
          ); // compare year with timeline limitations
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

  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points: points ?? [],
    zoom: mapContext.viewport.zoom,
    bounds: mapRef.current
      ? mapRef.current.getMap().getBounds().toArray().flat()
      : null,
    options: {
      radius: 75,
      maxZoom: 20,
    },
  });

  return (
    <>
      {/* SEARCH */}
      <div className="absolute z-40 top-4 left-4 w-96">
        <SearchLocation
          viewport={mapContext.viewport}
          setViewport={mapContext.setViewport}
        />
      </div>
      <ReactMapGL
        {...mapContext.viewport}
        {...mapProps}
        onViewportChange={(viewport: React.SetStateAction<IViewport>) =>
          mapContext.setViewport(viewport)
        }
        onInteractionStateChange={async (state: ExtraState) => {
          if (!state.isDragging) {
            {
              if (mapRef.current) {
                const bounds = ConvertBounds(
                  mapRef.current.getMap().getBounds()
                );
                mapContext.setBounds(bounds);

                await mapContext.placesQuery?.fetchMore({
                  variables: {
                    input: {
                      filter: {
                        maxLatitude: bounds.maxLatitude,
                        maxLongitude: bounds.maxLongitude,
                        minLatitude: bounds.minLatitude,
                        minLongitude: bounds.minLongitude,
                        exclude: mapContext.placesQuery.data?.places
                          .filter(
                            (place) =>
                              place.latitude > bounds.minLatitude &&
                              place.latitude < bounds.maxLatitude &&
                              place.longitude > bounds.minLongitude &&
                              place.longitude < bounds.maxLongitude
                          )
                          .map((place) => place.id),
                      },
                    },
                  },
                  updateQuery: (prev: any, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev; // if no new data, return prev data
                    const prevPlaces =
                      prev.places === undefined ||
                      prev.places.length === undefined
                        ? []
                        : prev.places;
                    // add new places
                    return {
                      places: [
                        ...prevPlaces,
                        ...fetchMoreResult.places.filter(
                          (place: any) =>
                            !prevPlaces.find((p: any) => p.id === place.id) // filter out duplicates
                        ),
                      ],
                    };
                  },
                });

                await mapContext.postsQuery?.fetchMore({
                  variables: {
                    input: {
                      filter: {
                        maxLatitude: bounds.maxLatitude,
                        maxLongitude: bounds.maxLongitude,
                        minLatitude: bounds.minLatitude,
                        minLongitude: bounds.minLongitude,
                      },
                    },
                  },
                  updateQuery: (prev: any, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev; // if no new data, return prev data
                    const prevPosts =
                      prev.posts.length === undefined ? [] : prev.posts;
                    // add new posts
                    return {
                      posts: [
                        ...prevPosts,
                        ...fetchMoreResult.posts.filter(
                          (post: any) =>
                            !prevPosts.find((p: any) => p.id === post.id) // filter out duplicates
                        ),
                      ],
                    };
                  },
                });
              }
            }
          }
        }}
        ref={(instance) => (mapRef.current = instance)}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          const filteredPlace = mapContext.placesQuery?.data?.places.find(
            (place) => place.id == cluster.id
          );

          return (
            <Marker
              key={cluster.id}
              place={{
                id: cluster.id,
                longitude,
                latitude,
                icon: isCluster ? undefined : filteredPlace?.icon, // return icon only if it's place (not cluster)
                preview: {
                  hash:
                    filteredPlace?.preview?.hash ?? cluster.properties.preview,
                },
              }}
              numberOfPlaces={pointCount}
              onClick={() => {
                if (!isCluster) {
                  // if it's not a cluster open place in sidebar and end function
                  mapContext.setSidebarPlace(cluster);
                  return;
                }
                // if it's a cluster zoom to see all places
                const expansionZoom = Math.min(
                  supercluster.getClusterExpansionZoom(cluster.id),
                  20
                );

                mapContext.setViewport({
                  ...mapContext.viewport,
                  latitude,
                  longitude,
                  zoom: expansionZoom,
                });
              }}
            />
          );
        })}

        <div className="absolute z-40 right-2 bottom-2">
          <MapStyleMenu
            setMapStyle={setMapStyle}
            viewport={mapContext.viewport}
          />
        </div>
      </ReactMapGL>
    </>
  );
};

export default MapGL;
