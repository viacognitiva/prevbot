(function () {
    'use strict';

    angular.module('app.fim', ['ngAnimate','ngSanitize','ui.bootstrap','ngStorage'])
        .controller('fimController', fimController);

        fimController.$inject = ['$rootScope','$scope','$log','$http','$uibModal','$window','$localStorage','$location'];

        function fimController($rootScope,$scope,$log,$http,$uibModal,$window,$localStorage,$location) {

            var vm          = this;
            vm.restartChat  = restartChat;


           function restartChat() {
               $location.path('/chat');
           }

        }

})();
