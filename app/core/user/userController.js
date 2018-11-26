(function () {
    'use strict';

    angular.module('app.user', ['ngAnimate', 'ngSanitize', 'ngMaterial', 'ngMessages', 'ui.bootstrap'])
        .controller('userController', userController);

    userController.$inject = ['$rootScope','$scope','$location'];

    function userController($rootScope, $scope, $location) {

        var vm = this;
        vm.logar = logar;
        vm.dataNasc = new Date();

        function logar(){

            $rootScope.dados = {nome: $scope.nome, email: $scope.email};
            $location.path('/chat');

        }
    }
})();
