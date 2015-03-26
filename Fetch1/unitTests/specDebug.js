/// <reference path="../resources/scripts/angular.js" />
/// <reference path="../resources/scripts/angular-animate.js" />
/// <reference path="angular-mocks.js" />
/// <reference path="../app.js" />
/// <reference path="../common/errorHandler/errorService.js" />
/// <reference path="../common/errorHandler/debugController.js" />


/*global describe,beforeEach,module,inject,it,expect */
describe('error and debug tests', function () {
    'use strict';
    var service,
        controller;

    beforeEach(function () {
        module('Fetch1App');
        inject(function ($injector, $controller) {
            service = $injector.get('ErrorService');
            controller = $controller('DebugCtrl', { ErrorService: service });
        });
    });

    describe('Given the app is running, When code commits an error that should log to console', function () {
        it('Then intercepts and reports the error to debug', function () {
            //Arrange
            var testError = 'test error';

            //Act
            var test = function () {
                throw Error(testError);
            };

            //Assert
            expect(test).toThrow();
            expect(controller.lastError).toBe(testError);
        });
    });
});