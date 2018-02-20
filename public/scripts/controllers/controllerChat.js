var app = angular.module('usuario',['ngSanitize']);

app.controller('chatController', ['$scope','$http','$window', function($scope,$http,$window) {

    var params = {},
    watson = 'Watson',
    context;

    $scope.inicializa = function() {
        $scope.imgSom = 'fa fa-volume-off';
        $scope.mostrarChat = false;
        $scope.mostrarDados = true;
        $scope.mostrarEnviar = false;
        $scope.mostrarFim = true;
        $scope.ativaVoz = false;
        userMessage('');
    }

    $scope.controlaSom = function(){

        if($scope.ativaVoz){
            $scope.ativaVoz = false;
            $scope.imgSom = 'fa fa-volume-off';
        }else{
            $scope.ativaVoz = true;
            $scope.imgSom = 'fa fa-volume-up';
        }

    }

    $scope.enviar = function() {

        var dados = {idchat: $scope.idchat, nome: $scope.nome, email: $scope.email, telefone: $scope.telefone};
        var tfone = '';

        if(typeof $scope.telefone !== undefined && $scope.telefone){
            tfone = $scope.telefone
        }else{
            tfone = '-'
        }

        var mailData = {
            sendTo: '-',
            subject: 'Novo Usuário ChatBot - Alê',
            vtext: '',
            vhtml: '<p>Um novo usuário está acessando a Alê, seguem os dados:</p><b>Nome: </b>' + $scope.nome
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

    $scope.sendHistory = function(){

        var mailData = {
            sendTo: $scope.email,
            subject: 'Histórico - Alê',
            vtext: '',
            vhtml: document.getElementById('chat_box').innerHTML
        }

        enviaCorreio(mailData);
        $window.opener = $window;
        myRedirect('/chat','','');
    }

    $scope.contChat = function(){
        $scope.mostrarEnviar = false;
        $scope.mostrarFim = true;        
    }

    $scope.reiniciarChat = function(){

        $scope.mostrarEnviar = false;
        $scope.mostrarFim = true;
        document.getElementById('chat_box').innerHTML = '';
        userMessage('olá');
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

    $scope.newEvent = function(event) {

        if (event.which === 13 || event.keyCode === 13) {

            var userInput = document.getElementById('chatInput');
            text = userInput.value; // Using text as a recurring variable through functions
            text = text.replace(/(\r\n|\n|\r)/gm, ""); // Remove erroneous characters

            if (text) {
                $("#chatInput").css("border-color", "#d2d6de");
                displayMessage(text, 'user');
                userInput.value = '';
                userMessage(text);

            } else {
                console.error("No message.");
                userInput.value = '';
                $("#chatInput").css("border-color", "red");
                return false;
            }
        }
    }

    $scope.sendMessage = function () {

        if($("#chatInput").val()==''){
            $("#chatInput").css("border-color", "red");
           return;
        }

        $("#chatInput").css("border-color", "#d2d6de");
        var message = document.getElementById('chatInput');
        var texto = message.value;
        texto = texto.replace(/(\r\n|\n|\r)/gm, "");
        displayMessage(texto, 'user');
        message.value = '';
        userMessage(texto);
    }

    function userMessage(message) {

        params.text = message;
        if (context) {
            params.context = context;
        }

        var xhr = new XMLHttpRequest();
        var uri = '/api/watson';
        xhr.open('POST', uri, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {

            // Verify if there is a success code response and some text was sent
            if (xhr.status === 200 && xhr.responseText) {
                var response = JSON.parse(xhr.responseText);
                text = response.output.text; // Only display the first response
                context = response.context; // Store the context for next round of questions
                //console.log("Got response from Watson: ", JSON.stringify(response));
                //console.log('Node visitado: ' + response.output.nodes_visited);

                if(response.output.nodes_visited == 'node_4_1517338692242' || response.output.nodes_visited == 'node_5_1517338827579'){
                    $scope.mostrarEnviar = true;
                    $scope.mostrarFim = false;
                    $scope.$apply();
                }

                if(response.output.nodes_visited == 'Outros Assuntos - Retoma a Conversa'){

                    var logData = {
                        idchat: response.context.conversation_id,
                        texto: response.input.text
                    }

                    $http.post('/treinar', logData)
                        .then(Success)
                        .catch(Failure);

                    function Success(response) {
                        return response.data;
                    }

                    function Failure(error) {
                        console.log('Error: ' + JSON.stringify(error));
                    }
                }

                for (var txt in text) {
                    displayMessage(text[txt], watson);
                }

                $('#idchat').val(response.context.conversation_id).trigger("change");

                var chat = document.getElementById('chat_box');
                chat.scrollTop = chat.scrollHeight;

            } else {
                console.error('Server error for Conversation. Return status of: ', xhr.statusText);
                displayMessage("Ops, acho que meu cérebro está offline.", watson);
            }
        };

        xhr.onerror = function () {
            console.error('Network error trying to send message!');
            displayMessage("Ops, acho que meu cérebro está offline. Espera um minutinho para continuarmos por favor.", watson);
        };
        //console.log(JSON.stringify(params));
        //MENSAGEM ENVIADA
        xhr.send(JSON.stringify(params));
    }

    function displayMessage(text, user) {

        var chat = document.getElementById('chat_box');

        if (user == "user") {

             var div = document.createElement('div');
             var div0 = document.createElement('div');

             var divHora = document.createElement('div');
             var textHora= document.createTextNode(addZero(new Date().getDate())+"/"+(addZero(new Date().getMonth()+1))+"  "+addZero(new Date().getHours())+":"+addZero(new Date().getMinutes()));
             divHora.style='text-align:left;color:#cfcfcf;font-size:12px;padding-right:50px';
             divHora.appendChild(textHora);

             var user = document.createTextNode(' ');
             var userBox = document.createElement('span');
             userBox.className = 'direct-chat-name pull-left';
             div0.className = 'direct-chat-msg right';
             div.className = 'direct-chat-text';
             var img = document.createElement('img');
             img.className = 'direct-chat-img';
             img.src = 'images/img_usuario.png';
             div0.appendChild(img);
             div0.appendChild(div);

             userBox.appendChild(user);

             var message = document.createTextNode(text);
             var messageBox = document.createElement('p');
             messageBox.appendChild(userBox);
             div.appendChild(message);
             messageBox.appendChild(div0);
             messageBox.appendChild(divHora);
             chat.appendChild(messageBox);

        } else {

            var div = document.createElement('div');

            var user = document.createTextNode(' ');
            var userBox = document.createElement('span');
            user = document.createElement('img');
            user.className = 'direct-chat-img';
            user.src = 'images/logo_fb.jpg';
            div.className = 'direct-chat-text';

            userBox.appendChild(user);

            var message = document.createTextNode(text);
            var messageBox = document.createElement('p');
            messageBox.appendChild(userBox);
            div.appendChild(message);
            messageBox.appendChild(div);
            //messageBox.appendChild(divHora)

            chat.appendChild(messageBox);

            var textoHTML = $( ".direct-chat-text" ).last().html();
            //$( ".direct-chat-text" ).last().empty();
            var textoFormat = textoHTML.replace(/&lt;/g,'<').replace(/&gt;/g, '>');
            //$( ".direct-chat-text" ).last().append( textoFormat );

            var textoFormatado=text;
            textoFormatado = textoFormatado.replace(/<[^>]*>/g, "");

            var divEscrevendo = document.createElement('div');

            if ($scope.ativaVoz){

                //Mostra os tres pontos
                mostraAguarde(divEscrevendo);

                loadSound(textoFormatado, function(){
                    ocultaAguarde(messageBox,divEscrevendo,textoFormatado);
                }) ;

            }else{

                var divHora = document.createElement('div');
                var textHora= document.createTextNode(addZero(new Date().getDate())+"/"+(addZero(new Date().getMonth()+1))+"  "+addZero(new Date().getHours())+":"+addZero(new Date().getMinutes()));
                divHora.style='text-align:right;color:#cfcfcf;font-size:12px';
                divHora.appendChild(textHora);
                messageBox.appendChild(divHora);

            }

        }
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    myRedirect = function(redirectUrl, arg, value) {

        var form = $('<form action="' + redirectUrl + '" method="get">' +
        '<input type="text" name="'+ arg +'" value="' + value + '"></input></form>');
         $('body').append(form);
         $(form).submit();
   }

   function mostraAguarde(divEscrevendo) {

     var imgEscrevendo = document.createElement('img');
     imgEscrevendo.className = 'escrevendo-img';
     imgEscrevendo.src = '/images/escrevendo2.gif';
     divEscrevendo.appendChild(imgEscrevendo);

     $( ".direct-chat-text" ).last().empty();
     $( ".direct-chat-text" ).last().css( "width", "65px" );
     $( ".direct-chat-text" ).last().append(divEscrevendo);

   }

   function ocultaAguarde(messageBox,divEscrevendo, textoFormat) {
        var divHora = document.createElement('div');
        var textHora= document.createTextNode(addZero(new Date().getDate())+"/"+(addZero(new Date().getMonth()+1))+"  "+addZero(new Date().getHours())+":"+addZero(new Date().getMinutes()));
        divHora.style='text-align:right;color:#cfcfcf;font-size:12px';
        divHora.appendChild(textHora);

        divEscrevendo.style.display = "none";
        $( ".direct-chat-text" ).last().empty();
        $( ".direct-chat-text" ).last().css( "width", "" );
        $( ".direct-chat-text" ).last().append( textoFormat);
        messageBox.appendChild(divHora);

   }

}]);