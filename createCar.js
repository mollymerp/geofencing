var getPath = require('./getPath');
var map = require('./map');
var d3 = require('d3');
var turf = require('turf');

module.exports = function() {
  getPath()
    .then(function(path_info) {
      var route = turf.linestring(path_info.routes[0].geometry.coordinates);
      console.log(route);
      var car = createCar(path_info.origin, 'purple').transition()
        .duration(10000)
        .attrTween('transform', translateAlong(route))
        .remove();
    });
}

function createCar(origin, color) {
  var new_car = d3.select('svg')
    .append('circle')
    .attr('r', 7)
    .attr('fill', color)
    .attr('transform', function() {
      var pixelCoords = map.project(origin.geometry.coordinates);
      return 'translate(' + pixelCoords.x + ',' + pixelCoords.y + ')';
    });
  return new_car;
}

function translateAlong(path) {
  var l = turf.lineDistance(path, 'kilometers');
  return function(d, i, a) {
    return function(t) {
      // t is time as as % of total transition duration
      var p = turf.along(path, t * l, 'kilometers');
      var pixelCoords = map.project([p.geometry.coordinates[0], p.geometry.coordinates[1]]);
      return 'translate(' + pixelCoords.x + ',' + pixelCoords.y + ')';
    };
  };
}
