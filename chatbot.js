var	app = require('./api/express')();

var chatbot = require('./api/bot.js');
var params = require('./api/parameters.js');
var discovery = require('./api/discovery.js');
var nlu = require('./api/nlu.js');
var textToSpeech = require('./api/text-to-speech.js');
var cloudant = require('./api/cloudant.js');

// =====================================
// WATSON CONVERSATION FOR ANA =========
// =====================================
app.post('/api/watson', function (req, res) {
    processChatMessage(req, res);
});

app.get('/api/discovery/:texto/:full', function (req, res) {
    discovery.get(req, res);
});

app.get('/api/nlu/:texto/:url', function (req, res) {
   nlu.analisar(req, res);
});

app.post('/api/synthesize', (req, res, next) => {
    textToSpeech.converter(req, res , next);
});

app.get('/api/showSound', function (req, res) {
    params.showSound(req,res);
});

app.get('/api/showLog', function (req, res) {
    params.showLog(req, res);
});

app.post('/api/outros', function (req, res) {
    cloudant.insertOutros(req,res);
});

app.post('/api/gravar', function (req, res) {
    cloudant.insertChat(req,res);
});

function processChatMessage(req, res) {

    chatbot.sendMessage(req, function (err, data) {
        if (err) {
            console.log("Error in sending message: ", err);
            res.status(err.code || 500).json(err);
        }
        else {
            var context = data.context;
            res.status(200).json(data);
        }
    });

}

app.listen(app.get('port'), function() {
    console.log('ChatBot is running on port', app.get('port'));
});