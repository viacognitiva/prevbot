(function () {
    'use strict';

    angular.module('app.chatService', [])
        .factory('chatService', chatService);

    chatService.$inject = ['$http','$filter','$log','$q'];

    function chatService($http, $filter, $log, $q) {

        return {
        };

    }
})();
