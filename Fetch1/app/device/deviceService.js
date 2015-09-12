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

	return s;
}]);