/*global app */
app.controller('startControler', ['locationService', '$interval', '$http', 'ConfigSrvc', 'EnumSrvc', 'mapService', 'cameraService', 'ErrorService', 'DeviceSrvc','MemorySrvc',
function (/*                            */ locationService, $interval, $http, ConfigSrvc, EnumSrvc, mapService, cameraService, ErrorService, DeviceSrvc, MemorySrvc) {
	var c = this;
	var ticker = {};
	c.form = {};
	c.page = {};
	c.latLngUrl = '';
	c.addressMessage = '';
	c.pickup = false;
	c.drop = false;
	c.pickSrc = cameraService.transparent;
	c.dropSrc = cameraService.transparent;
	
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
				            c.pickup = true;
				            $http.get(ConfigSrvc.serviceUrl + '/api/delivery?driverId=' + c.form.myId + '&lat=' + locationService.position.latitude + '&lon=' + locationService.position.longitude);
				            break;
				        case EnumSrvc.NextNeed.Dropoff:
				            $http.get(ConfigSrvc.serviceUrl + '/api/delivery?driverId=' + c.form.myId + '&lat=' + locationService.position.latitude + '&lon=' + locationService.position.longitude);
				            break;
				        case EnumSrvc.NextNeed.Transfer:
				            c.message = 'Waiting for customer to confirm drop off';
				            break;
				        case EnumSrvc.NextNeed.Done:
				            $interval.cancel(ticker);
				            c.page.load('driver/4_drivenVerification/drivenVerification.html');
				            break;
				        default:
				            c.message = status.data.nextNeed;
				    }
				}, function (x) {
				    ErrorService.reportMessage("test photo error", JSON.stringify(x));
				    c.message = 'net work error '+ JSON.stringify(x);
				});
		}, 5000);
	};

    c.pready = false;
    c.onPickLoad = function () {
        if (!c.pready) {
            //c.pready = true; //quick hack to not record the first blank image that loads with the page
        } else {
            var photo = cameraService.resizePhoto("pickImg", 200);
            alert(JSON.stringify(photo));
            $http.post(ConfigSrvc.serviceUrl + '/api/pickup', { 'deliveryId': c.form.data.deliveryId, 'photo': photo })
                .then(function(response) {
                    c.pickup = false;
                    c.drop = true;
                    c.addressMessage = 'Get directions to Drop off ' + c.form.data.delivery;
                }, function(e) {
                    ErrorService.reportMessage("post pick photo error", JSON.stringify(e));
                    c.message = JSON.stringify(e);
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
		    c.pickSrc = photo;  //this will trigger onPickLoad when the image is loaded
		    
		}, function (x) {
		    ErrorService.reportMessage("take pick photo error", JSON.stringify(x));
		    c.message = JSON.stringify(x);
		});
	};

	c.dready = false;
	c.onDropLoad = function () {
	    if (!c.dready) {
	        //c.dready = true; //quick hack to not record the first blank image that loads with the page
	    } else {
	        var photo = cameraService.resizePhoto("dropImg", 200);
	        
	        $http.post(ConfigSrvc.serviceUrl + '/api/drop', { 'deliveryId': c.form.data.deliveryId, 'photo': photo })
                .then(function (response) {
                    c.pickup = false;
                    c.drop = false;
                    c.message = 'Waiting for customer to confirm drop off';
                }, function (e) {
                    ErrorService.reportMessage("post drop photo error", JSON.stringify(e));
                    c.message = JSON.stringify(e);
                });
	    }
	};

	c.dropPhoto = function () {
		cameraService.takePhoto()
		.then(function (photo) {
		    c.dready = true; //quick hack to not record the first blank image that loads with the page
		    c.dropSrc = photo;  //this will trigger onDropLoad when the image is loaded
			
		}, function (e) {
		    ErrorService.reportMessage("take drop photo error", JSON.stringify(e));
		    c.message = JSON.stringify(e);
		});
	};

	return c;
}]);