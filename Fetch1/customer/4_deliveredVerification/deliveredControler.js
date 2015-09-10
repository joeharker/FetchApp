/*global app */
app.controller('DeliveredControler', ['DeliverySrvc',
function (DeliverySrvc) {
	var c = this;
	
	DeliverySrvc.reset();

	return c;
}]);