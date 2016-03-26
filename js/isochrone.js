const MapboxClient = require('mapbox');
const turf = require('turf');


mapboxgl.accessToken = 'pk.eyJ1IjoibW9sbHltZXJwIiwiYSI6ImNpbTZ0anJ4OTAwNnp1b20wODM5d3RocXQifQ.jbnZRtdaCjOV8jCV6AemBA';
const mapboxClient = new MapboxClient(mapboxgl.accessToken);

/**
 * Adds gets an hexagonal isochrone polygon for a given origin and time limit
 *
 * @param {array} origin coorinates of origin in [lng, lat]
 * @param {number} timelimit amount of time in minutes
 * @param {number} resolution number of points in net
 * @returns {Polygon} 
 */
function isochrone(origin, timelimit, resolution) {
  // max speed in the distance api is 5 km/hr

  let rotation_degrees = 360 / resolution;
  let iso_features = [];
  let valid_points = {};
  let radius = timelimit / 60 * 5;
  let net_grid = getNet(origin, radius, rotation_degrees);
  return getDurations(origin, net_grid)
    .then(function(res) {
      let durations=[];
      if (res.code && res.code === "Ok") {
        // get rid of 0 duration from origin --> origin
        durations = res.durations[0].slice(1);
      } else if (res.length) {
        // if there were more than 100 points, and thus multiple response promises, reduce down to a single array
        durations = res.reduce(function(a, b) {
          return a.concat(b.durations[0].slice(1));
        }, []);
      } else {
        console.error('error getting directions')
      }
      let to_hex = turf.featurecollection([]);
      net_grid.features.forEach((feat, i) => {
        if (durations[i] / 60 <= timelimit) {
          to_hex.features.push(feat);
        }
      })
      // console.log(turf.hexGrid(turf.extent(to_hex), .1, 'kilometers'));
      return to_hex;
    })

}

module.exports = isochrone;

function getDurations(origin, net) {
  if (net.features.length > 99) {
    let distance_calls = [];
    for (var i = 0; i < Math.ceil(net.features.length / 99); i++) {
      distance_calls.push([origin, ...net.features.slice(i * 99, (i + 1) * 99).map(pt => pt.geometry.coordinates)]);
    }
    let calls = distance_calls.length;
    let promises = distance_calls.map(arr => mapboxClient.getDistances(arr, { profile: 'walking' }));
    return Promise.all(promises);
  } else {
    let points = [origin, ...net.features.map(feat => feat.geometry.coordinates)]
    return mapboxClient.getDistances(points, { profile: 'walking' });
  }
}

function getNet(origin, radius, rotation_degrees) {
  let net = turf.featurecollection([]);

  for (let i = 0; i < 360 / rotation_degrees; i++) {
    net.features.push(turf.destination(turf.point(origin), radius, i * rotation_degrees, 'kilometers'));
  }
  let outer_ring = turf.featurecollection([turf.convex(net)]);
  let extent = turf.extent(outer_ring);
  let point_grid = turf.pointGrid(extent, .1, 'kilometers');

  return turf.within(point_grid, outer_ring);

}