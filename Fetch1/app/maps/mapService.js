/*global app */
app.factory('mapService', ['ErrorService', '$http', '$q', 
function (ErrorService, $http, $q) {
	var s = this;
	var watchPositionOptions = { enableHighAccuracy: true };

	s.position = {	//initialization is the denver city building and ends in 911 and 311
		latitude: 39.738911,
		longitude: -104.990311
	};

	//s.getNearDevices = function (lat, lon) {
	//	var defered = $q.defer();

	//	if (authService.user != null) {
	//		$http.get('http://fetch1.azurewebsites.net/api/device?id=' + authService.user.id + '&lat=' + lat + '&lon=' + lon + '&title=' + authService.user.firstName)
	//		.success(function (data) {
	//			defered.resolve(data);
	//		})
	//		.error(function (data, status, headers, config, statusText) {
	//			defered.reject();
	//		});
	//	} else {
	//		defered.reject();
	//	}

	//	return defered.promise;
	//};

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
