/*global app */
app.controller('TrackControler', ['mapService', 'locationService', '$interval', '$http', 'ConfigSrvc', 'MemorySrvc', 'cameraService','DeviceSrvc','EnumSrvc',
function (mapService, locationService, $interval, $http, ConfigSrvc, MemorySrvc, cameraService, DeviceSrvc, EnumSrvc) {
	var c = this;
	var ticker = {};
	c.message = 'Finding your location';
	c.form = {};
	c.page = {};
	c.pickSrc = MemorySrvc.get("pickSrc");
	c.dropSrc = MemorySrvc.get("dropSrc");
	c.accept = MemorySrvc.get("accept") === "true";

	c.init = function (form, page) {
		c.form = form;
		c.page = page;

		ticker = $interval(function () {
		    if (MemorySrvc.get("deliveryId") !== "") {
		        $http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + MemorySrvc.get("deliveryId"))
		            .then(function(status) {
		                //clear old markers
		                mapService.clearPins();

		                //update the driver location
		                mapService.addPinLatLon(
		                    status.data.lat, status.data.lon, function() {
		                        //no click function for now
		                    }
		                );

		                switch (status.data.nextNeed) {
		                case EnumSrvc.NextNeed.Driver:
		                    c.message = 'Waiting';
		                    break;
		                case EnumSrvc.NextNeed.Payment:
		                    c.message = 'Waiting';
		                    break;
		                case EnumSrvc.NextNeed.Pickup:
		                    c.message = 'Approaching pickup';
		                    break;
		                case EnumSrvc.NextNeed.Dropoff:
		                    c.message = 'Approaching drop off';
		                    if (c.pickSrc === cameraService.transparent) {
		                        if (MemorySrvc.get("deliveryId") !== "") {
		                            $http.get(ConfigSrvc.serviceUrl + '/api/pickup?deliveryId=' + MemorySrvc.get("deliveryId"))
		                                .then(function(photo) {
		                                    c.pickSrc = photo.data;
		                                    MemorySrvc.set("pickSrc", photo.data);
		                                    console.log('b');
		                                    DeviceSrvc.buzz();
		                                }, function(x) {
		                                    c.message = 'Finding Network';
		                                });
		                        }
		                    }
		                    break;
		                case EnumSrvc.NextNeed.Transfer:
		                    c.message = 'Delivery has arrived';
		                    $interval.cancel(ticker);
		                    if (c.dropSrc === cameraService.transparent) {
		                        c.accept = true;
		                        MemorySrvc.set("accept", true);
		                        if (MemorySrvc.get("deliveryId") !== "") {
		                            $http.get(ConfigSrvc.serviceUrl + '/api/drop?deliveryId=' + MemorySrvc.get("deliveryId"))
		                                .then(function(photo) {
		                                    c.dropSrc = photo.data;
		                                    MemorySrvc.set("dropSrc", photo.data);
		                                    console.log('c');
		                                    DeviceSrvc.buzz();
		                                }, function(x) {
		                                    c.message = 'Finding Network';
		                                });
		                        }
		                    }
		                    break;
		                case EnumSrvc.NextNeed.Done:
		                    c.message = 'Delivery has arrived';
		                    break;
		                default:
		                    c.message = status.data.nextNeed;
		                }

		                //center map on driver
		                mapService.centerMap(status.data.lat, status.data.lon);
		            }, function(e) {
		                c.message = 'Finding Network';
		            });
		    }
		}, 5000);
	};

	c.AcceptDelivery = function () {
	    $http.get(ConfigSrvc.serviceUrl + '/api/complete?deliveryId=' + MemorySrvc.get("deliveryId"));
		c.page.load('customer/4_deliveredVerification/deliveredVerification.html');
	};

	return c;
}]);