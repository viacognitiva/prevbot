(function () {
    'use strict';

    angular.module('app.user',['ngAnimate','ngSanitize','ui.bootstrap'])
        .controller('userController', userController);

    userController.$inject = ['$rootScope','$scope','$location'];

    function userController($rootScope, $scope, $location) {

        var vm = this;
        vm.logar = logar;

        function logar(){

            $rootScope.dados = {nome: $scope.nome, email: $scope.email};
            $location.path('/chat');

        }
    }
})();
