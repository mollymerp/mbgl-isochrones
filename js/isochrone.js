const MapboxClient = require('mapbox');
const turf = require('turf');

// const mapboxClient = new MapboxClient(mapboxgl.accessToken);

/**
 * Adds gets an hexagonal isochrone polygon for a given origin and time limit
 *
 * @param {array} origin coorinates of origin in [lng, lat]
 * @param {number} timelimit amount of time in minutes
 * @param {number} resolution number of points in net
 * @returns {Polygon} 
 */
function isochrone(origin, timelimit, resolution) {
    // max speed in the distance api is 5 km/hr, this will give us a radius in km with a .1 km/hr buffer
    let radius = timelimit / 60 * 5.1;
    let net = turf.featurecollection([]);
    let rotation_degrees = 360/resolution
    for (let i = 0; i< rotation_degrees; i++) {
      net.features.push(turf.destination(turf.point(origin), radius, i * rotation_degrees, 'kilometers'));
    }

} 

module.exports = isochrone;

function distance_req(origin, net, cb) {
  
}