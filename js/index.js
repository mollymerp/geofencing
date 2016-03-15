'use strict';

// global mapboxgl 
window.mapboxgl = require('mapbox-gl');
// included modules

var fs = require('fs');
var path = require('path');

// dependency modules
var turf = require('turf');
var d3 = require('d3');

var zones = JSON.parse(fs.readFileSync(path.join(__dirname, '../zone.geojson'), 'utf8'));
var buffered = turf.buffer(zones, 200, 'feet');
module.exports = turf.merge(buffered);

// custom modules
var map = require('./map');
// var minimap = require('./minimap');
var getPath = require('./getPath');
var makeCar = require('./createCar');

map.on('style.load', function() {
    // initialize the congestion zone data and layer
    map.addSource('zone', {
      type: 'geojson',
      data: turf.merge(buffered)
    });


    map.addLayer({
      id: 'zone-line',
      source: 'zone',
      type: 'line',
      paint: {
        'line-width': 5,
        'line-opacity': .5,
        'line-color': '#C96F16'
      }
    });

    var openMobileNotifications = d3.select(".notifications-button-mobile");
    var closeMobileNotifications = d3.select(".icon.big.close");
    var mobileTicker = d3.select(".mobile-notifications-container");
    openMobileNotifications.on('click', function () {
      mobileTicker.classed('show', true);
    });
    closeMobileNotifications.on('click', function () {
      mobileTicker.classed("show", false);
    })


    // set up svg canvas
    d3.select('#overlay').append('svg');

    makeCar(3);
    setInterval(function() {
      makeCar(3);
    }, 2000);
  }) // closes on('style.load') event listener
