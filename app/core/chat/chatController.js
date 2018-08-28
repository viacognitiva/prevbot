(function () {
    'use strict';

    angular.module('app.chat', ['ngAnimate','ngSanitize','ui.bootstrap','ngStorage'])
        .controller('chatController', chatController);

        chatController.$inject = ['$rootScope','$scope','$log','$http','$uibModal','$window','$localStorage','$location'];

        function chatController($rootScope,$scope,$log,$http,$uibModal,$window,$localStorage,$location) {

            var vm              = this;
            vm.controlaSom      = controlaSom;
            vm.displayMessage   = displayMessage;
            vm.newEvent         = newEvent;
            vm.sendMessage      = sendMessage;

            vm.imgSom = 'fa fa-volume-off';
            vm.ativaVoz = false;
            vm.showSom = false;
            vm.showLog = false;

            var params = {};
            var context = '';
            var watson = 'Watson';
            var quest  ='';
            var text = '';
            var idchat = '';
            var dados = {};
            var ntexto = '';
            var nome = '';

            userMessage();
            showSound();
            showLog();

            function userMessage(message) {

                params.text = message;
                if (context) {
                    params.context = context;
                }

                var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}};

                $http.post('/api/watson',params,config).then(

                    function(response){

                        if(response.status == 200){
                            if(response.data.error){
                                console.error('Server error for Conversation. Return status of: ', xhr.statusText);
                                displayMessage("Ops, acho que meu cérebro está offline.", watson);
                            } else {

                                idchat = response.data.context.conversation_id;
                                dados = $localStorage.dados;

                                if(dados){

                                    dados.chatId = idchat;

                                    $http.post('/api/user', dados).then(
                                        function(response){
                                            $localStorage.dadosBKP = dados;
                                            $localStorage.dados = '';
                                        },
                                        function(erro){
                                            console.log('Erro: ' + JSON.stringify(erro));
                                        }
                                    );

                                }

                                context = response.data.context; // Store the context for next round of questions

                                if (vm.showLog){
                                    console.log("Got response from Watson: ");
                                    console.log(response);
                                }

                                if (!message == ''){

                                    if(response.data.output.nodes_visited === 'Outras Opções') {

                                        var logData = {
                                            idchat: idchat,
                                            texto: response.data.input.text
                                        };

                                        $http.post('/api/outros', logData).catch(Failure);

                                        // noinspection JSAnnotator
                                        function Failure(error) {
                                            console.log('Error: ' + JSON.stringify(error));
                                        }

                                    } else if(response.data.output.nodes_visited[0] === 'Despedida'){
                                        $location.path('/fim');
                                        return false;
                                    } else if(response.data.output.nodes_visited[0] === 'node_10_1535121665869'){
                                        $location.path('/aval');
                                        return false;
                                    } else {
                                        $http.post('/api/gravar', response).catch(Failure);

                                        // noinspection JSAnnotator
                                        function Failure(error) {
                                            console.log('Error: ' + JSON.stringify(error));
                                        }

                                    }

                                }

                                if (!response.data.output.text[0] == ''){

                                    text = response.data.output.text;

                                    if($localStorage.dados.nome){
                                        nome = $localStorage.dados.nome
                                    }else{
                                        nome = $localStorage.dadosBKP.nome
                                    }

                                    for (var txt in text) {
                                        ntexto = text[txt].replace('[nome]',nome);
                                        displayMessage(ntexto, watson);
                                    }

                                } else {

                                    if (response.data.output.generic[0].response_type == 'option'){

                                        quest = '<p>' +response.data.output.generic[0].title + '</p><ul>';
                                        text = response.data.output.generic[0].options;

                                        for (var txt in text) {
                                            quest += '<li>' + text[txt].label + '</li>';
                                        }

                                        quest += '</ul>';
                                        displayMessage(quest, watson);


                                    } else if(response.data.output.generic[0].response_type == 'image'){

                                        displayMessage("<img src='" + response.data.output.generic[0].source + "'>", watson);

                                    }

                                }

                                var chat = document.getElementById('chat_box');
                                chat.scrollTop = chat.scrollHeight;
                            }
                        }
                    },
                    function(error){
                        console.error('Network error trying to send message!');
                        displayMessage("Ops, acho que meu cérebro está offline. Espera um minutinho para continuarmos por favor.", watson);
                    }
                );

            }

            function newEvent(event) {

                if (event.which === 13 || event.keyCode === 13) {

                    var userInput = document.getElementById('chatInput');
                    text = userInput.value; // Using text as a recurring variable through functions
                    text = text.replace(/(\r\n|\n|\r)/gm, ""); // Remove erroneous characters

                    if (text) {
                        $("#chatInput").addClass("ok");
                        $("#chatInput").removeClass("erro");
                        displayMessage(text, 'user');
                        userInput.value = '';
                        userMessage(text);

                    } else {
                        console.error("No message.");
                        userInput.value = '';
                        $("#chatInput").addClass("erro");
                        $("#chatInput").removeClass("ok");
                        return false;
                    }
                }
            }

            function sendMessage() {

                if($("#chatInput").val()==''){
                    $("#chatInput").addClass("erro");
                    $("#chatInput").removeClass("ok");
                   return;
                }

                $("#chatInput").addClass("ok");
                $("#chatInput").removeClass("erro");
                var message = document.getElementById('chatInput');
                var texto = message.value;
                texto = texto.replace(/(\r\n|\n|\r)/gm, "");
                displayMessage(texto, 'user');
                message.value = '';
                userMessage(texto);
            }

            function displayMessage(text, user) {

                var chat = document.getElementById('chat_box');

                if (user == "user") {

                     var div = document.createElement('div');
                     var div0 = document.createElement('div');

                     var divHora = document.createElement('div');
                     var textHora= document.createTextNode(addZero(new Date().getDate())+"/"+(addZero(new Date().getMonth()+1))+"  "+addZero(new Date().getHours())+":"+addZero(new Date().getMinutes()));
                     divHora.setAttribute("class", "dataHoraUser" );
                     divHora.appendChild(textHora);

                     var user = document.createTextNode(' ');
                     var userBox = document.createElement('span');
                     userBox.className = 'direct-chat-name pull-left';
                     div0.className = 'direct-chat-msg right';
                     div.className = 'direct-chat-text';

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
                    div.className = 'direct-chat-text';

                    userBox.appendChild(user);

                    var message = document.createTextNode(text);
                    var messageBox = document.createElement('p');
                    messageBox.appendChild(userBox);
                    div.appendChild(message);
                    messageBox.appendChild(div);

                    chat.appendChild(messageBox);

                    var textoHTML = $( ".direct-chat-text" ).last().html();
                    var textoFormat = textoHTML.replace(/&lt;/g,'<').replace(/&gt;/g, '>');

                    var divEscrevendo = document.createElement('div');

                    if (vm.ativaVoz){

                        mostraAguarde(divEscrevendo);

                        loadSound(textoFormat, function(){
                            ocultaAguarde(messageBox,divEscrevendo,textoFormat);
                        }) ;

                    }else{

                        $( ".direct-chat-text" ).last().empty();
                        $( ".direct-chat-text" ).last().css( "width", "" );
                        $( ".direct-chat-text" ).last().append( textoFormat);

                        var divHora = document.createElement('div');
                        var textHora= document.createTextNode(addZero(new Date().getDate())+"/"+(addZero(new Date().getMonth()+1))+"  "+addZero(new Date().getHours())+":"+addZero(new Date().getMinutes()));
                        divHora.setAttribute("class", "dataHora" );
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

           function mostraAguarde(divEscrevendo) {

             var imgEscrevendo = document.createElement('img');
             imgEscrevendo.className = 'escrevendo-img';
             imgEscrevendo.src = 'assets/images/escrevendo2.gif';
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

           function controlaSom(){

               if($scope.ativaVoz){
                   $scope.ativaVoz = false;
                   vm.imgSom = 'fa fa-volume-off';
               }else{
                   $scope.ativaVoz = true;
                   vm.imgSom = 'fa fa-volume-up';
               }

           }

           function showSound(){

               $http.get('/api/showSound').then(
                   function(response){
                       if(response.data.retorno == 'true'){
                           vm.showSom = true;
                       }else{
                           vm.showSom = false;
                       }

                   }
               );
           }

           function showLog(){

               $http.get('/api/showLog').then(
                   function(response){
                       if(response.data.retorno == 'true'){
                           vm.showLog = true;
                       }else{
                           vm.showLog = false;
                       }
                   }
               );
           }

        }

})();
