import React, { useEffect } from 'react';
import MapGL, {
  Marker,
  NavigationControl,
  ScaleControl,
  GeolocateControl,
  Source,
  Layer,
} from 'react-map-gl';
import { useState } from 'react';

const Map = (): JSX.Element => {
  const [coordinates, setCoordinates] = useState([21, 20]);

  useEffect(() => {
    console.log(coordinates);
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });

  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={`mapbox://styles/${process.env.NEXT_PUBLIC_MAPBOX_USER}/${process.env.NEXT_PUBLIC_MAPBOX_STYLE}`}
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        dragRotate={false}
      >
        <Source
          id="my-data"
          type="geojson"
          data={{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [15.80885168678962, 50.00860449080349, 223.7308519465193],
                [15.80104640732194, 50.01024256715091, 222.9379988761223],
                [15.796494247888, 50.01036337945131, 227.076665957387],
                [15.79619275053204, 50.01157835334854, 226.9024176028721],
                [15.79548303983097, 50.01237284092594, 225.8073318593927],
                [15.79586493677638, 50.01273476245584, 224.3676341473868],
                [15.79650072663578, 50.01570549183047, 222.153624489584],
                [15.79474200202066, 50.01991075795946, 221.6199024334989],
                [15.79453167448015, 50.02098363081252, 221.204057263762],
                [15.79448349512395, 50.02203434312539, 222.0447560842368],
                [15.79343589773531, 50.02288391952553, 222.1905669319124],
                [15.79259787374497, 50.02376798206613, 226.2159733692869],
                [15.79166251034508, 50.02538817884344, 230.4309073795969],
                [15.79085011042314, 50.02727410086904, 232.4537276642588],
                [15.79003227171153, 50.02992904049099, 228.0581270198452],
                [15.7893106483039, 50.03267169738318, 218.9740256433729],
                [15.78868777181239, 50.03402731886703, 218.3776000665963],
                [15.78895541753446, 50.03405892811207, 218.5829412187504],
                [15.79020735546355, 50.03429847182584, 218.5981683682073],
                [15.79031215973339, 50.03409921052374, 219.3230527097459],
                [15.79047609213314, 50.03413675297295, 218.9563853159455],
                [15.79063075085989, 50.03396039757391, 219.3835750123647],
              ],
            },
            properties: { id: '057594A7321C25382DD0', name: 'tripToSchool' },
          }}
        >
          <Layer
            {...{
              id: 'point',
              type: 'line',
              paint: { 'line-color': '#ff9900' },
            }}
          />
        </Source>

        <GeolocateControl
          style={{
            bottom: 128,
            right: 0,
            padding: '10px',
          }}
          positionOptions={{ enableHighAccuracy: true }}
        />

        <Marker key={1} latitude={50.089748} longitude={14.3984}>
          🏰
        </Marker>

        <NavigationControl
          style={{
            bottom: 36,
            right: 0,
            padding: '10px',
          }}
        />
        <ScaleControl style={{ bottom: 18, right: 0 }} />
      </MapGL>
    </>
  );
};

export default Map;
