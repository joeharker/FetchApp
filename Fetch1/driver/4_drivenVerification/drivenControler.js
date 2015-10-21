/*global app */
app.controller('DrivenControler', ['MemorySrvc',
function (MemorySrvc) {
	var c = this;
	
	MemorySrvc.reset();

	return c;
}]);