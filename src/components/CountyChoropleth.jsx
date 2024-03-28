import React, { useState, useCallback, useEffect, useRef } from 'react';
import Map, {Source, Layer} from 'react-map-gl';
import type {FillLayer} from 'react-map-gl';
import { fitBounds } from 'viewport-mercator-project';
import { format } from 'd3-format';

const USA_BOUNDS = [
    [-125, 24], // Southwest coordinates: [Longitude, Latitude]
    [-66, 49]   // Northeast coordinates: [Longitude, Latitude]
];

const percentFormat = format('.1%');

const CountyChoropleth = ({ mapboxToken, geojsonData }) => {

  const mapRef = useRef();

 const { longitude, latitude, zoom } = fitBounds({
    width: window.innerWidth > 1000? 1000: window.innerWidth,
    height: 500,
    bounds: USA_BOUNDS,
    padding: 20 // Optional padding around the bounds
  });

  const dataLayer = {
    id: 'data',
    type: 'fill',
    paint: {
      'fill-color': {
        property: 'index',
        stops: [
          [-10, 'red'],
          [0, '#FFFDD0'],
          [10, 'blue']
        ]
      },
      'fill-opacity': 0.8
    }
  };


  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback(event => {
    const {
      features,
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];

    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});

  }, []);

  useEffect(() => {

    const resizeMap = () => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.fitBounds(USA_BOUNDS, { padding: 20 });
      }
    };

    window.addEventListener('resize', resizeMap);
    resizeMap(); // Call resizeMap on component mount to fit bounds on load

    return () => {
      window.removeEventListener('resize', resizeMap);
    };
  }, []);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: latitude,
        longitude: longitude,
        zoom: zoom
      }}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={mapboxToken}
      interactiveLayerIds={['data']}
      onMouseMove={onHover}
    >
      <Source type="geojson" data={geojsonData}>
        <Layer {...dataLayer} />
      {hoverInfo && (
        <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
          <div>
            <div className="tooltip-header">
              <b>{hoverInfo.feature.properties.countyname} ({hoverInfo.feature.properties.legend_category})</b>
              <br />
              {hoverInfo.feature.properties.is_thriving === 1 && (<span style={{color:'#259299'}}>Thriving community</span>)}
              {hoverInfo.feature.properties.is_comparator === 1 && (<span style={{color:'#234FBF'}}>Comparator community</span>)}
            </div>
            <p>
            <em>Employment pct. change:</em> {percentFormat(hoverInfo.feature.properties.employed_pct_change)}
            <br />
            <em>Per capita income pct. change:</em> {percentFormat(hoverInfo.feature.properties.pci_pct_change)}
            <br />
            <em>Poverty population pct. change:</em> {percentFormat(hoverInfo.feature.properties.pop_poverty_status_determined_pct_change)}
            <br />
            <em>High school attainment pct. change:</em> {percentFormat(hoverInfo.feature.properties.highschool_or_higher_pct_change)}
            </p>
          </div>
        </div>
      )}
      </Source>
    </Map>
  );
};

export default CountyChoropleth;
