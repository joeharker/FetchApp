/*global app */
app.factory('mapService', ['ErrorService', 'locationService','$q',
function (ErrorService, locationService, $q) {
	var s = this;
	
	s.initMap = function (canvasElement, latitude, longitude) {
		s.directionsDisplay = new google.maps.DirectionsRenderer();
		s.directionsService = new google.maps.DirectionsService();
		s.mapMarkers = [];
		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoom: 12,
			center: new google.maps.LatLng(latitude, longitude)
		};
		s.googleMap = new google.maps.Map(canvasElement, mapOptions);
		s.directionsDisplay.setMap(s.googleMap);
	};

	s.centerMap = function (latitude, longitude) {
		s.googleMap.setCenter(new google.maps.LatLng(latitude, longitude));
	};

	s.calculateRoute = function (start, end) {
		var deferred = $q.defer();
		var rout = { 'distance': 0, 'duration': 0 };
		var request = {
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING
		};

		s.directionsService.route(request, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				s.directionsDisplay.setDirections(response);
				for (var i = 0; i < response.routes[0].legs.length; i++) {
					rout.distance += response.routes[0].legs[i].distance.value;
					rout.duration += response.routes[0].legs[i].duration.value;
				}
				deferred.resolve(rout);
			}else{
				deferred.reject(rout);
			}
		});

		return deferred.promise;
	}

	s.cleanAddress = function(address){
		//TODO
	};

	return s;
}]);
