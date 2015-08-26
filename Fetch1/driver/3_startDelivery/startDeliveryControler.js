/*global app */
app.controller('startControler', ['locationService', '$interval', '$http', 'ConfigSrvc',
function (locationService, $interval, $http, ConfigSrvc) {
	var c = this;
	var ticker = {};
	
	c.init = function (form) {
		$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + form.deliveryId + '&driverId=' + form.myId)
			.then(function (response) {
				//just expecting success or fail
			}, function (e) {
				c.message = 'An error has occured';
		});
	};
	

	return c;
}]);