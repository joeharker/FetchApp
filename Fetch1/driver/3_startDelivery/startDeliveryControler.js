/*global app */
app.controller('startControler', ['locationService', '$interval', '$http', 'ConfigSrvc', 'EnumSrvc', 'mapService', 'cameraService', 'ErrorService', 'DeviceSrvc','MemorySrvc',
function (/*                            */ locationService, $interval, $http, ConfigSrvc, EnumSrvc, mapService, cameraService, ErrorService, DeviceSrvc, MemorySrvc) {
	var c = this;
	var ticker = {};
	c.form = {};
	c.page = {};
	c.pickSrc = MemorySrvc.get("pickSrc");
	c.dropSrc = MemorySrvc.get("dropSrc");
	c.latLngUrl = "";
	c.addressMessage = "";
	c.pickup = MemorySrvc.get("pickup") === "true";
	c.drop = MemorySrvc.get("drop") === "true";
	c.pready = MemorySrvc.get("pickReady") === "true";
	c.dready = MemorySrvc.get("dropReady") === "true";
	
	c.init = function (form, page) {
		c.form = form;
		c.page = page;
		c.message = 'Connecting with server';
		c.addressMessage = 'Get directions to Pickup ' + c.form.data.pickup;

		mapService.getGeoUrl(form.data.pickup)
		.then(function (latLngUrl) {
			c.latLngUrl = latLngUrl;
		});

		ticker = $interval(function () {
			$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + c.form.data.deliveryId)
				.then(function (status) {
				    switch (status.data.nextNeed) {
				        case EnumSrvc.NextNeed.Driver:
				            c.message = 'Waiting';
				            break;
				        case EnumSrvc.NextNeed.Payment:
				            c.message = 'Waiting for customer payment';
				            break;
				        case EnumSrvc.NextNeed.Pickup:
				            console.log('d');
				            DeviceSrvc.buzz();
				            c.pickup = true;
				            MemorySrvc.set("pickup", true);
				            $http.get(ConfigSrvc.serviceUrl + '/api/delivery?driverId=' + MemorySrvc.get('myId') + '&lat=' + locationService.position.latitude + '&lon=' + locationService.position.longitude);
				            break;
				        case EnumSrvc.NextNeed.Dropoff:
				            $http.get(ConfigSrvc.serviceUrl + '/api/delivery?driverId=' + MemorySrvc.get('myId') + '&lat=' + locationService.position.latitude + '&lon=' + locationService.position.longitude);
				            break;
				        case EnumSrvc.NextNeed.Transfer:
				            c.message = 'Waiting for customer to confirm drop off';
				            break;
				        case EnumSrvc.NextNeed.Done:
				            $interval.cancel(ticker);
				            c.page.load('driver/4_drivenVerification/drivenVerification.html');
				            break;
				        default:
				            ErrorService.reportMessage("test photo error driver", status.data.nextNeed);
				            c.message = "Finding Network";
				    }
				}, function (x) {
				    ErrorService.reportMessage("test photo error", JSON.stringify(x));
				    c.message = "Finding Network";
				});
		}, 5000);
	};

    c.onPickLoad = function () {
        if (!c.pready) {
            //c.pready = true; //quick hack to not record the first blank image that loads with the page
        } else {
            var photo = cameraService.resizePhoto("pickImg", 200);
            $http.post(ConfigSrvc.serviceUrl + '/api/pickup', { 'deliveryId': c.form.data.deliveryId, 'photo': photo })
                .then(function(response) {
                    c.pickup = false;
                    MemorySrvc.set("pickup", false);
                    c.drop = true;
                    MemorySrvc.set("drop", true);
                    c.addressMessage = 'Get directions to Drop off ' + c.form.data.delivery;
                }, function(e) {
                    ErrorService.reportMessage("post pick photo error", JSON.stringify(e));
                    c.message = "Post photo error";
                });
        }
    };

	c.pickPhoto = function () {
		mapService.getGeoUrl(c.form.data.delivery)
		.then(function (latLngUrl) {
			c.latLngUrl = latLngUrl;
		});

		cameraService.quality = 5;
		cameraService.takePhoto()
		.then(function (photo) {
		    c.pready = true; //quick hack to not record the first blank image that loads with the page
		        MemorySrvc.set("pickReady", true);
		    c.pickSrc = photo;  //this will trigger onPickLoad when the image is loaded
		    MemorySrvc.set("pickSrc", photo);
		}, function (x) {
		    ErrorService.reportMessage("take pick photo error", JSON.stringify(x));
		    c.message = "Photo Error";
		});
	};

	c.onDropLoad = function () {
	    if (!c.dready) {
	        //c.dready = true; //quick hack to not record the first blank image that loads with the page
	    } else {
	        var photo = cameraService.resizePhoto("dropImg", 200);
	        
	        $http.post(ConfigSrvc.serviceUrl + '/api/drop', { 'deliveryId': c.form.data.deliveryId, 'photo': photo })
                .then(function (response) {
                    c.pickup = false;
	                MemorySrvc.set("pickup", false);
	                c.drop = false;
	                MemorySrvc.set("drop", false);
                    c.message = 'Waiting for customer to confirm drop off';
                }, function (e) {
                    ErrorService.reportMessage("post drop photo error", JSON.stringify(e));
                    c.message = "Post photo error";
                });
	    }
	};

	c.dropPhoto = function () {
		cameraService.takePhoto()
		.then(function (photo) {
		    c.dready = true; //quick hack to not record the first blank image that loads with the page
		    MemorySrvc.set("dropReady", true);
		    c.dropSrc = photo;  //this will trigger onDropLoad when the image is loaded
		    MemorySrvc.set("dropSrc", photo);
		}, function (e) {
		    ErrorService.reportMessage("take drop photo error", JSON.stringify(e));
		    c.message = "Photo error";
		});
	};

	return c;
}]);