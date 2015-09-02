/*exported app */
var app = angular.module('Fetch1App', ['ngAnimate'])
.config([
    '$compileProvider',
    function ($compileProvider) {
    	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|geo|maps):/);
    }
]);