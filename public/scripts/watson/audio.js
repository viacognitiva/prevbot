window.AudioContext = window.AudioContext || window.webkitAudioContext;
//var context = new AudioContext();



function loadSound(texto) {
  var request = new XMLHttpRequest();
  request.open("POST", "/api/synthesize", true);
  request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  request.responseType = "arraybuffer";
  //console.log('Chamando '+texto);
  const audio = document.getElementById('audio');
  audio.setAttribute('src', '');
  request.onload = function() {
     var Data = request.response;
     if (request.readyState == 4 && request.status == 200){
       var blob = new Blob([Data], {type: "audio/wav"});
       var URLObject = window.webkitURL || window.URL;
       var url = URLObject.createObjectURL(blob);
       audio.setAttribute('src', url);
      }

  };

  var jsonStr = JSON.stringify({message: texto});
  request.send(jsonStr);
};


function mycallback(data) {
   alert(data);
}


function enviarTextSound(texto,callback) {
var a = false;
  $.ajax({
      type: 'POST',
      url: '/api/textToSpeech/',
      myCallback: callback,
      data:  JSON.stringify ({message: texto}),
      success: function(data) {
         if(data=="Sucesso"){
            this.myCallback(true);
         }
       },
      contentType: "application/json",
      dataType: 'json'
  });
};


//loadSound()