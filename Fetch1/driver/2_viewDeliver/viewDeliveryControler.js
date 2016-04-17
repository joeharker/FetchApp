/*global app */
app.controller('ViewDeliveryControler', ['ConfigSrvc', '$interval', '$http', 'EnumSrvc', 'ErrorService', 'MemorySrvc', 'cameraService', 'mapService',
function (ConfigSrvc, $interval, $http, EnumSrvc, ErrorService, MemorySrvc, cameraService, mapService) {
	var c = this;

	c.message = '';
    c.form = {};
    c.page = {};

	c.init = function (form, page) {
	    c.form = form;
	    c.page = page;

	    //before next page
	    MemorySrvc.set("pickSrc", cameraService.transparent);
	    MemorySrvc.set("dropSrc", cameraService.transparent);
	    MemorySrvc.set("pickReady", false);
	    MemorySrvc.set("dropReady", false);
	    MemorySrvc.set("pickup", false);
	    MemorySrvc.set("drop", false);

	    mapService.calculateRoute(form.data.pickup, form.data.delivery)
	            .then(function (rout) {
	                form.data.distance = (rout.meters / 1609.34).toFixed(2) + " miles";
	            }, function (reason) {
	                form.data.distance = "";
	            });
	};

	c.accept = function (f) {
	    var ticker = $interval(function () {
	        if (MemorySrvc.get("deliveryId") !== "") {
	            $http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + MemorySrvc.get("deliveryId"))
	                .then(function(status) {
	                    switch (status.data.nextNeed) {
	                    case EnumSrvc.NextNeed.Driver:
	                        $http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + MemorySrvc.get("deliveryId") + '&driverId=' + MemorySrvc.get('myId'))
	                            .then(function(response) {
	                                if (response.data !== MemorySrvc.get('myId')) {
	                                    c.message = 'Someone else has taken this delivery';
	                                    $interval.cancel(ticker);
	                                    c.page.load('driver/1_pickupMap/pickupMap.html');
	                                } else {
	                                    $interval.cancel(ticker);
	                                    c.page.load('driver/3_startDelivery/startDelivery.html');
	                                }
	                            }, function(e) {
	                                ErrorService.reportMessage("post pick photo error", JSON.stringify(e));
	                                c.message = "Finding Network";
	                            });
	                        break;
	                    case EnumSrvc.NextNeed.Payment:
	                        //sometimes we get here before the startDelivery page loads
	                        c.message = "Confirming Payment";
	                        break;
	                    default:
	                        ErrorService.reportMessage("EnumSrvc.NextNeed.Driver error", EnumSrvc.NextNeed.Driver);
	                        c.message = "Finding Network";
	                    }
	                }, function(x) {
	                    ErrorService.reportMessage("test photo error", JSON.stringify(x));
	                    c.message = 'Finding Network';
	                });
	        }
	    }, 1000);
	};

	return c;
}]);