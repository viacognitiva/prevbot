(function () {
    'use strict';

    angular.module('app.chatService', [])
        .factory('chatService', chatService);

    chatService.$inject = ['$http', '$q'];

    function chatService($http, $q) {

        var config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };

        return {
            getQuestionario: getQuestionario,
            getCategoria: getCategoria
        };
        
        function getQuestionario() {            

            return $http.get('/api/getquest', config)
                .then(procResponse)
                .catch(procError);
        }

        function getCategoria(peso) {

            return $http.get('/api/getcateg/'+peso, config)
                .then(procResponse)
                .catch(procError);
            
        }

        function procResponse(response) {
            return response;
        }

        function procError(error) {
            var newMessage = 'XHR Failed for chatService.';
            $log.error(newMessage);
            $log.error(error);
            return $q.reject(error);
        }

    }
})();
