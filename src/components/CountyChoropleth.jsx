import React from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';

const CountyChoropleth = ({ mapboxToken, geojsonData, colorAttribute }) => {
  const [viewport, setViewport] = React.useState({
    width: '100%',
    height: '100%',
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 5,
  });


  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={"pk.eyJ1IjoicnVyYWxpbm5vIiwiYSI6ImNscTFjcWtkNjA3bGUya245bTBwdHg3ODQifQ.DcmJmjUsLiqijZdetPfcxQ"}
      onViewportChange={(newViewport) => setViewport(newViewport)}
    >
      <Source type="geojson" data={geojsonData}>
        <Layer
          id="counties"
          type="fill"
          paint={{
            'fill-color': "red",
            'fill-opacity': 0.7
          }}
        />
      </Source>
    </ReactMapGL>
  );
};

export default CountyChoropleth;
