/// <reference path="../resources/scripts/angular.js" />
/// <reference path="../resources/scripts/angular-animate.js" />
/// <reference path="angular-mocks.js" />
/// <reference path="../app.js" />
/// <reference path="../demo/demoService.js" />
/// <reference path="../demo/demoController.js" />

/*global describe,beforeEach,module,inject,it,expect,spyOn */
describe('demo tests', function () {
    'use strict';
    var service,
        controller;

    beforeEach(function () {
        module('Fetch1App');
        inject(function ($injector, $controller) {
            service = $injector.get('DeliverySrvc');
            controller = $controller('DeliveryCtrl', { DeliverySrvc: service });
        });
    });

    describe('Given the service has nothing in hache, When i request with a key that has not been set', function () {
        it('Then returns a blank string', function () {
            expect(service.get('test')).toBe('');
        });
    });

    describe('Given the service has a key set, When i request with that key', function () {
        it('Then returns the value that was set', function () {
            //Arrange
            var key1 = 'testKey';
            var val1 = 'testVal';
            var key2 = 'testKeytwo';
            var val2 = 'testValtwo';

            //Act
            service.set(key1, val1);
            service.set(key2, val2);

            //Assert
            expect(service.get(key1)).toBe(val1);
            expect(service.get(key2)).toBe(val2);
            expect(service.get(key1)).not.toBe(val2);
        });
    });

    describe('Given the controller has no pickup set, When i request pickup', function () {
        it('Then returns a blank string', function () {
            expect(controller.pickup).toBe('');
        });
    });

    describe('Given the controller has a pickup set, When i request pickup', function () {
        it('Then returns the pickup that was set', function () {
            //Arrange
            var pickup = 'pickup address';

            //Act
            controller.pickup = pickup;
            controller.setPickup();

            //Assert
            expect(controller.pickup).toBe(pickup);
        });
    });

    describe('Given the controller sets a pickup, When i check the service pickup', function () {
        it('Then has pickup recorded in the service', function () {
            //Arrange
            var pickup = 'pickup address';
            spyOn(service, 'set').and.callThrough();

            //Act
            controller.pickup = pickup;
            controller.setPickup();

            //Assert
            expect(service.set).toHaveBeenCalled();
            expect(service.get('pickup')).toBe(pickup);
        });
    });

    describe('Given the controller has no delivery set, When i request delivery', function () {
        it('Then returns a blank string', function () {
            expect(controller.delivery).toBe('');
        });
    });

    describe('Given the controller has a delivery set, When i request delivery', function () {
        it('Then returns the delivery that was set', function () {
            //Arrange
            var delivery = 'delivery address';

            //Act
            controller.delivery = delivery;
            controller.setDelivery();

            //Assert
            expect(controller.delivery).toBe(delivery);
        });
    });

    describe('Given the controller sets a delivery, When i check the service delivery', function () {
        it('Then has delivery set in the service', function () {
            //Arrange
            var delivery = 'delivery address';

            //Act
            controller.delivery = delivery;
            controller.setDelivery();

            //Assert
            expect(service.get('delivery')).toBe(delivery);
        });
    });

    describe('Given the controller has no price set, When i request price', function () {
        it('Then returns a blank string', function () {
            expect(controller.price).toBe('');
        });
    });

    describe('Given the controller has a price set, When i request price', function () {
        it('Then returns the price that was set', function () {
            //Arrange
            var price = '10.01';

            //Act
            controller.price = price;
            controller.setPrice();

            //Assert
            expect(controller.price).toBe(price);
        });
    });

    describe('Given the controller sets a price, When i check the service price', function () {
        it('Then has price set in the service', function () {
            //Arrange
            var price = '10.01';

            //Act
            controller.price = price;
            controller.setPrice();

            //Assert
            expect(service.get('price')).toBe(price);
        });
    });
});