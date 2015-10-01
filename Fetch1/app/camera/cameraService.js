﻿/*global app */
app.factory('cameraService', ['ErrorService','$q',
function (ErrorService, $q) {
	var s = this;

	s.quality = 50;
	s.transparent = 'data:image/gif;base64,R0lGODlhAQABALMAALu7uwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAwQCEEQAOw==';
	s.deferred = {};
	
	var onSuccess = function (imageData) {
		s.deferred.resolve("data:image/jpeg;base64," + imageData);
	};

	var onFail = function (message) {
	    ErrorService.reportError(message);
		s.deferred.reject("photo error "+ message);
	};

	s.takePhoto = function () {
		s.deferred = $q.defer();

		if (navigator.camera === undefined) {
			alert("your phone does not appear to suport photos");
		} else {
			navigator.camera.getPicture(onSuccess, onFail, {
				quality: s.quality,
				destinationType: Camera.DestinationType.DATA_URL
			});
		}

		return s.deferred.promise;
	};

	s.resizePhoto = function (img, width, height) {
	    // create an off-screen canvas
	    var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

	    // set its dimension to target size
	    canvas.width = width;
	    canvas.height = height;

	    // draw source image into the off-screen canvas:
	    ctx.drawImage(img, 0, 0, width, height);

	    // encode image to data-uri with base64 version of compressed image
	    return canvas.toDataURL();
	};

	return s;
}]);
