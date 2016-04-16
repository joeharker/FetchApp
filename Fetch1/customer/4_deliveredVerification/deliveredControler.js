/*global app */
app.controller('DeliveredControler', ['MemorySrvc', 'ConfigSrvc', '$http', 'ErrorService',
function (MemorySrvc, ConfigSrvc, $http, ErrorService) {
    var c = this;

    c.id = 0;

    c.init = function(form) {
        c.id = form.data.deliveryId;
        MemorySrvc.reset();
    };

    c.rate = function (rate, notes, page) {
        var ratenum = parseInt(rate);
        if (isNaN(ratenum)) {
            ratenum = 0;
        }

        $http.post(ConfigSrvc.serviceUrl + '/api/delivery?id=' + c.id + '&customer=' + true + '&rate=' + ratenum + '&notes=' + encodeURIComponent(notes))
        .then(function (response) {
            page.load('app/page/start.html');
        }, function (e) {
            ErrorService.reportMessage("Driver rate delivery error", JSON.stringify(e));
            c.message = "Driver rate delivery error";
            page.load('app/page/start.html');
        });
    };

    return c;
}]);