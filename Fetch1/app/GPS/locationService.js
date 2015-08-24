/*global app */
app.factory('locationService', ['ErrorService',
function (ErrorService) {
	var s = this;
	var watchPositionOptions = { enableHighAccuracy: true };

	s.initLat = 39.738911;
	s.initLon = -104.990311;

	s.position = {	//initialization is the denver city building and ends in 911 and 311
		latitude: s.initLat,
		longitude: s.initLon
	};

	var watchPositionSuccess = function (position) {
		s.position = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		};
	};

	var watchPositionFail = function (error) {
		ErrorService.reportError("getCurrentPosition error", error.message);
	};

	navigator.geolocation.watchPosition(watchPositionSuccess, watchPositionFail, watchPositionOptions);

	return s;
}]);
