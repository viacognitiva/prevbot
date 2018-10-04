(function () {
    'use strict';

    angular.module('app.fim', ['ngAnimate','ngSanitize','ui.bootstrap','ngStorage'])
        .controller('fimController', fimController);

    fimController.$inject = ['$rootScope','$localStorage','$location'];

    function fimController($rootScope,$localStorage,$location) {

        var vm          = this;
        vm.restartChat  = restartChat;
        vm.restartUser  = restartUser;

        vm.messageExit = $rootScope.nome + ', o PREVBOT agradece a sua visita e fica à sua disposição.';

        function restartChat() {

            $localStorage.dados = {
                nome: $rootScope.nome,
                email: $rootScope.email
            }
            $location.path('/chat');
        }

        function restartUser() {
            $location.path('/saudacao');
        }

    }
})();
