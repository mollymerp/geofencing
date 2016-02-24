var d3 = require('d3');
var turf = require('turf');
var getPath = require('./getPath');
var map = require('./map');
var zone = require('./index')

var cars = {},
  total = 0,
  current = 0;

module.exports = function(num) {
  for (var i = 0; i < num; i++) {
    getPath().then(function(path_info) {
      cars[++j] = { inside: false, ever: false };
      var route = turf.linestring(path_info.routes[0].geometry.coordinates);
      createCar(path_info.origin)
        .transition()
        .duration(10000)
        .attrTween('transform', translateAlong(route, j))
        .remove();
    });
  };
}

function createCar(origin, color) {
  var color = getRandomColor();
  var new_car = d3.select('svg')
    .append('circle')
    .attr('transform', function() {
      var pixelCoords = map.project(origin.geometry.coordinates);
      return 'translate(' + pixelCoords.x + ',' + pixelCoords.y + ')';
    });
  return new_car;
}

function translateAlong(path, j) {
  var l = turf.lineDistance(path, 'kilometers');
  return function(d, i, a) {
    var car = d3.select(this);
    return function(t) {
      var ring = car.classed('ring');
      // t is time as as % of total transition duration
      var p = turf.along(path, t * l, 'kilometers');
      if (!cars[j].inside && turf.inside(p, zone.features[0])) {
        cars[j].inside = true;
        car.classed('inzone', true);
        increment('current');
        if (!cars[j].ever) {
          cars[j].ever = true;
          car.classed('enter', true);
          increment('total');
        }
      } else if (cars[j].inside && !turf.inside(p, zone.features[0])) {
        car.classed('inzone', false);
        cars[j].inside = false;
        decrement('current');
      }
      if (t === 1) {
        delete cars[j];
        if (turf.inside(p, zone.features[0])){
          decrement('current');
        }
      }
      var pixelCoords = map.project(p.geometry.coordinates);
      return 'translate(' + pixelCoords.x + ',' + pixelCoords.y + ')';
    };
  };
}


var metrics = { 'total': total, 'current': current };

function increment(metric) {
  d3.select('.' + metric + '-vehicles').text(++metrics[metric]);
  if (metric === 'total') {
    d3.select('.total-revenue').text(metrics[metric] * 5);
  }
}

function decrement(metric) {
  d3.select('.' + metric + '-vehicles').text(--metrics[metric]);
}
