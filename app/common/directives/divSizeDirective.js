(function () {
    'use strict';

    angular.module('app.directives.divSize', ['app'])
        .directive('divSize', divSize);

    divSize.$inject = ['$window'];

    function divSize($window) {
        return function (scope, elm, attrs) {
            elm.css('height', $window.innerHeight - 210 + 'px');
        };
    }
})();
