var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');

var text_to_speech = new TextToSpeechV1({
    username: '5563d7a5-747d-42c2-b328-1d878cefc34c',
    password: '7cSeIyeOM8MB'
});


var textToSpeechWatson = {

     converter : (req, res, next) => {
         // console.log("synthesize"+req.body.message);
           //console.dir(req);

            var params = {
                     text:req.body.message,
                     voice: 'pt-BR_IsabelaVoice',
                     accept: 'audio/wav'
             };

          const transcript = text_to_speech.synthesize(params);
           transcript.on('response', (response) => {
             if (req.query.download) {
               if (req.query.accept && req.query.accept === 'audio/wav') {
                 response.headers['content-disposition'] = 'attachment; filename=transcript.wav';
               } else {
                 response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
               }
             }
           });
           transcript.on('error', next);
           transcript.pipe(res);

     }
}

module.exports = textToSpeechWatson;

