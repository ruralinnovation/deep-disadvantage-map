import './App.css';
import React, { useState } from 'react';
import countyGeoJSON from './data/dd_pp_map.json';

import CountyChoropleth from './components/CountyChoropleth';


const MAPBOX_TOKEN = 'pk.eyJ1IjoicnVyYWxpbm5vIiwiYSI6ImNqeHl0cW0xODBlMm0zY2x0dXltYzRuazUifQ.zZBovoCHzLIW0wCZveEKzA';

const App = () => {

  return (
    <>
      <div className="App">
        <h1>Header test</h1>
        <div className="map-container">
          <CountyChoropleth mapboxToken={MAPBOX_TOKEN} geojsonData={countyGeoJSON} />
        </div>
      </div>
    </>
  );
};

export default App;
