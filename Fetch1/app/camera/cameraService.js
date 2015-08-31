/*global app */
app.factory('cameraService', ['ErrorService','$q',
function (ErrorService, $q) {
	var s = this;

	s.deferred = $q.defer();
	
	s.onSuccess = function (imageData) {
		s.deferred.resolve("data:image/jpeg;base64," + imageData);
	};

	s.onFail = function (message) {
		s.deferred.reject("photo error "+ message);
	};

	s.takePhoto = function () {
		if (navigator.camera === undefined) {
			alert("your phone does not appear to suport photos");
		} else {
			navigator.camera.getPicture(s.onSuccess, s.onFail, {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URL
			});
		}

		return s.deferred.promise;
	};

	return s;
}]);
