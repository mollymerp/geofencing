var d3 = require('d3');
var turf = require('turf');
var q = require('q');
module.exports = function(num) {
  var currentPromise = q();
  var route_points = [];
  for (var i = 0; i < num; i++) {
    route_points.push(getStartEnd().join(';'));
  }

  return q.all(route_points.map(function(ep) {
    return getDirections(ep);
  }))
}


function getDirections(endpoints) {
  // returns a start and end point, as well as a path connecting them. 
  var defer = q.defer();
  var directions_url = 'https://api.tiles.mapbox.com/v4/directions/mapbox.driving/' + endpoints + '.json?access_token=' + mapboxgl.accessToken;
  d3.json(directions_url, function(error, json) {
    if (error) {
      console.log('error getting directions', error);
      defer.reject(error);
    } else {
      defer.resolve(json);
    }
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
