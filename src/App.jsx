import './App.css';
import React, { useState } from 'react';
import countyGeoJSON from './data/dd_pp_map_01_08.json';

import CountyChoropleth from './components/CountyChoropleth';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';

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

  const [data, setData] = useState({type: "FeatureCollection", features: countyGeoJSON.features.filter(d => d.properties.rural === 1)});
  // const [filter, setFilter] = useState("all");

  const [filter_state, setFilterState] = useState({
    thriving: false,
    comparator: false,
  });

  const handleChange = (event) => {

    let updated_filter_state = ({
      ...filter_state,
      [event.target.name]: event.target.checked,
    });

    setFilterState(updated_filter_state);


    let updated_features = countyGeoJSON.features.filter(function(d) {

      if (d.properties.rural === 0) {
        return false;
      }

      if (updated_filter_state["thriving"] === false && updated_filter_state["comparator"] === false) {
        return true;
      }
      else {
        if (thriving_communities.includes(d.properties.fips) && updated_filter_state["thriving"] === true) {
          return true;
        }

        if (comparator_communities.includes(d.properties.fips) && updated_filter_state["comparator"] === true) {
          return true;
        }
      }

      return false;

    }) 

    let updated_data = {type: "FeatureCollection", features: updated_features};

    console.log(updated_features.length);

    setData(updated_data);

  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="App">
          <div className="map-header-footer">
            <h1>Index of deep disadvantage</h1> 
            <h2>For rural counties</h2>
            <div className="controls">
              <FormLabel className="controls-label" component="legend">Filter to:</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filter_state.thriving}
                      onChange={handleChange}
                      name="thriving"
                    />
                  }
                  label="Thriving communities"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filter_state.comparator}
                      onChange={handleChange}
                      name="comparator"
                    />
                  }
                  label="Comparator communities"
                />
              </FormGroup>
            </div>
            <div className="cont-legend">
              <p className="start-label">Most Disadvantaged</p>
              <div  style={{"background": "linear-gradient(to right, red, #FFFDD0, blue)"}} >
              </div>
              <p className="end-label">Most Advantaged</p>
            </div>
          </div>
          <div className="map-container">
            <CountyChoropleth mapboxToken={MAPBOX_TOKEN} geojsonData={data} />
          </div>
          <div className="map-header-footer">
            <p>Source: 2022 ACS 5-year estimates</p>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
