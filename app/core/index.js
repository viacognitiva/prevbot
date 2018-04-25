(function () {
    'use strict';

    angular.module('app.index',[])
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope','$log','$window'];

    function IndexController($scope, $log, $window) {

    }
})();
