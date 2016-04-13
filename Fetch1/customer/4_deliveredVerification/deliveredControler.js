/*global app */
app.controller('DeliveredControler', ['MemorySrvc', 'ConfigSrvc', '$http', 'ErrorService',
function (MemorySrvc, ConfigSrvc, $http, ErrorService) {
    var c = this;

    c.id = 0;
    c.page = {};

    c.init = function(form, page) {
        c.id = form.data.deliveryId;
        c.page = page;
        MemorySrvc.reset();
    };

    c.rate = function (rate, notes, page) {
        //int id, bool customer, int rate, string notes
        $http.post(ConfigSrvc.serviceUrl + '/api/delivery?id=' + c.id + '&customer=' + true + '&rate=' + parseInt(rate) + '&notes=' + encodeURIComponent(notes))
        .then(function (response) {
            console.log([c.page, response]);
            page.load('app/page/start.html');
        }, function (e) {
            ErrorService.reportMessage("Driver rate delivery error", JSON.stringify(e));
            c.message = "Driver rate delivery error";
        });
    };

    return c;
}]);