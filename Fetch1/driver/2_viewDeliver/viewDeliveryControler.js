/*global app */
app.controller('ViewDeliveryControler', ['ConfigSrvc',
function (ConfigSrvc) {
	var c = this;

	c.driverCut = ConfigSrvc.driverCut;

	return c;
}]);