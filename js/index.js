'use strict';

/*global mapboxgl*/
window.mapboxgl = require('mapbox-gl');
const isochrone = require('./isochrone');

/* eslint-disable no-loop-func */
mapboxgl.accessToken = 'pk.eyJ1IjoibW9sbHltZXJwIiwiYSI6ImNpbTZ0anJ4OTAwNnp1b20wODM5d3RocXQifQ.jbnZRtdaCjOV8jCV6AemBA';


var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/light-v8', //stylesheet location
  center: [-122.43357135073379, 37.75846], // starting position
  zoom: 14 // starting zoom
});


isochrone([-122.43357135073379, 37.75846], 20, 5);