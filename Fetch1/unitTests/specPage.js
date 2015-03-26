/// <reference path="../resources/scripts/angular.js" />
/// <reference path="../resources/scripts/angular-animate.js" />
/// <reference path="angular-mocks.js" />
/// <reference path="../app.js" />
/// <reference path="../App/page/pageController.js" />


/*global describe,beforeEach,module,inject,it,expect */
describe('page load tests', function () {
    'use strict';
    var controller;

    beforeEach(function () {
        module('Fetch1App');
        inject(function ($injector, $controller) {
            controller = $controller('PageCtrl', { });
        });
    });

    describe('Given any previously loaded page, When i load a page with no special direction', function () {
        it('Then loads the page with animateMore set to blank', function () {
            //Arrange
            var page = 'testPath';

            //Act
            controller.load(page);

            //Assert
            expect(controller.template).toContain(page);
            expect(controller.animateMore).toBe('');
        });
    });

    describe('Given any previously loaded page, When i load a page with a special direction', function () {
        it('Then loads the page with animateMore set to that direction', function () {
            //Arrange
            var page = 'testPath';
            var direction = 'back';

            //Act
            controller.load(page, direction);

            //Assert
            expect(controller.template).toContain(page);
            expect(controller.animateMore).toContain(direction);
        });
    });

    describe('Given no previously loaded page, When i check for current template', function () {
        it('Then loads the default loading page with no override direction', function () {
            expect(controller.template).toContain('loading');
            expect(controller.animateMore).toBe('');
        });
    });

    describe('Given any template, When i load the template', function () {
        it('Then it appends a version number to the template string', function () {
            //Arrange
            var page = 'testPath';

            //Act
            controller.load(page);

            //Assert
            expect(controller.template).toContain('?ver=');
        });
    });

    describe('Given one or more pages of navigation, When i click the back button', function () {
        it('Then navigates to the previouse screen', function () {
            //Arrange
            var page1 = 'testOne',
                page2 = 'testTwo';
            controller.load(page1);
            controller.load(page2);

            //Act
            controller.back();

            //Assert
            expect(controller.template).toContain(page1);
        });
    });

    describe('Given no navigation history, When i navigate', function () {
        it('Then enables the back button', function () {
            //Arrange
            var page1 = 'testOne';

            //Act
            controller.load(page1);

            //Assert
            expect(controller.disableBack).toBe(false);
        });
    });

    describe('Given one or more pages of navigation, When i click the back button twice', function () {
        it('Then navigates two screens previouse', function () {
            //Arrange
            var page1 = 'testOne',
                page2 = 'testTwo',
                page3 = 'testThree';
            controller.load(page1);
            controller.load(page2);
            controller.load(page3);

            //Act
            controller.back();
            controller.back();

            //Assert
            expect(controller.template).toContain(page1);
        });
    });

    describe('Given one or more pages of navigation, When i click the back button to the begining of nav history', function () {
        it('Then navigates to the start screen then disables the back button', function () {
            //Arrange
            var page1 = 'testOne',
                page2 = 'testTwo';
            controller.load(page1);
            controller.load(page2);

            //Act
            controller.back();
            controller.back();
            controller.back();

            //Assert
            expect(controller.disableBack).toBe(true);
        });
    });

    describe('Given one or more pages of navigation, When i click the back button', function () {
        it('Then invokes a back transition', function () {
            //Arrange
            var page1 = 'testOne';
            controller.load(page1);

            //Act
            controller.back();

            //Assert
            expect(controller.animateMore).toBe('slide-back');
        });
    });
});