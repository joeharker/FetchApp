/*global app */
app.controller('MapController', ['locationService', '$interval', '$timeout',
function (locationService, $interval, $timeout) {
	var c = this;

	c.mapMarkers = [];
	var data = locationService.position;
	var mapOptions = {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 12,
		center: new google.maps.LatLng(data.latitude, data.longitude)
	};
	c.googleMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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
			c.googleMap.setCenter(new google.maps.LatLng(latitude, longitude));

		//});
	};

	var pulseLocations = function () {
		var data = locationService.position;
		updateNearDevices(data.latitude, data.longitude);
	};

	return c;
}]);
