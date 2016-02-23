var d3 = require('d3');
var turf = require('turf');
var getPath = require('./getPath');
var map = require('./map');
var zone = require('./index')

var cars = {},
  total = 0,
  current = 0;

module.exports = function(num) {
  getPath(num).then(function(path_info) {
    path_info.forEach(function(d, i) {
      cars[i] = { inside: false, ever: false };
      cars[i+num] = {inside: false, ever: false};   
    });

    var rings_g = d3.select('g');

    // create 
    var car_group = d3.select('svg')
      .selectAll('circle')
      .data(path_info)
      .enter()
      .append('circle')
      .attr('transform', function(d) {
        var pixelCoords = map.project(d.origin.geometry.coordinates);
        return 'translate(' + pixelCoords.x + ',' + pixelCoords.y + ')';
      })
      .transition()
      .duration(10000)
      .attrTween('transform', translateAlong())
      .remove();

    // create an extra circle on top for the ring animation
    car_group.each(function(c, k) {
      rings_g.append('circle')
        .attr("class", "ring")
        .attr('transform', function() {
          var pixelCoords = map.project(c.origin.geometry.coordinates);
          return 'translate(' + pixelCoords.x + ',' + pixelCoords.y + ')';
        })
        .transition()
        .duration(10000)
        .attrTween('transform', translateAlong(c,k))
        .remove();
    });

        
        
  });
}

function translateAlong(dat, k) {
  return function(d, i, a) {
    d = d || dat;
    i = k+10 || i;
    var path = turf.linestring(d.routes[0].geometry.coordinates);
    var l = turf.lineDistance(path, 'kilometers');
    var car = d3.select(this);
    return function(t) {
      var ring = car.classed('ring');
      // t is time as as % of total transition duration
      var p = turf.along(path, t * l, 'kilometers');
      // if the car was outside the congestion zone, but now is in the congestion zone.
      if (!cars[i].inside && turf.inside(p, zone)) {
        cars[i].inside = true;
        ring ? null : car.classed('inzone', true);
        ring ? null : increment('current');

        if (!cars[i].ever) {
          ring ? car.classed('enter', true) : car.classed('inzone', true);
          cars[i].ever = true;
          ring ? null : increment('total');
        }
      } else if (cars[i].inside && !turf.inside(p, zone)) {
        ring ? car.classed('enter', false) : car.classed('inzone', false);

        cars[i].inside = false;
        ring ? null : decrement('current');
      }
      if (t === 1 && turf.inside(p, zone)) {
        ring ? null : decrement('current');
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
