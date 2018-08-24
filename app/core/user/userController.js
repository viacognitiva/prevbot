(function () {
    'use strict';

    angular.module('app.user',['ngAnimate','ngSanitize','ui.bootstrap','ngStorage'])
        .controller('userController', userController);

    userController.$inject = ['$scope','$http','$location','$localStorage'];

    function userController($scope, $http, $location,$localStorage) {

        var vm = this;
        vm.logar = logar;

        function logar(){

            $localStorage.dados = '';
            var dados = {nome: $scope.nome, email: $scope.email, telefone: $scope.telefone};
            var tfone = '';

            if(typeof $scope.telefone !== undefined && $scope.telefone){
                tfone = $scope.telefone
            }else{
                tfone = '-'
            }

            $localStorage.dados = dados;
            $location.path('/chat');

            /*
            $http.post('/api/user', dados).then(
                function(response){
                    $location.path('/chat');
                },
                function(erro){
                    console.log('Erro: ' + JSON.stringify(erro));
                }
            );
            */
        }
    }
})();
