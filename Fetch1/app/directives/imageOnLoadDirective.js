app.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                try {
                    alert(JSON.stringify(element));
                    scope.$eval(element.imageonloadFunction);
                } catch (e) {
                    alert(e.message);
                }
            });
        }
    };
});