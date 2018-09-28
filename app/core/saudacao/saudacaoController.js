(function () {
    'use strict';

    angular.module('app.saudacao',['ngAnimate','ngSanitize','ui.bootstrap'])
        .controller('saudacaoController', saudacaoController);

    saudacaoController.$inject = ['$location'];

    function saudacaoController($location) {

        var vm = this;
        vm.enviar = enviar;

        function enviar(){
            $location.path('/user');
        }

    }
})();
