window.addEventListener('DOMContentLoaded', function () {

       var btn_gravacao = document.querySelector('#idPhone');
       var transcricao_audio = '';
       var esta_gravando = false;

       if(window.SpeechRecognition || window.webkitSpeechRecognition ){

          var speech_api = window.SpeechRecognition || window.webkitSpeechRecognition;
          var recebe_audio = new speech_api();
          recebe_audio.continuous = true;
          recebe_audio.interimResults = true;
          recebe_audio.lang = "pt-BR";

          recebe_audio.onstart = function(){
             esta_gravando = true;
             console.log("Gravando ...");
            document.getElementById('iconPhone').className='fa fa-microphone-slash';
            document.getElementById('iconPhone').textContent="  ouvindo..";
          };
          recebe_audio.onend = function(){
             esta_gravando = false;
             console.log("Iniciar Gravação ...");
             document.getElementById('iconPhone').className='fa fa-microphone';
             document.getElementById('iconPhone').textContent="";
          };

          recebe_audio.onerror = function(event) {
            document.getElementById('iconPhone').className='fa fa-microphone';
            document.getElementById('iconPhone').textContent="";
            console.log(" event.error"+ event.error);
          };


          recebe_audio.onresult = function(event){
                console.log("Resultado");
                console.log(event);
                transcricao_audio = event.results[0][0].transcript;
                console.log(transcricao_audio);

                var interim_transcript = '';
                for( var i = event.resultIndex; i < event.results.length; i++){
                  if(event.results[i].isFinal){
                     transcricao_audio = event.results[i][0].transcript;
                  }else{
                      interim_transcript += event.results[i][0].transcript;
                  }
                  var resultado = transcricao_audio || interim_transcript;
                  console.log("resultado gravação"+resultado);
                  document.getElementById('chatInput').value = resultado;

                }
          };

          btn_gravacao.addEventListener('click',function(e){
             console.log("click"+esta_gravando);
             if(esta_gravando){
                recebe_audio.stop();
                return;
             }
             recebe_audio.start();
          },false);



       }else{
           console.log("navegador não apresenta suporte a web speech api");
       }

},false);