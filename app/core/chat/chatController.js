(function () {
    'use strict';

    angular.module('app.chat', ['ngAnimate','ngSanitize','ui.bootstrap','app.chatService'])
        .controller('chatController', chatController);

        chatController.$inject = ['$rootScope','$scope','$log','$http','$uibModal','$window','chatService'];

        function chatController($rootScope,$scope,$log,$http,$uibModal,$window,chatService) {

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
            var text = '';
            var watson = 'Watson';

            userMessage('');
            showSound();
            showLog();

            function userMessage(message) {

                params.text = message;
                if (context) {
                    params.context = context;
                }

                var config = {headers : {'Content-Type': 'application/json; charset=utf-8'}}

                $http.post('/api/watson',params,config).then(

                    function(response){

                        if(response.status == 200){
                            if(response.data.error){
                                console.error('Server error for Conversation. Return status of: ', xhr.statusText);
                                displayMessage("Ops, acho que meu cérebro está offline.", watson);
                            } else {
                                text = response.data.output.text;
                                context = response.data.context; // Store the context for next round of questions

                                if (vm.showLog){
                                    console.log("Got response from Watson: ", JSON.stringify(response));
                                }

                                for (var txt in text) {
                                    displayMessage(text[txt], watson);
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

            function sendMessage() {

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
                     img.src = 'assets/images/img_usuario.png';
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
                    user.src = 'assets/images/logo_fb.jpg';
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

               if(vm.ativaVoz){
                   vm.ativaVoz = false;
                   vm.imgSom = 'fa fa-volume-off';
               }else{
                   vm.ativaVoz = true;
                   vm.imgSom = 'fa fa-volume-up';
               }

           }

           function showSound(){

               $http.get('/api/showSound').then(
                   function(response){
                       console.log('showSound: ' + response.data.retorno);
                       if(response.data.retorno == 'true'){
                           vm.showSom = true;
                       }else{
                           vm.showSom = false;
                       }

                   }
               )
           }

           function showLog(){

               $http.get('/api/showLog').then(
                   function(response){
                       console.log('showLog: ' + response.data.retorno);
                       if(response.data.retorno == 'true'){
                           vm.showLog = true;
                       }else{
                           vm.showLog = false;
                       }
                   }
               )
           }

        }

})();
