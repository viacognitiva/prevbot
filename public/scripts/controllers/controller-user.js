angular.module('usuario').controller('userController',
    function($scope, $http){

        $scope.enviar = function() {

            var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}};
            var userInfo = {nome: $scope.nome, email: $scope.email, telefone: $scope.telefone};

            $http.post('/salvar', userInfo)
            .then(
                function(response){
                    myRedirect('/chat','dados', JSON.stringify(userInfo));
                },
                function(erro){
                    console.log('Erro: ' + JSON.stringify(erro));
                }
            );
        };

        myRedirect = function(redirectUrl,arg,value){

            var form = $('<form action="' + redirectUrl + '" method="post">' +
            '<input type="text" name="' + arg + '" value="' + value + '"></input></form>');
            $('body').append(form);
            $(form).submit();

        };

    }
);