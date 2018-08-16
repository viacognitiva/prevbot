(function () {
    'use strict';

    angular.module('app.user',['ngAnimate','ngSanitize','ui.bootstrap'])
        .controller('userController', userController);

    userController.$inject = ['$scope','$http','$location'];

    function userController($scope, $http, $location) {

        var vm = this;
        vm.logar = logar;

        function logar(){

            var dados = {nome: $scope.nome, email: $scope.email, telefone: $scope.telefone};
            var tfone = '';

            if(typeof $scope.telefone !== undefined && $scope.telefone){
                tfone = $scope.telefone
            }else{
                tfone = '-'
            }

            $http.post('/api/user', dados).then(
                function(response){
                    $location.path('/chat');
                },
                function(erro){
                    console.log('Erro: ' + JSON.stringify(erro));
                }
            );
        }
    }
})();
