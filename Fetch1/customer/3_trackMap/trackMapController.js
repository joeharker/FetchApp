/*global app */
app.controller('MapController', ['locationService', '$interval', '$timeout', 'mapService',
function (locationService, $interval, $timeout, mapService) {
	var c = this;

	var location = locationService.position;
	mapService.initMap(document.getElementById('map-canvas'), location.latitude, location.longitude);
	$interval(function () { pulseLocations(); }, 3000);

	var updateNearDevices = function (latitude, longitude) {
		//mapServices.getNearDevices(latitude, longitude)
		//.then(function (data) {
		//	var marker;
		//	var infowindow;

		//	//clear old markers
		//	angular.forEach(c.mapMarkers, function (marker, i) {
		//		marker.setMap(null);
		//	});
		//	c.mapMarkers = [];

		//	//add new markers
		//	angular.forEach(data, function (device, i) {
		//		marker = new google.maps.Marker({
		//			map: c.googleMap,
		//			position: new google.maps.LatLng(device.lat, device.long),
		//			title: device.title
		//		});
		//		infowindow = new google.maps.InfoWindow({
		//			content: device.title
		//		});
		//		infowindow.open(c.googleMap, marker);
		//		c.mapMarkers.push(marker);
		//	});

			//center
		mapService.centerMap(latitude, longitude);

		//});
	};

	var pulseLocations = function () {
		var data = locationService.position;
		updateNearDevices(data.latitude, data.longitude);
	};

	c.calculateRoute = function (start, end) {
		mapService.calculateRoute(start, end)
		.then(function (rout) {
			console.log(rout);
		});
	};

	return c;
}]);
