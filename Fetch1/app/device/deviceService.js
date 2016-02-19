/*global app */
app.factory('DeviceSrvc', [
function () {
	'use strict';
	var s = {};

	s.exit = function () {
		if (navigator.app !== undefined) {
			navigator.app.exitApp();
		}
	};

	s.buzz = function () {
		if (navigator.notification !== undefined) {
			navigator.notification.beep(3);
			navigator.notification.vibrate(2000);
		}
	};

	s.splash = function (show) {
	    if (navigator.splashscreen !== undefined) {
	        if (show) {
	            navigator.splashscreen.show();
	        } else {
	            navigator.splashscreen.hide();
	        }
	    }
	};

	return s;
}]);