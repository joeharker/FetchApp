/*global app */
app.factory('EnumSrvc', [
function () {
	'use strict';
	var s = {};

	s.NextNeed = { Driver : 0, Payment : 1, Pickup : 2, Dropoff : 3, Transfer : 4, Done : 5 };

	return s;
}]);