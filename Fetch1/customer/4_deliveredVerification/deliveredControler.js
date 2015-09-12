/*global app */
app.controller('DeliveredControler', ['MemorySrvc',
function (MemorySrvc) {
	var c = this;
	
	MemorySrvc.reset();

	return c;
}]);