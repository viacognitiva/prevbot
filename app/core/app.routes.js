(function () {
    'use strict';
    angular.module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/chat');

        $stateProvider
            .state('chat', {
                url: '/chat',
                templateUrl: 'core/chat/chat.html',
                controller: 'chatController',
                controllerAs: 'CC'
            })
        };

        angular.module('app').run(run);
        run.$inject = ['$rootScope','$location','$http'];

        function run($rootScope, $location, $http){

        };

})();