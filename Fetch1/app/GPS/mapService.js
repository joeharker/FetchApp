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
				deferred.resolve(results[0].formatted_address + '|' + results[0].geometry.location.G + '|' + results[0].geometry.location.K);
			} else {
				deferred.reject(status);
			}
		});

		return deferred.promise;
	};

	s.getGeoUrl = function (address) {
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
				if (navigator.userAgent.search(/(iPad)|(iPhone)|(iPod)/i) != -1) {
					root = 'maps://?q=';
				} else if (navigator.userAgent.search(/(Android)/i) != -1) {
					root = 'geo:';
				} else {
					root = 'http://www.google.com/maps?q=39.470659,-105.067905';
				}
				console.log(root + results[0].geometry.location.G.toFixed(6) + ',' + results[0].geometry.location.K.toFixed(6));
				deferred.resolve(root + results[0].geometry.location.G.toFixed(6) + ',' + results[0].geometry.location.K.toFixed(6));
			} else {
				deferred.reject(status);
			}
		});

		return deferred.promise;
	};

	var addPin = function (geoType, location, callback) {
		var geocoder = new google.maps.Geocoder();
		var marker = new google.maps.Marker();
		var geo = {};

		if (geoType === 'address') {
			geo = { 'address': location };
		} else {
			geo = { 'location': location };
		}

		geocoder.geocode(geo, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (s.googleMap !== undefined) {
					marker = new google.maps.Marker({
						map: s.googleMap,
						position: results[0].geometry.location
					});

					google.maps.event.addListener(marker, 'click', function () {
						callback();
					});
				}
			}
		});

		return marker;
	};

	s.addPinAddress = function (address, callback) {
		return addPin('address', address, callback);
	};

	s.addPinLatLon = function (lat, lon, callback) {
		var latlng = { lat: parseFloat(lat), lng: parseFloat(lon) };
		return addPin('location', latlng, callback);
	};

	return s;
}]);
