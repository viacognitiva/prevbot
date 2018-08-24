(function () {
    'use strict';

    angular.module('app.aval',['ngAnimate','ngSanitize','ui.bootstrap','ngStorage'])
        .controller('avalController', avalController);

    avalController.$inject = ['$scope','$log','$http','$uibModal','$window','$location','$localStorage'];

    function avalController($scope,$log,$http,$uibModal,$window,$location,$localStorage) {

        var vm = this;
        vm.enviar = enviar;
        vm.like = like;
        vm.nlike = nlike;

        vm.like1 = 'far fa-thumbs-up';
        vm.like2 = 'far fa-thumbs-up';
        vm.like3 = 'far fa-thumbs-up';
        vm.like4 = 'far fa-thumbs-up';

        vm.nlike1 = 'far fa-thumbs-down';
        vm.nlike2 = 'far fa-thumbs-down';
        vm.nlike3 = 'far fa-thumbs-down';
        vm.nlike4 = 'far fa-thumbs-down';

        vm.quest1 = '';
        vm.quest2 = '';
        vm.quest3 = '';
        vm.quest5 = '';
        vm.comentario = '';

        function enviar(){

            var info = $localStorage.dadosBKP;
            var dados = {
                chatId: info.chatId,
                nome:info.nome,
                email: info.email,
                gostou: vm.quest1,
                interface: vm.quest2,
                recomenda: vm.quest3,
                interesse: vm.quest4,
                comentario: vm.comentario
            };

            $http.post('/api/aval', dados).catch(Failure);

            function Failure(error) {
                console.log('Error: ' + JSON.stringify(error));
            }

            dados = $localStorage.dadosBKP;
            $localStorage.dadosBKP = '';
            dados.chatId = '';
            $localStorage.dados = dados;
            $location.path('/chat');
        }

        function like(val){

            if (val == '1'){
                vm.like1 = 'fas fa-thumbs-up';
                vm.nlike1 = 'far fa-thumbs-down';
                vm.quest1 = 'Sim';
            }else if(val == '2'){
                vm.like2 = 'fas fa-thumbs-up';
                vm.nlike2 = 'far fa-thumbs-down';
                vm.quest2 = 'Sim';
            }else if(val == '3') {
                vm.like3 = 'fas fa-thumbs-up';
                vm.nlike3 = 'far fa-thumbs-down';
                vm.quest3 = 'Sim';
            }else if(val == '4') {
                vm.like4 = 'fas fa-thumbs-up';
                vm.nlike4 = 'far fa-thumbs-down';
                vm.quest4 = 'Sim';
            }

        }

        function nlike(val) {

            if (val == '1'){
                vm.like1 = 'far fa-thumbs-up';
                vm.nlike1 = 'fas fa-thumbs-down';
                vm.quest1 = 'Não';
            }else if(val == '2'){
                vm.like2 = 'far fa-thumbs-up';
                vm.nlike2 = 'fas fa-thumbs-down';
                vm.quest2 = 'Não';
            }else if(val == '3'){
                vm.like3 = 'far fa-thumbs-up';
                vm.nlike3 = 'fas fa-thumbs-down';
                vm.quest3 = 'Não';
            }else if(val == '4'){
                vm.like4 = 'far fa-thumbs-up';
                vm.nlike4 = 'fas fa-thumbs-down';
                vm.quest4 = 'Não';
            }

        }
    }
})();
