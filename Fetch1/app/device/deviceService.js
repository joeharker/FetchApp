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

	return s;
}]);