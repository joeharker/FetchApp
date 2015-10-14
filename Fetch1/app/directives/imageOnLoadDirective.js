app.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                alert("s="+ JSON.stringify(scope) +" e="+ JSON.stringify(element) +" a="+ JSON.stringify(attrs));
            });
        }
    };
});