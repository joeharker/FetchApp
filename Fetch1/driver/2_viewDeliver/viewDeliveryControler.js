/*global app */
app.controller('ViewDeliveryControler', ['ConfigSrvc', '$interval', '$http','EnumSrvc','ErrorService',
function (ConfigSrvc, $interval, $http, EnumSrvc, ErrorService) {
	var c = this;

	c.driverCut = ConfigSrvc.driverCut;
	c.message = '';
    c.form = {};
    c.page = {};

	c.init = function (form, page) {
	    c.form = form;
	    c.page = page;
	};

	c.accept = function (f) {
	    ticker = $interval(function () {
	        $http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + c.form.data.deliveryId)
                .then(function (status) {
                    switch (status.data.nextNeed) {
                        case EnumSrvc.NextNeed.Driver:
                            $http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + c.form.data.deliveryId + '&driverId=' + c.form.myId)
                                .then(function (response) {
                                    console.log(c.form.myId);
                                    console.log(JSON.stringify(response));
                                    if (response.data !== c.form.myId) {
                                        c.message = 'Someone else has taken this delivery';
                                        $interval.cancel(ticker);
                                        c.page.load('driver/1_pickupMap/pickupMap.html');
                                    } else {
                                        $interval.cancel(ticker);
                                        c.page.load('driver/3_startDelivery/startDelivery.html');
                                    }
                                }, function (e) {
                                    ErrorService.reportMessage("post pick photo error", JSON.stringify(e));
                                    c.message = JSON.stringify(e);
                                });
                            break;
                        case EnumSrvc.NextNeed.Payment:
                            //sometimes we get here before the startDelivery page loads
                            break;
                        default:
                            $interval.cancel(ticker);
                            c.message = 'Someone else has taken this delivery';
                            c.page.load('driver/1_pickupMap/pickupMap.html');
                    }
                }, function (x) {
                    ErrorService.reportMessage("test photo error", JSON.stringify(x));
                    c.message = 'net work error ' + JSON.stringify(x);
                });
	    }, 1000);
	};

	return c;
}]);