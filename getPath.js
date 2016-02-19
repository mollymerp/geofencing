var d3 = require('d3');
var turf = require('turf');

module.exports = function() {
  // returns a start and end point, as well as a path connecting them. 
  var start_end = getStartEnd();
  var endpoints = start_end.join(';');
  var directions_url = 'https://api.tiles.mapbox.com/v4/directions/mapbox.driving/' + endpoints + '.json?access_token=' + mapboxgl.accessToken;
  d3.json(directions_url, function(error, json) {
  });
}

// gets two random points within London
function getStartEnd() {
  var points = turf.random('point', 2, { bbox: [-0.02300262451171875, 51.453792970504495, -0.26882171630859375, 51.55167238691343] });
  // returns an object with start and end properties
  return points.features.map(function(feat) {
    return feat.geometry.coordinates;
  })

}
