﻿/*global app */
app.factory('mapService', ['ErrorService', 'locationService','$q',
function (ErrorService, locationService, $q) {
	var s = this;

	var cleanFloat = function (num) {
		return parseFloat(parseFloat(num).toFixed(6));
	};
	
	s.initMap = function (canvasElement, latitude, longitude) {
		s.directionsDisplay = new google.maps.DirectionsRenderer();
		s.mapMarkers = [];
		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoom: 12,
			center: new google.maps.LatLng(cleanFloat(latitude), cleanFloat(longitude))
		};
		s.googleMap = new google.maps.Map(canvasElement, mapOptions);
		s.directionsDisplay.setMap(s.googleMap);
	};

	s.centerMap = function (latitude, longitude) {
		s.googleMap.setCenter(new google.maps.LatLng(cleanFloat(latitude), cleanFloat(longitude)));
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
				deferred.resolve(results[0].formatted_address + '|' + cleanFloat(results[0].geometry.location.lat()) + '|' + cleanFloat(results[0].geometry.location.lng()));
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
				if (navigator.userAgent.search(/iPad|iPhone|iPod/i) != -1) {
					root = 'maps://?q=';
				} else if (navigator.userAgent.search(/Android/i) != -1) {
					root = 'geo:';
				} else {
					root = 'http://www.google.com/maps?q=';
				}
				deferred.resolve(root + cleanFloat(results[0].geometry.location.lat()) + ',' + cleanFloat(results[0].geometry.location.lng()));
			} else {
				deferred.reject(status);
			}
		});

		return deferred.promise;
	};

	s.clearPins = function () {
		angular.forEach(s.mapMarkers, function (pin, i) {
			if (typeof pin.setMap === 'function') {
				pin.setMap(null);
			}
		});
		//s.mapMarkers = [];
	};

	var addPin = function (geoType, location, callback) {
		var geocoder = new google.maps.Geocoder();
		var marker = {};
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
					s.mapMarkers.push(marker);

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
		var latlng = { lat: cleanFloat(lat), lng: cleanFloat(lon) };
		return addPin('location', latlng, callback);
	};

	return s;
}]);
