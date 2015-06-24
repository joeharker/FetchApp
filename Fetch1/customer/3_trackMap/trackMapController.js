/*global app */
app.controller('MapController', ['mapService', '$interval', '$timeout',
function (mapService, $interval, $timeout) {
	var c = this;

	c.googleMap = null;
	c.mapMarkers = [];

	c.initialize = function () {
		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoom: 12,
			center: new google.maps.LatLng(latitude, longitude)
		};
		c.googleMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		$interval(pulseLocations, 3000);
	};

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
		var data = mapServices.position;
		updateNearDevices(data.latitude, data.longitude);
	};

	//init
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp';
	document.body.appendChild(script);
	$timeout(c.initialize(), 1000);

	return c;
}]);
