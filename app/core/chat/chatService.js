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
            getFundos: getFundos,
            setQuestionario: setQuestionario,
            setLog: setLog,
            setOutros: setOutros
        };
        
        function getQuestionario() {            

            return $http.get('/api/getquest', config)
                .then(procResponse)
                .catch(procError);
        }

        function setQuestionario(reposta, mensagem, peso) {
            
            resposta.config.data.text = mensagem;
            resposta.input.text = message;
            resposta.input.peso = parseFloat(peso);
            resposta.data.intents[0].intent ='questionario';
            resposta.data.output.generic[0].text = '';
            resposta.data.output.text[0] = '';

            for (var vlr in resposta.data.output.nodes_visited){
                delete resposta.data.output.nodes_visited[vlr]
            }

            setLog(resposta)

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

        function setLog(value) {

            $http.post('/api/gravar', value).catch(function (error) {
                console.log('Error: ' + JSON.stringify(error));
            });
            
        }

        function setOutros(value) {

            $http.post('/api/outros', value).catch(function (error) {
                console.log('Error: ' + JSON.stringify(error));
            });
            
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
