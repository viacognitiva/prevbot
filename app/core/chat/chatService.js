(function () {
    'use strict';

    angular.module('app.chatService', [])
        .factory('chatService', chatService);

    chatService.$inject = ['$http'];

    function chatService($http) {

        return {

        }

    }
})();
