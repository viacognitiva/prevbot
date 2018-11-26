(function () {
    'use strict';

    angular.module('app.directives.campoData', ['app'])
        .directive('campoData', campoData);

    campoData.$inject = [];

    function campoData() {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div class="input-group date">' +
                '<input type="text" class="form-control" ng-model="gModel">' +
                '<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>' +
                '</div>',
            scope: {
                gModel: "="
            }
        };
    }
})();
