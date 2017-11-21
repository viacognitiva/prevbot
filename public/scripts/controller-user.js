var app = angular.module('usuario', []);

app.controller('userController', ['$window','$scope', '$http', function($window,$scope,$http) {

    $scope.enviar = function() {

        var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}};
        var data = { nome: $scope.nome,email: $scope.email,telefone: $scope.telefone};

        $http.post('/salvar', JSON.stringify(data))
        .then(
            function(retorno){
                console.log(retorno.data);
                $window.location.href = retorno.data;
                //$http.post('/chat');
            },
            function(erro){
                console.log('Erro: ' + JSON.stringify(erro));
            }
        );
    };

}]);

