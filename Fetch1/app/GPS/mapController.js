/*global app */
app.controller('MapController', ['locationService', '$interval', '$timeout', 'mapService',
function (locationService, $interval, $timeout, mapService) {
	var c = this;

	var location = locationService.position;
	mapService.initMap(document.getElementById('map-canvas'), location.latitude, location.longitude);

	c.calculateRoute = function (start, end) {
		mapService.calculateRoute(start, end)
		.then(function (rout) {
		}, function (reason) {
		});
	};

	c.addPin = function (address, ngexperession) {
		mapService.addPin(address, ngexperession);
	};

	return c;
}]);
