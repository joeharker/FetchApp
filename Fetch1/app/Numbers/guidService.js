/*global app */
app.factory('GuidService', [
function () {
	'use strict';
	var s = this;

	var rnd4 = function () {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1)
		;
	};
	
	s.guid = function () {
		return rnd4() + rnd4() + '-' + rnd4() + '-' + rnd4() + '-' + rnd4() + '-' + rnd4() + rnd4() + rnd4();
	};

	return s;
}]);
