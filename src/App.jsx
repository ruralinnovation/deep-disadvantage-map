import './App.css';
import React, { useState } from 'react';
import countyGeoJSON from './data/dd_pp_map.json';

import CountyChoropleth from './components/CountyChoropleth';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { filter } from 'd3';


const MAPBOX_TOKEN = 'pk.eyJ1IjoicnVyYWxpbm5vIiwiYSI6ImNqeHl0cW0xODBlMm0zY2x0dXltYzRuazUifQ.zZBovoCHzLIW0wCZveEKzA';

const App = () => {

  const [data, setData] = useState(countyGeoJSON);
  const [filter, setFilter] = useState("all");

  function handleChange(event) {

    setFilter(event.target.value);

    console.log("value is", event.target.value);

    if (event.target.value === "all") {
      setData(countyGeoJSON);
    }

    if (event.target.value === "rural") {
      let test = countyGeoJSON.features.filter(d => d.properties.rural === 1);
      let test2 = {type: "FeatureCollection", features: test};
      console.log(test2);
      setData(test2);
    }

  }

  return (
    <>
      <div className="App">
        <div className="controls">
          <h1>Deep disadvantage</h1>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Filter</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              defaultValue="all"
              name="row-radio-buttons-group"
              value={filter}
              onChange={handleChange}
            >
              <FormControlLabel value="all" control={<Radio />} label="All" />
              <FormControlLabel value="rural" control={<Radio />} label="Rural" />
              <FormControlLabel value="selected" control={<Radio />} label="Selected" />
              <FormControlLabel value="comparator" control={<Radio />} label="Comparator" />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="map-container">
          <CountyChoropleth mapboxToken={MAPBOX_TOKEN} geojsonData={data} />
        </div>
      </div>
    </>
  );
};

export default App;
