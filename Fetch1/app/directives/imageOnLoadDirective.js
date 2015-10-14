app.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                try {
                    scope.$eval(attrs.imageonloadFunction);
                } catch (e) {
                    alert(e.message);
                }
            });
        }
    };
});