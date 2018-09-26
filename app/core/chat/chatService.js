(function () {
    'use strict';

    angular.module('app.chatService', [])
        .factory('chatService', chatService);

    chatService.$inject = ['$http','$q','$log'];

    function chatService($http, $q, $log) {

        var config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };

        return {
            getQuestionario: getQuestionario,
            getCategoria: getCategoria,
            getFundos: getFundos
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

        function getFundos(valores) {

            return $http.get('/api/getfundos/' + JSON.stringify(valores), config)
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
