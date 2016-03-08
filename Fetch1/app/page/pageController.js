/*global app */
app.controller('PageCtrl', ['ConfigSrvc', 'MemorySrvc', 'cameraService', 'DeviceSrvc', 'addsService',
    function (ConfigSrvc, MemorySrvc, cameraService, DeviceSrvc, addsService) {
    	'use strict';
    	var c = this,
            regex,
            match,
            historyName = 'pagehistory',
            history = MemorySrvc.get(historyName) === "" ? [] : JSON.parse(MemorySrvc.get(historyName)),
			root = window.location.href.replace(/index.html.*/, '');
    	;
    	c.ver = ConfigSrvc.version,
    	c.animateMore = '';
    	c.disableBack = true;
    	c.theme = '';
    	c.title = '';
    	c.template = '';
    	c.deferred = {};
        c.toggleMessage = addsService.toggleMessage;

        //init
    	DeviceSrvc.splash(true); //show until the devices have been tested for
    	if (window.plugins !== undefined) {
    	    window.plugins.insomnia.allowSleepAgain();  //default to not sleep
    	}

        c.toggleBanner = function() {
            addsService.toggleBanner();
        };

    	c.load = function (template, direction) {
    		if (direction !== undefined) {
    			c.animateMore = 'slide-' + direction;
    		} else {
    			c.animateMore = '';
    		}

    		history.push(MemorySrvc.get('pageTemplate'));
    		c.disableBack = false;
    		MemorySrvc.set('pageTemplate', template + '?version=' + c.ver);
    		c.template = MemorySrvc.get('pageTemplate');
    		MemorySrvc.set(historyName, JSON.stringify(history));
    	};

    	c.back = function () {
    		if (history.length > 0) {
    			c.title = '';
    			c.animateMore = 'slide-back';
    			c.template = history[history.length - 1];
    			history.pop();
    		}
    		c.disableBack = (history.length <= 0);
    	};

    	c.hasCameraAndGPS = function () {
	        var camera = cameraService.hasCamera();

	        DeviceSrvc.splash(false);

	        return true;
	        //return camera;
	    };

        //onload-complete load a template if listed in a path url param or page one
    	regex = new RegExp('(?:\\?|&)path=([^&]*)(?=&|$)', 'gi');
    	match = regex.exec(window.document.location.search);
    	if (match !== null) {
    		c.load(match[1]);
    	} else {
    		var current = MemorySrvc.get('pageTemplate');
    		if (current === '' || current.toLowerCase().indexOf('requestdelivery.html') !== -1 || current.toLowerCase().indexOf('pickupmap.html') !== -1) {
    			c.load(root + 'app/page/start.html?version=' + c.ver);
    		}else{
    			c.load(MemorySrvc.get('pageTemplate'));
    		}
    	}

    	return c;
    }]);