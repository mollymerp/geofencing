'use strict';

// global mapboxgl 
window.mapboxgl = require('mapbox-gl');
// included modules

var fs = require('fs');
var path = require('path');

// dependency modules
var turf = require('turf');
var d3 = require('d3');

var zones = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zone.geojson'), 'utf8'));
var buffered = turf.buffer(zones, 50, 'feet');
module.exports = buffered;

// custom modules
var map = require('./map');
var getPath = require('./getPath');
var makeCar = require('./createCar');

map.on('style.load', function() {
  // initialize the congestion zone data and layer
  map.addSource('zone', {
    type: 'geojson',
    data: buffered
  });

  map.addLayer({
    id: 'zone-polygons',
    source: 'zone',
    type: 'fill',
    paint: {
      'fill-color': 'cyan',
      'fill-opacity': .2,
      'fill-outline-color': 'white'
    }
  })

  var svg = d3.select('#overlay').append('svg');
  makeCar(10);
}) // closes on('style.load') event listener
