/*global app */
app.factory('locationService', ['ErrorService',
function (ErrorService) {
	var s = this;
	var watchPositionOptions = { enableHighAccuracy: true };

	//initialization is the denver city building and ends in 911 and 311
	s.initLat = 39.738911;
	s.initLon = -104.990311;
	s.position = {	
		latitude: s.initLat,
		longitude: s.initLon
	};

	var watchPositionSuccess = function (position) {
		s.position = {
			latitude: parseFloat(position.coords.latitude).toFixed(6),
			longitude: parseFloat(position.coords.longitude).toFixed(6)
		};
	};

	var watchPositionFail = function (error) {
	    alert("Please turn on your GPS to continue");
	    ErrorService.reportError("getCurrentPosition error", JSON.stringify(error));
	};

	navigator.geolocation.watchPosition(watchPositionSuccess, watchPositionFail, watchPositionOptions);

	return s;
}]);
