/*global app */
app.controller('DrivenControler', ['MemorySrvc', 'ConfigSrvc', '$http', 'ErrorService',
function (MemorySrvc, ConfigSrvc, $http, ErrorService) {
    var c = this;

    c.id = 0;
    c.page = {};

    c.init = function (form, page) {
        c.page = page;
        c.id = form.data.deliveryId;
        MemorySrvc.reset();
    };

    c.rate = function (rate, notes) {
        //int id, bool customer, int rate, string notes
        $http.post(ConfigSrvc.serviceUrl + '/api/delivery?id=' + c.id + '&customer=' + false + '&rate=' + parseInt(rate) + '&notes=' + encodeURIComponent(notes))
        .then(function (response) {
            c.page.load('app/page/start.html');
        }, function (e) {
            ErrorService.reportMessage("Driver rate delivery error", JSON.stringify(e));
            c.message = "Driver rate delivery error";
        });
    };

	return c;
}]);