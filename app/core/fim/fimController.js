(function () {
    'use strict';

    angular.module('app.fim', ['ngAnimate','ngSanitize','ui.bootstrap','ngStorage'])
        .controller('fimController', fimController);

        fimController.$inject = ['$rootScope','$scope','$log','$http','$uibModal','$window','$localStorage','$location'];

        function fimController($rootScope,$scope,$log,$http,$uibModal,$window,$localStorage,$location) {

            var vm          = this;
            vm.restartChat  = restartChat;
            var nome        = '';

            if($localStorage.dados.nome){
                nome = $localStorage.dados.nome
            }else{
                nome = $localStorage.dadosBKP.nome
            }

            vm.messageExit = nome + ', a ViaCognitiva agradece a sua visita e fica à sua disposição.';


           function restartChat() {
               $location.path('/chat');
           }

        }

})();
