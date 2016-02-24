var d3 = require('d3');
var turf = require('turf');
var q = require('q');
module.exports = function(callback) {
  // returns a start and end point, as well as a path connecting them. 
  var defer = q.defer();
  var endpoints = getStartEnd().join(';');
  var directions_url = 'https://api.tiles.mapbox.com/v4/directions/mapbox.driving/' + endpoints + '.json?access_token=' + mapboxgl.accessToken;
  d3.json(directions_url, function(error, json) {
    defer.resolve(json);
  });
  return defer.promise;
}


// gets two random points within London
function getStartEnd() {
  var london_border_len = turf.lineDistance(london_border, 'kilometers');
  var points = [turf.along(london_border, Math.random() * london_border_len, 'kilometers'), turf.along(london_border, Math.random() * london_border_len, 'kilometers')];
  return points.map(function(feat) {
    return feat.geometry.coordinates;
  })
}


var london_border = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [-0.26882171630859375,
        51.55252630304316
      ],
      [-0.02780914306640625,
        51.55273977957101
      ],
      [-0.0226593017578125,
        51.455504458873776
      ],
      [-0.2756881713867187,
        51.45422084861252
      ],
      [-0.270538330078125,
        51.551885867448604
      ]
    ]
  }
}

// // gets two random points within London
// function getStartEnd() {
//   var points = turf.random('point', 2, { bbox: [-0.02300262451171875, 51.453792970504495, -0.26882171630859375, 51.55167238691343] });
//   // returns an object with start and end properties
//   return points.features.map(function(feat) {
//     return feat.geometry.coordinates;
//   })

// }
