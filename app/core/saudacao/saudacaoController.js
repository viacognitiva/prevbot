(function () {
    'use strict';

    angular.module('app.saudacao',['ngAnimate','ngSanitize','ui.bootstrap'])
        .controller('saudacaoController', saudacaoController);

    saudacaoController.$inject = ['$scope','$log','$http','$uibModal','$window','$location'];

    function saudacaoController($scope,$log,$http,$uibModal,$window,$location) {

        var vm = this;
        vm.enviar = enviar;

        function enviar(){
            $location.path('/user');
        }

    }
})();
