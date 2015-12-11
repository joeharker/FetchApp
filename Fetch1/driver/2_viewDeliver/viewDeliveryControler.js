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
	    var ticker = $interval(function () {
	        $http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + c.form.data.deliveryId)
	            .then(function (status) {
	                switch (status.data.nextNeed) {
	                case EnumSrvc.NextNeed.Driver:
	                    $http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + c.form.data.deliveryId + '&driverId=' + c.form.myId)
	                        .then(function (response) {
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
	                            c.message = "Finding Network G";
	                        });
	                    break;
	                case EnumSrvc.NextNeed.Payment:
	                    //sometimes we get here before the startDelivery page loads
	                    break;
	                default:
	                    ErrorService.reportMessage("EnumSrvc.NextNeed.Driver error", EnumSrvc.NextNeed.Driver);
	                    c.message = "Finding Network H";
	                }
	            }, function (x) {
	                ErrorService.reportMessage("test photo error", JSON.stringify(x));
	                c.message = 'Finding Network I';
	            });
	    }, 1000);
	};

	return c;
}]);