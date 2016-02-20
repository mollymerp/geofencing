/* eslint-disable no-loop-func */
mapboxgl.accessToken = 'pk.eyJ1IjoibW9sbHltZXJwIiwiYSI6ImNpazdqbGtiZTAxbGNocm0ybXJ3MnNzOHAifQ.5_kJrEENbBWtqTZEv7g1-w';

var bounds = [
  [-0.02300262451171875, 51.453792970504495], // Southwest coordinates
  [-0.26882171630859375, 51.55167238691343], // Northeast coordinates
];

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v8',
  center: [-0.15003204345703125, 51.50489601254001],
  zoom: 10.5,
  // hash: true,
  maxBounds: bounds
});

module.exports = map;