(function () {
    'use strict';

    angular.module('app.authProvider',[])
    .provider('validateProvider', validateProvider);

    function validateProvider(){

        /*
        var configure = {
            setToken: setToken
        };

        var provider = {
            $get: validaToken,
            configure: configure
        };

        return provider;
        */

        var token = '';
        this.setToken = function(value){
            token = value;
        }

        function setToken(token){
            configure.setToken = token;
        }

        this.$get = function() {

            var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}}
            var data = {token: token};

            $http.post('/api/validate',JSON.stringify(data),config).then(function(response) {
                var data = response.data;
                console.log('retorno: ' + JSON.stringify(data));
            });

            return data;

        }

        /*
        function validaToken(){

            var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}}
            var data = {token: tkn};

            $http.post('/api/validate',JSON.stringify(data),config).then(function(response) {
                var data = response.data;
                console.log('retorno: ' + JSON.stringify(data));
            });

            return data;

        }
        */

    }

})();