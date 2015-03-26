/*global app */
app.controller('PageCtrl', [
    function () {
        'use strict';
        var c = this,
            regex,
            match,
            ver = '?ver=' + new Date().getTime(),
            history = [],
			root = window.location.href.replace('index.html', '');
        ;
        
        c.template = root + 'app/loading/loading.html' + ver;
        c.animateMore = '';
        c.disableBack = true;

        c.load = function (template, direction) {
            if (direction !== undefined) {
                c.animateMore = 'slide-' + direction;
            } else {
                c.animateMore = '';
            }

            history.push(c.template);
            c.disableBack = false;
            c.template = root + template + ver;
        };

        c.back = function () {
            if (history.length > 0) {
                c.animateMore = 'slide-back';
                c.template = history[history.length - 1];
                history.pop();
            }
            c.disableBack = (history.length <= 0);
        };

        //onload-complete load a template if listed in a jump url param
        regex = new RegExp('(?:\\?|&)jump=([^&]*)(?=&|$)', 'gi');
        match = regex.exec(window.document.location.search);
        if (match !== null) {
            c.template = match[1];
        }

        return c;
    }]);