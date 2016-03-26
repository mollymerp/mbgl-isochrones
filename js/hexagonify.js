// source: https://github.com/mapbox/isodist-bot 

var concaveman = require('concaveman');
var turf = require('turf');

module.exports = function hexagonify(feature, result, cell, triangles, threshold) {
  if (feature.features) {
    for (var i = 0; i < feature.features.length; i++) {
      result = hexagonify(feature.features[i], result);
    }
  } else {
    // console.log(feature, result);
    var bbox = turf.extent(feature);
    var hexagons = turf.hexGrid(bbox, .1, 'kilometers');
    // console.log(bbox, hexagons);
    var cellArea;
    var array = [];
    var unique = [];
    for (var i = 0; i < hexagons.features.length; i++) {
      var intersection = turf.intersect(hexagons.features[i], feature);
      if (!intersection) {
        continue;
      } else {
        for (var j = 0; j < hexagons.features[i].geometry.coordinates[0].length; j++) {
          if (!hexagons.features[i].geometry) {
            continue;
          } else {
            var vertex = hexagons.features[i].geometry.coordinates[0][j];
            array.push(vertex);
          }
        }
      }
    }
  }

  var array = array.sort();
  // console.log('array', array);
  for (var i = 0, prev; i < array.length; i++) {
    if (!prev || (prev[0] === array[i][0] && prev[1] === array[i][1])) unique.push(array[i]);
    prev = array[i];
  };
  // console.log("unique",unique)
  var hull = concaveman(unique, 2, 0);
  var result = JSON.parse('{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[' + JSON.stringify(hull) + ']}}');
  return result;
}