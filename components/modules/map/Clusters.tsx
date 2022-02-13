import IMapContext from '@lib/types/contexts/MapContext';
import React from 'react';

import Marker from './Marker';

interface ClustersProps {
  clusters: any;
  supercluster: any;
  mapContext: IMapContext;
}

const Clusters: React.FC<ClustersProps> = ({
  clusters,
  supercluster,
  mapContext,
}) => {
  return (
    <>
      {clusters.map((cluster: any) => {
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
    </>
  );
};

export default Clusters;
