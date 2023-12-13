import './App.css';
import React, { useState } from 'react';
import countyGeoJSON from './data/dd_pp_map.json';

import CountyChoropleth from './components/CountyChoropleth';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { filter } from 'd3';

const theme = createTheme({
    typography: {
        fontFamily: 'Bitter, TT Hoves, Helvetica, Arial',
    },
    palette: {
        primary: {
            main: '#00835D',
            light: '#A3E2B5',
            dark: '#26535C',
            contrastText: 'white',
        },
    },
});


const thriving_communities = [
  "48347",
  "48471",
  "01109",
  "13031",
  "28105",
  "28081",
  "28071",
  "37195",
  "22069",
  "35055"
]

const comparator_communities = [
  "48001",
  "48005",
  "01005",
  "13175",
  "28101",
  "28149",
  "28087",
  "37107",
  "22101",
  "35017"
]

console.log(countyGeoJSON.features[1]);

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
      let rural_features = countyGeoJSON.features.filter(d => d.properties.rural === 1);
      let rural_data = {type: "FeatureCollection", features: rural_features};
      setData(rural_data);
    }

    if (event.target.value === "thriving") {
      let thriving_features = countyGeoJSON.features.filter(d => thriving_communities.includes(d.properties.fips));
      console.log("thriving ", thriving_features);
      let thriving_data = {type: "FeatureCollection", features: thriving_features};
      setData(thriving_data);
    }

    if (event.target.value === "comparator") {
      let comparator_features = countyGeoJSON.features.filter(d => comparator_communities.includes(d.properties.fips));
      console.log("comparator ", comparator_features);
      let comparator_data = {type: "FeatureCollection", features: comparator_features};
      setData(comparator_data);
    }


  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="App">
          <div className="controls">
            <h1>Deep disadvantage by county</h1>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
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
                <FormControlLabel value="thriving" control={<Radio />} label="Thriving" />
                <FormControlLabel value="comparator" control={<Radio />} label="Comparator" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="map-container">
            <CountyChoropleth mapboxToken={MAPBOX_TOKEN} geojsonData={data} />
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
