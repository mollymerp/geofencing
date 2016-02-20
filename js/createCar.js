var d3 = require('d3');
var turf = require('turf');
var getPath = require('./getPath');
var map = require('./map');
var zone = require('./index')

var cars = {},
  j = 0,
  total = 0,
  current = 0;

function getRandomColor() {
  var colors = d3.scale.category20().range();
  var max = colors.length - 1
  return colors[Math.floor(Math.random() * max)];
}


module.exports = function(num) {
  for (var i = 0; i < num; i++) {
    getPath().then(function(path_info) {
      cars[j] = { inside: false, ever: false };
      var route = turf.linestring(path_info.routes[0].geometry.coordinates);
      createCar(path_info.origin)
        .transition()
        .duration(10000)
        .attrTween('transform', translateAlong(route, j))
        .remove();
      j++;
    });

  }
}

function createCar(origin, color) {
  var color = getRandomColor();
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

function translateAlong(path, j) {
  var l = turf.lineDistance(path, 'kilometers');
  return function(d, i, a) {
    return function(t) {
      // t is time as as % of total transition duration
      var p = turf.along(path, t * l, 'kilometers');
      if (!cars[j].inside && turf.inside(p, zone.features[0])) {
        cars[j].inside = true;
        increment('current');
        if (!cars[j].ever) {
          cars[j].ever = true;
          increment('total');
        }
      } else if (cars[j].inside && !turf.inside(p, zone.features[0])) {
        cars[j].inside = false;
        decrement('current');
      }
      if (t === 1 && turf.inside(p, zone.features[0])) {
        decrement('current');
      }
      var pixelCoords = map.project([p.geometry.coordinates[0], p.geometry.coordinates[1]]);
      return 'translate(' + pixelCoords.x + ',' + pixelCoords.y + ')';
    };
  };
}

var metrics = { 'total': total, 'current': current };

function increment(metric) {
  d3.select('.'+metric + '-vehicles').text(++metrics[metric]);
  if (metric === 'total') {
    d3.select('.total-revenue').text(metrics[metric] * 5);
  }
}

function decrement(metric) {
  d3.select('.'+metric + '-vehicles').text(--metrics[metric]);
}
