/*global app */
app.factory('mapService', ['ErrorService', 'locationService','$q', '$rootScope',
function (ErrorService, locationService, $q, $rootScope) {
	var s = this;
	
	s.initMap = function (canvasElement, latitude, longitude) {
		s.directionsDisplay = new google.maps.DirectionsRenderer();
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
		var directionsService = new google.maps.DirectionsService();
		var deferred = $q.defer();
		var rout = { 'meters': 0, 'seconds': 0 };
		var request = {
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING
		};

		directionsService.route(request, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				if (s.directionsDisplay !== undefined) {
					s.directionsDisplay.setDirections(response);
				}
				for (var i = 0; i < response.routes[0].legs.length; i++) {
					rout.meters += response.routes[0].legs[i].distance.value;
					rout.seconds += response.routes[0].legs[i].duration.value;
				}
				deferred.resolve(rout);
			}else{
				deferred.reject(google.maps.DirectionsStatus);
			}
		});

		return deferred.promise;
	}

	s.cleanAddress = function(address){
		var geocoder = new google.maps.Geocoder();
		var deferred = $q.defer();

		geocoder.geocode({ 'address': address }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (s.googleMap !== undefined) {
					s.googleMap.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: s.googleMap,
						position: results[0].geometry.location
					});
				}
				deferred.resolve(results[0].formatted_address);
			} else {
				deferred.reject(status);
			}
		});

		return deferred.promise;
	};

	s.getGeo = function (address) {
		var geocoder = new google.maps.Geocoder();
		var deferred = $q.defer();

		geocoder.geocode({ 'address': address }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (s.googleMap !== undefined) {
					s.googleMap.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: s.googleMap,
						position: results[0].geometry.location
					});
				}
				var root = '';
				console.log(navigator.userAgent);
				if (navigator.userAgent.search(/(iPad)|(iPhone)|(iPod)/i) != -1) {
					root = 'maps:q=';
				//} else if (navigator.userAgent.search(/(Android)|(Chrome)/i) != -1) {
				//	root = 'geo:q=';
				} else {
					root = 'http://maps.google.com?q=';
				}
				deferred.resolve(root + results[0].formatted_address.replace(/ /g, '+'));
			} else {
				deferred.reject(status);
			}
		});

		return deferred.promise;
	};

	s.addPin = function (address, callback) {
		var geocoder = new google.maps.Geocoder();

		geocoder.geocode({ 'address': address }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (s.googleMap !== undefined) {
					var marker = new google.maps.Marker({
						map: s.googleMap,
						position: results[0].geometry.location
					});

					google.maps.event.addListener(marker, 'click', function () {
						callback();
					});
				}
			}
		});
	};

	return s;
}]);
