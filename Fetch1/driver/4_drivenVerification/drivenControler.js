﻿/*global app */
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
        var ratenum = parseInt(rate);
        if (isNaN(ratenum)) {
            ratenum = 0;
        }

        $http.post(ConfigSrvc.serviceUrl + '/api/delivery?id=' + c.id + '&customer=' + false + '&rate=' + ratenum + '&notes=' + encodeURIComponent(notes))
        .then(function (response) {
            c.page.load('app/page/start.html');
        }, function (e) {
            ErrorService.reportMessage("Driver rate delivery error", JSON.stringify(e));
            c.message = "Driver rate delivery error";
            c.page.load('app/page/start.html');
        });
    };

	return c;
}]);