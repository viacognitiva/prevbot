(function () {
    'use strict';

    angular.module('app.chatService', [])
        .factory('chatService', chatService);

    chatService.$inject = ['$http','$filter','$log','$q'];

    function chatService($http, $filter, $log, $q) {

        return {
            showSound: showSound,
            showLog: showLog
        };

        function showSound(){

            $http.get('/api/showSound').then(
                function(response){
                    if(response.data.retorno == 'true'){
                        return 'true';
                    }else{
                        return 'false';
                    }
                }
            )
        };

        function showLog(){

            $http.get('/api/showLog').then(
                function(response){
                    if(response.data.retorno == 'true'){
                        return true;
                    }else{
                        return false;
                    }
                }
            )
        }

    }
})();
