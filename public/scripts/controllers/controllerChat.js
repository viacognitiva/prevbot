var app = angular.module('usuario',[]);

app.controller('chatController', ['$scope','$http', function($scope,$http) {

    $scope.inicializa = function() {

        $scope.mostrarChat = true;
        $scope.mostrarEnviar = false;
        $scope.mostrarDados = false;
        $scope.mostrarFim = true;

    },

    $scope.enviar = function() {

        var dados = {idchat: $scope.idchat, nome: $scope.nome, email: $scope.email, telefone: $scope.telefone};
        var tfone = '';

        if(typeof $scope.telefone !== undefined && $scope.telefone){
            tfone = $scope.telefone
        }else{
            tfone = '-'
        }

        var mailData = {
            from: 'Mister Xper <renato.filho@vbofficeware.com.br>',
            sendTo: 'renato.filho@vbofficeware.com.br',
            copyTo: 'rodrigo.florentino@vbofficeware.com.br',
            subject: 'Novo Usuário ChatBot - Mister Xper',
            vtext: '',
            vhtml: '<p>Um novo usuário está acessando o Mister Xper, seguem os dados:</p><b>Nome: </b>' + $scope.nome
            + '<br><b>E-mail: </b>' + $scope.email + '<br><b>Telefone: </b>' + tfone
        }

        $http.post('/salvar', dados)
        .then(
            function(response){
                $scope.mostrarChat = false;
                $scope.mostrarDados = true;
                enviaCorreio(mailData);
            },
            function(erro){
                console.log('Erro: ' + JSON.stringify(erro));
            }
        );
    }

    enviaCorreio = function(dados) {

        $http.post('/sendmail', dados)
            .then(Success)
            .catch(Failure);

        function Success(response) {
            //console.log(response.data);
            return response.data;
        }

        function Failure(error) {
            console.log('A problem occurred while sending an email.' + JSON.stringify(error));
        }

    }


}]);