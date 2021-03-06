﻿/*global app */
app.controller("PageCtrl", ["ConfigSrvc", "MemorySrvc", "cameraService", "DeviceSrvc", "addsService",
    function (ConfigSrvc, MemorySrvc, cameraService, DeviceSrvc, addsService) {
        "use strict";
        var c = this,
            regex,
            match,
            historyName = "pagehistory",
            history = MemorySrvc.get(historyName) === "" ? [] : JSON.parse(MemorySrvc.get(historyName)),
			root = window.location.href.replace(/index.html.*/, "");
        ;
        c.ver = ConfigSrvc.version,
    	c.animateMore = "";
        c.disableBack = true;
        c.theme = "";
        c.title = "";
        c.template = "";
        c.deferred = {};
        c.toggleMessage = addsService.toggleMessage;
        c.agree = false;

        //init
        DeviceSrvc.splash(true); //show until the devices have been tested for
        if (window.plugins !== undefined) {
            window.plugins.insomnia.allowSleepAgain();  //default to not sleep
        }

        c.toggleBanner = function () {
            addsService.toggleBanner();
        };

        c.load = function(template, direction) {
            if (direction !== undefined) {
                c.animateMore = "slide-" + direction;
            } else {
                c.animateMore = "";
            }

            history.push(template);
            MemorySrvc.set(historyName, JSON.stringify(history));
            c.disableBack = false;
            c.template = root + template + '?version=' + c.ver;
        };

        c.back = function () {
            if (history.length > 0) {
                c.title = "";
                c.animateMore = "slide-back";
                c.template = history[history.length - 2];
                history.pop();
                MemorySrvc.set(historyName, JSON.stringify(history));
            }
            c.disableBack = (history.length <= 0);
        };

        c.hasCameraAndGPS = function () {
            var hasCamera = cameraService.hasCamera();

            DeviceSrvc.splash(false);

            //return true;
            return hasCamera;
        };

        c.tutorial = function() {
            window.open('http://www.fetch1.com/#!tutorial-video/l84n1', '_system');
        };

        c.conditions = function() {
            window.open('http://www.fetch1.com/#!terms-and-conditions/cxpuj', '_system');
        };

        c.tip = function () {
            window.open('http://www.fetch1.com/#!donate-page/zwaoc', '_system');
        };

        //onload-complete load a template if listed in a path url param or page one
        regex = new RegExp("(?:\\?|&)path=([^&]*)(?=&|$)", "gi");
        match = regex.exec(window.document.location.search);
        if (match !== null) {
            c.template = match[1];
        } else if (history.length > 0) {
            c.template = history[history.length - 1];
        } else {
            c.template = root + "app/page/start.html?version=" + c.ver;
        }

        return c;
    }]);