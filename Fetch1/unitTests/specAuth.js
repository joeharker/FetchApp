/// <reference path="../resources/scripts/angular.js" />
/// <reference path="../resources/scripts/angular-animate.js" />
/// <reference path="angular-mocks.js" />
/// <reference path="../app.js" />
/// <reference path="../App/authentication/authenticateController.js" />


/*global describe,beforeEach,module,inject,it,expect */
describe('authentication tests', function () {
    'use strict';
    var controller;

    beforeEach(function () {
        module('Fetch1App');
        inject(function ($injector, $controller) {
            controller = $controller('AuthCtrl', { });
        });
    });

    describe('Given any auth state, When i request a clientId', function () {
        it('Then returns a clientId', function () {
            expect(controller.clientId).toBeDefined();
        });
    });

    describe('Given any auth state, When i request a dataKey', function () {
        it('Then returns a dataKey', function () {
            expect(controller.publishableKey).toBeDefined();
        });
    });
});