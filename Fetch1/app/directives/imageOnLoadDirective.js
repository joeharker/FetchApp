app.directive('imageonload', function () {
    return {
        restrict: 'A',
        scope: {
            callback: '&imageonloadFunction'
        },
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                alert(scope.callback());
            });
        }
    };
});