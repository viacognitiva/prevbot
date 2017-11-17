var app = angular.module("usuario",[]);

app.controller('controller-user',function($scope, $http) {

    $scope.enviar = function() {

        var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}};
        var data = {
            username: $scope.nome,
            email: $scope.email,
            telefone: $scope.telefone
        };

        console.log('Enviar ' + username);

       $http.post('/salvar', JSON.stringify(data),config)
          .then(
              function(response){
                if(response.status==200){
                   if(response.data.user.name!=''){
                     myRedirect("/listalogs", "access_token", response.data.token);
                   }
                }
              },
              function(response){
                // failure callback
                console.log('Erro '+response);
                $scope.errorMessage="Error : "+response.data.message;
              }
           );

         },

         myRedirect = function(redirectUrl, arg, value) {
               var form = $('<form action="' + redirectUrl + '" method="post">' +
               '<input type="text" name="'+ arg +'" value="' + value + '"></input>' + '</form>');
               $('body').append(form);
               $(form).submit();
         };

});