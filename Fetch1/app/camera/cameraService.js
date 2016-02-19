/*global app */
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
	    if (message.indexOf("has no") === -1 && message.indexOf("cancelled") === -1) { //this means the photo was canceled
	        ErrorService.reportError("photo error", JSON.stringify(message));
	        s.deferred.reject("photo error " + JSON.stringify(message));
	    }
	};

	s.takePhoto = function () {
		s.deferred = $q.defer();

		if (navigator.camera === undefined) {
			alert("your phone does not appear to suport photos");
		} else {
			navigator.camera.getPicture(onSuccess, onFail, {
				quality: s.quality,
				destinationType: Camera.DestinationType.DATA_URL,
				correctOrientation: true
			});
		}

		return s.deferred.promise;
	};

	var rotate = function (ctx, degrees) {
	    ctx.translate(ctx.width / 2, ctx.height / 2);
	    ctx.rotate(degrees * Math.PI / 180);
	}

	s.resizePhoto = function (imgId, width) {
	    // create an off-screen canvas
	    var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
			img = document.getElementById(imgId),
			oWidth = img.width,
			oHeight = img.height,
			ratio = oWidth / width;

	    // set its dimension to target size
	    canvas.width = width;
	    canvas.height = oHeight / ratio;

	    // draw source image into the off-screen canvas:
	    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	    // encode image to data-uri with base64 version of compressed image
	    return canvas.toDataURL("image/jpeg", 0.5);
	};

	s.hasCamera = function () {
	    return (navigator.camera !== undefined);
    };

    return s;
}]);
