var concaveman = require('concaveman');
var turf = require('turf');

function hexagonify(feature, result, cell, units, triangles, concaveman, threshold) {
  if (feature.features) {
    for (var i = 0; i < feature.features.length; i++) {
      result = hexagonify(feature.features[i], result);
    }
  } else {
    var bbox = turf.extent(feature);
    var hexagons = turf.hexgrid(bbox, cell, units, triangles);
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
  for (var i = 0, prev; i < array.length; i++) {
    if (!prev || (prev[0] === array[i][0] && prev[1] === array[i][1])) unique.push(array[i]);
    prev = array[i];
  };

  var hull = concaveman(unique, concavity, threshold);
  var result = JSON.parse('{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[' + JSON.stringify(hull) + ']}}');
  return result;
}