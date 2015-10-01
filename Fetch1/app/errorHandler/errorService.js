/*global app */
app.factory('ErrorService', ['$log','ConfigSrvc',
    function ($log, ConfigSrvc) {
        'use strict';
        var s = {},
            onErrorCallbacks= [],
            lastError,
            onError;

        onError = function (message) {
            angular.forEach(onErrorCallbacks, function (callback) {
                callback(message);
            });
        };

        //var myOnError = function( message ){ ... };
        //ErrorService.registerOnErrorObserver( myOnError );
        s.registerOnErrorObserver = function (callback) {
            onErrorCallbacks.push(callback);
        };

        s.device = '0.001 ' + navigator.userAgent + ' ';

        //using $q would cause a circular dependancy so we set up an observer pattern
        s.reportError = function (error) {
            s.reportMessage(error.message, error.stack);
        };

        s.reportMessage = function (message, details) {
            var xmlHttp = new XMLHttpRequest();
            var rootErrorUrl = 'http://fetch001.azurewebsites.net/api/Log?message=';

            if (message !== lastError) {
                //test to prevent circular reference web calls
                if (details !== null && details !== undefined && details.indexOf !== undefined && details.indexOf(rootErrorUrl) === -1) {
                    lastError = message;
                    onError(message + ': ' + details);

                    //old school get to prevent circular reference error message
                    //and yes i am OK with ancent browsers dropping the ball here
                    xmlHttp.open('GET', rootErrorUrl + message + '&details=' + ConfigSrvc.version +' '+ s.device +' '+ details, true);
                    xmlHttp.send(null);
                    $log.info('message reported to server: ' + message + '\r\n' + details);
                }
            }
        };

        return s;
    }]);

//intercept errors that normaly go to console
app.factory('$exceptionHandler', ['$log', 'ErrorService', function ($log, ErrorService) {
    return function errorCatcherHandler(exception, cause) {
        $log.warn({ 'exception': exception, 'cause': cause });

        //custom handling
        ErrorService.reportMessage(exception.message, exception.stack);
    };
}]);

//intercept ajax errors
app.factory('errorHttpInterceptor', ['$log', '$q', 'ErrorService', function ($log, $q, ErrorService) {
    return {
        responseError: function responseError(rejection) {
            $log.warn({ 'rejection': rejection });

            //custom handling
            ErrorService.reportMessage('http Error: ' + rejection.status + ' ' + rejection.statusText, rejection.config.url);

            return $q.reject(rejection);
        }
    };
}])
.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('errorHttpInterceptor');
}]);