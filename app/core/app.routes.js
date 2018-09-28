(function () {
    'use strict';
    angular.module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('', '/saudacao');
        $urlRouterProvider.when('/', '/saudacao');
       
        $stateProvider

            .state('saudacao', {
                url: '/saudacao',
                templateUrl: 'core/saudacao/saudacao.html',
                controller: 'saudacaoController',
                controllerAs: 'SC'
            })
            .state('user', {
                url: '/user',
                templateUrl: 'core/user/user.html',
                controller: 'userController',
                controllerAs: 'UC'
            })
            .state('chat', {
                url: '/chat',
                templateUrl: 'core/chat/chat.html',
                controller: 'chatController',
                controllerAs: 'CC'
            })
            /*
            .state('aval', {
                url: '/aval',
                templateUrl: 'core/aval/aval.html',
                controller: 'avalController',
                controllerAs: 'AC'
            })
            .state('fim', {
                url: '/fim',
                templateUrl: 'core/fim/fim.html',
                controller: 'fimController',
                controllerAs: 'FC'
            })
            */
        };

        angular.module('app').run(run);
        run.$inject = ['$rootScope','$location','$http'];

        function run($rootScope, $location, $http){

        };

})();
