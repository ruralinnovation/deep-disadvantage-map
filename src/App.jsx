import './App.css';
import React, { useState, useCallback, useMemo } from 'react';
import Map, {Source, Layer} from 'react-map-gl';
import countyGeoJSON from './data/dd_pp_map.json';
import type {FillLayer} from 'react-map-gl';

export const dataLayer: FillLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': {
      property: 'index',
      stops: [
        [-10, 'red'],
        [0, 'white'],
        [10, 'blue']
      ]
    },
    'fill-opacity': 0.8
  }
};

const MAPBOX_TOKEN = 'pk.eyJ1IjoicnVyYWxpbm5vIiwiYSI6ImNqeHl0cW0xODBlMm0zY2x0dXltYzRuazUifQ.zZBovoCHzLIW0wCZveEKzA';

const App = () => {

  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 2,
  });

  const [hoverInfo, setHoverInfo] = useState(null);
  const selectedCounty = (hoverInfo && hoverInfo.feature.properties.fips) || '';
  const filter = useMemo(() => ['in', 'fips', selectedCounty], [selectedCounty]);

  const onHover = useCallback(event => {
    const {
      features,
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];

    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});

  }, []);

  return (
    <>
      <div className="App">
        <Map
          initialViewState={{
            latitude: 40,
            longitude: -100,
            zoom: 3
          }}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
          interactiveLayerIds={['data']}
          onMouseMove={onHover}
        >
          <Source type="geojson" data={countyGeoJSON}>
            <Layer {...dataLayer} />
{/*            <Layer {...{
              id: 'hover-highlight',
              source: 'county_geojson_test',
              type: 'line',
              paint: {
                'line-color': 'black',
                'line-width': 2
              }
            }} filter={filter} />*/}
          </Source>
          {hoverInfo && (
            <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
              <div>
                <b>{hoverInfo.feature.properties.countyname}</b>
                <br />
                {hoverInfo.feature.properties.legend_category}
              </div>
            </div>
          )}
        </Map>
      </div>
    </>
  );
};

export default App;
