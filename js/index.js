'use strict';

/*global mapboxgl*/
window.mapboxgl = require('mapbox-gl');
const isochrone = require('./isochrone');
const hexagonify = require('./hexagonify');
const concaveman = require('concaveman');
const turf = require('turf');
/* eslint-disable no-loop-func */
mapboxgl.accessToken = 'pk.eyJ1IjoibW9sbHltZXJwIiwiYSI6ImNpbTZ0anJ4OTAwNnp1b20wODM5d3RocXQifQ.jbnZRtdaCjOV8jCV6AemBA';


var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/light-v8', //stylesheet location
  center: [-122.43357135073379, 37.75846], // starting position
  zoom: 14 // starting zoom
});

//feature, result, cell, triangles, threshold

isochrone([-122.43357135073379, 37.75846], 40, 5)
.then(function(result) {
  // console.log(JSON.stringify(turf.concave(result, .2, 'kilometers')));
  // console.log(JSON.stringify(hexagonify(turf.concave(result, .2, 'kilometers'), null, .1, null, .5)))
  let points = result.features.map(feat => feat.geometry.coordinates);
  console.log(JSON.stringify(turf.featurecollection([turf.polygon(concaveman(points))])));
})
